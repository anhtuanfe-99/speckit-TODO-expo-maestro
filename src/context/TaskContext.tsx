import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskAction, TaskFilter, TaskState } from '../types/task';
import { initDatabase, insertTask, updateTask, deleteTask as deleteTaskDb, getTasks } from '../services/db';

interface TaskContextValue {
  tasks: Task[];
  activeCount: number;
  filter: TaskFilter;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS': {
      const allTasks = action.tasks;
      const filtered = applyFilter(allTasks, state.filter);
      const active = allTasks.filter((t) => !t.completed).length;
      return { ...state, allTasks, tasks: filtered, activeCount: active };
    }

    case 'ADD_TASK': {
      const now = Date.now();
      const newTask: Task = {
        id: uuidv4(),
        title: action.title.trim(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      // Persist immediately
      insertTask(newTask).catch(console.error);
      const allTasks = [newTask, ...state.allTasks];
      const filtered = applyFilter(allTasks, state.filter);
      const active = allTasks.filter((t) => !t.completed).length;
      return { ...state, allTasks, tasks: filtered, activeCount: active };
    }

    case 'TOGGLE_TASK': {
      const allTasks = state.allTasks.map((t) =>
        t.id === action.id
          ? { ...t, completed: !t.completed, updatedAt: Date.now() }
          : t
      );
      const toggled = allTasks.find((t) => t.id === action.id);
      if (toggled) {
        updateTask(toggled).catch(console.error);
      }
      const filtered = applyFilter(allTasks, state.filter);
      const active = allTasks.filter((t) => !t.completed).length;
      return { ...state, allTasks, tasks: filtered, activeCount: active };
    }

    case 'DELETE_TASK': {
      deleteTaskDb(action.id).catch(console.error);
      const allTasks = state.allTasks.filter((t) => t.id !== action.id);
      const filtered = applyFilter(allTasks, state.filter);
      const active = allTasks.filter((t) => !t.completed).length;
      return { ...state, allTasks, tasks: filtered, activeCount: active };
    }

    case 'SET_FILTER': {
      const filtered = applyFilter(state.allTasks, action.filter);
      return { ...state, filter: action.filter, tasks: filtered };
    }

    default:
      return state;
  }
}

function applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'completed') return tasks.filter((t) => t.completed);
  return tasks;
}

const initialState: TaskState = {
  tasks: [],
  allTasks: [],
  filter: 'all',
  activeCount: 0,
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(taskReducer, initialState);

  // Initialise DB and load tasks on mount
  useEffect(() => {
    (async () => {
      await initDatabase();
      const tasks = await getTasks('all');
      rawDispatch({ type: 'SET_TASKS', tasks });
    })();
  }, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks: state.tasks,
      activeCount: state.activeCount,
      filter: state.filter,
      addTask: (title: string) => rawDispatch({ type: 'ADD_TASK', title }),
      toggleTask: (id: string) => rawDispatch({ type: 'TOGGLE_TASK', id }),
      deleteTask: (id: string) => rawDispatch({ type: 'DELETE_TASK', id }),
      setFilter: (filter: TaskFilter) => rawDispatch({ type: 'SET_FILTER', filter }),
    }),
    [state.tasks, state.activeCount, state.filter]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
