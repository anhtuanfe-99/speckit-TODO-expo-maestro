# Data Model: Task Management

**Derived from**: Layer 3 — Entity Model in `specs/001-task-management/spec.md`
**Date**: 2026-06-18

## Domain Types

```typescript
// A single task item in the list
interface Task {
  id: string;           // unique identifier (UUID)
  title: string;        // short description of the task
  status: TaskStatus;   // active or completed
}

type TaskStatus = 'active' | 'completed';

// The shape of the filter selection
type FilterOption = 'all' | 'active' | 'completed';
```

## State Shape (React)

```typescript
interface TaskListState {
  tasks: Task[];               // all tasks, regardless of filter
  activeFilter: FilterOption;  // currently selected filter
  editingTaskId: string | null; // id of task being edited, null if none
  inputText: string;           // current text in the new-task input
}
```

## Derived Data

```typescript
// Filtered list derived from tasks and activeFilter
function getFilteredTasks(tasks: Task[], filter: FilterOption): Task[] {
  switch (filter) {
    case 'all':
      return tasks;
    case 'active':
      return tasks.filter(t => t.status === 'active');
    case 'completed':
      return tasks.filter(t => t.status === 'completed');
  }
}

// Counts for display
function getCounts(tasks: Task[]) {
  return {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
}
```

## Validation Rules

| Field | Rule | Behavior |
|-------|------|----------|
| `title` | Must be non-empty after trimming | Empty/whitespace-only input is discarded |
| `title` | Max 500 characters | Enforced by TextInput `maxLength` prop |
| `status` | Only `'active'` or `'completed'` | TypeScript enum ensures valid values |
| `id` | Unique, non-empty string | Generated via `Date.now().toString()` or `Math.random()` for simplicity |

## State Transitions

```
[User types title + confirms]
              |
              v
        ┌──────────┐
        │  active  │
        └──────────┘
         /        \
    [toggle]    [delete]
       /            \
      v              v
┌──────────┐    (removed)
│completed │
└──────────┘
      |
  [toggle]
      |
      v
  (back to active)
```

- **active → completed**: User taps completion toggle
- **completed → active**: User taps completion toggle (toggle off)
- **active/completed → deleted**: User triggers delete action
