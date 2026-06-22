export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export type TaskAction =
  | { type: 'ADD_TASK'; title: string }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_FILTER'; filter: TaskFilter }
  | { type: 'SET_TASKS'; tasks: Task[] };

export interface TaskState {
  tasks: Task[];
  allTasks: Task[];
  filter: TaskFilter;
  activeCount: number;
}
