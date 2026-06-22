# Architecture
<!-- Read by every /speckit.plan run before planning a feature.   -->
<!-- Set once per project; updated deliberately, not per-feature. -->

## Navigation

**Expo Router** — file-based routing.

Single route:
- `app/index.tsx` — main task list screen

No tab bars, no drawers, no nested layouts. The entire app is one
screen with a text input at the top, a filter bar, and a scrollable
task list.

## Shared Data Model

<!-- Entities used by 2+ features only. Feature-specific entities  -->
<!-- belong in that feature's own spec.md Layer 3.                 -->

### Task

A single actionable item the user wants to track.

**States:** `active` → `completed` (one-way). Deletion removes the
entity entirely — there is no "trash" or "archived" state.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Primary key. Generated at creation. |
| `title` | string | Free-text, user-supplied. |
| `completed` | boolean | `false` = active, `true` = done. |
| `createdAt` | number (unix ms) | Set once on creation. |
| `updatedAt` | number (unix ms) | Updated on complete, uncomplete, edit — but v1 has no edit. |

## Storage

**expo-sqlite** — native SQLite via `expo-sqlite`.

Chosen over AsyncStorage because filtering (All / Active / Completed)
maps directly to a SQL `WHERE` clause and avoids loading every row
into memory.

Access code location: `src/services/db.ts`

Responsibilities:
- Schema creation (migrations) on first launch
- CRUD operations: `insertTask`, `updateTask`, `deleteTask`
- Query operations: `getTasks(filter)`, `getActiveCount()`

## State Management

**React Context + useReducer.**

Single `TaskContext` provides:
- `tasks: Task[]` — the current filtered task list
- `activeCount: number` — count of incomplete tasks
- `dispatch` — actions: `ADD_TASK`, `TOGGLE_TASK`, `DELETE_TASK`, `SET_FILTER`

The context wraps the entire app in `App.tsx`.

Custom hook: `useTasks()` at `src/hooks/useTasks.ts`

The reducer is the single source of truth after every DB write. On
app launch, the context initialises state from SQLite via `getTasks`.

## Maestro Mode

See constitution.md §13. Current: `local-expo-go`

## Cross-Cutting Constraints

- Every interactable element MUST have a `testID` in `snake_case`
  format (see constitution.md §5).
- Task row testID: `task_row_{task.id}` (UUID-keyed, not index-based).
- All Maestro flows use `local-expo-go` mode — no dev-client build
  required. App launch via `maestro: app.launch("com.speckit.todo")`
  or similar Expo Go bundle ID.
