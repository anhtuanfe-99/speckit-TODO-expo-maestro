import * as SQLite from 'expo-sqlite';
import { Task, TaskFilter } from '../types/task';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('todos.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         TEXT PRIMARY KEY,
      title      TEXT    NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
  `);
}

function requireDb(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialised. Call initDatabase() first.');
  }
  return db;
}

function rowToTask(row: {
  id: string;
  title: string;
  completed: number;
  created_at: number;
  updated_at: number;
}): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function insertTask(task: Task): Promise<void> {
  const database = requireDb();
  await database.runAsync(
    'INSERT INTO tasks (id, title, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [task.id, task.title, task.completed ? 1 : 0, task.createdAt, task.updatedAt]
  );
}

export async function updateTask(task: Task): Promise<void> {
  const database = requireDb();
  await database.runAsync(
    'UPDATE tasks SET title = ?, completed = ?, updated_at = ? WHERE id = ?',
    [task.title, task.completed ? 1 : 0, task.updatedAt, task.id]
  );
}

export async function deleteTask(id: string): Promise<void> {
  const database = requireDb();
  await database.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

function filterClause(filter: TaskFilter): string {
  if (filter === 'active') return 'WHERE completed = 0';
  if (filter === 'completed') return 'WHERE completed = 1';
  return '';
}

export async function getTasks(filter: TaskFilter = 'all'): Promise<Task[]> {
  const database = requireDb();
  const where = filterClause(filter);
  const rows = await database.getAllAsync<{
    id: string;
    title: string;
    completed: number;
    created_at: number;
    updated_at: number;
  }>(`SELECT * FROM tasks ${where} ORDER BY created_at DESC`);
  return rows.map(rowToTask);
}

export async function getActiveCount(): Promise<number> {
  const database = requireDb();
  const result = await database.getFirstAsync<{ 'COUNT(*)': number }>(
    'SELECT COUNT(*) FROM tasks WHERE completed = 0'
  );
  return result?.['COUNT(*)'] ?? 0;
}
