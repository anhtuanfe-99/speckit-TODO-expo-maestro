# Feature Specification: Task Management

**Feature Branch**: `001-task-management`

**Created**: 2026-06-18

**Status**: Draft

**Input**: A lightweight mobile app that lets users: Create a task, Edit a task, Mark a task as completed, Delete a task, Filter tasks (All / Active / Completed)

---

## Layer 1 — Business Requirement

### Why

Users need a simple, fast way to manage personal tasks directly on their mobile device. A task list is the foundational feature of any productivity app — it must be immediately usable with zero learning curve.

### Measurable Goal

Users can add, modify, and complete tasks in under 10 seconds per action without navigating away from the main screen.

### Out of Scope

- User authentication or multi-user support
- Cloud sync or persistent storage across sessions
- Due dates, reminders, recurring tasks
- Task categories, tags, or priority levels
- Undo after delete

---

## Layer 2 — Use Cases

### UC-01: Create a Task

| Field | Value |
|-------|-------|
| **Actor** | App user |
| **Trigger** | User taps the add task button or input field |
| **Preconditions** | App is open on the task list screen |

**Main Flow:**

1. User taps the add task input or button
2. System shows a text input focused and ready for typing
3. User types the task title
4. User confirms (tap submit / press enter / tap done)
5. System adds the task to the list with "active" status
6. System clears the input field for the next task

**Alternative Flows:**

- **A1 — Empty title**: User taps confirm without entering text. System discards the empty entry. No task is created.
- **A2 — Whitespace-only title**: User enters only spaces. System treats it as empty and discards it.

**Exceptions:**

- None (in-memory state, no network dependency)

---

### UC-02: Edit a Task

| Field | Value |
|-------|-------|
| **Actor** | App user |
| **Trigger** | User taps an existing task title |
| **Preconditions** | At least one task exists in the list |

**Main Flow:**

1. User taps the title of an existing task
2. System switches the title text into an editable input
3. User modifies the title text
4. User confirms the edit (tap done / submit / tap away)
5. System updates the task title in the list
6. System reverts the input back to static text

**Alternative Flows:**

- **A1 — Cancel**: User taps away or presses cancel without changing the title. System reverts to the original text. No change is saved.
- **A2 — Empty after edit**: User clears the title during editing and confirms. System reverts to the original title. The task is not deleted.
- **A3 — Whitespace-only after edit**: User enters only spaces and confirms. System treats it as unchanged and keeps the original title.

**Exceptions:**

- None (in-memory state, single-user)

---

### UC-03: Complete a Task

| Field | Value |
|-------|-------|
| **Actor** | App user |
| **Trigger** | User taps the completion checkbox / toggle on a task |
| **Preconditions** | At least one task exists in the list |

**Main Flow:**

1. User taps the completion toggle (checkbox / circle) on a task
2. System toggles the task status between "active" and "completed"
3. Visual state updates: completed tasks show a strikethrough or dimmed appearance
4. Task remains visible or disappears from list depending on the active filter

**Alternative Flows:**

- **A1 — Un-complete**: User taps the completion toggle on an already-completed task. System reverts it back to "active" status.

**Exceptions:**

- None

---

### UC-04: Delete a Task

| Field | Value |
|-------|-------|
| **Actor** | App user |
| **Trigger** | User performs a delete action on a task (swipe / long press / delete button) |
| **Preconditions** | At least one task exists in the list |

**Main Flow:**

1. User triggers the delete action on a specific task
2. System removes the task from the list immediately
3. The remaining tasks reflow to fill the gap

**Alternative Flows:**

- None

**Exceptions:**

- None

---

### UC-05: Filter Task List

| Field | Value |
|-------|-------|
| **Actor** | App user |
| **Trigger** | User selects a filter option (All / Active / Completed) |
| **Preconditions** | At least one task exists |

**Main Flow:**

1. User taps a filter control (segmented control, tabs, or picker)
2. System filters the visible task list:
   - **All**: Shows every task regardless of status
   - **Active**: Shows only tasks with "active" status
   - **Completed**: Shows only tasks with "completed" status
3. Filtered list updates immediately
4. Empty-state message is shown when no tasks match the current filter

**Alternative Flows:**

- **A1 — No tasks match**: When the filter yields zero results, system displays a contextual empty-state message (e.g., "No completed tasks yet" or "No active tasks").

**Exceptions:**

- None

---

## Layer 3 — Entity Model

### Task

| Aspect | Description |
|--------|-------------|
| **Represents** | A single unit of work or to-do item the user wants to track |
| **States** | `active` — not yet completed; `completed` — marked as done |
| **Conceptual Fields** | `id` — unique identifier; `title` — short description of the task; `status` — active or completed |
| **Relationships** | A task list contains zero or more tasks. No other entities reference a task directly. |

---

## Layer 4 — Acceptance Criteria

### UC-01: Create a Task

#### AC-1: Task created with valid title

→ e2e: `e2e/flows/001-task-management/UC-01-create-task/AC-1-task-created-with-valid-title.yaml`
→ test-name: `UC-01_AC-1_task-created-with-valid-title`

**Given** the app is open on the task list screen showing an empty list
**When** the user types "Buy groceries" into the new task input and confirms
**Then** the task "Buy groceries" appears in the list with unchecked/active status
**And** the input field is cleared

#### AC-2: Empty title rejected

→ e2e: `e2e/flows/001-task-management/UC-01-create-task/AC-2-empty-title-rejected.yaml`
→ test-name: `UC-01_AC-2_empty-title-rejected`

**Given** the app is open on the task list screen
**When** the user attempts to confirm an empty task input
**Then** no new task is created
**And** the list remains unchanged

---

### UC-02: Edit a Task

#### AC-1: Title edited successfully

→ e2e: `e2e/flows/001-task-management/UC-02-edit-task/AC-1-title-edited-successfully.yaml`
→ test-name: `UC-02_AC-1_title-edited-successfully`

**Given** the task list contains a task titled "Buy groceries"
**When** the user taps "Buy groceries", changes it to "Buy vegetables", and confirms
**Then** the task title updates to "Buy vegetables"

#### AC-2: Edit cancelled

→ e2e: `e2e/flows/001-task-management/UC-02-edit-task/AC-2-edit-cancelled.yaml`
→ test-name: `UC-02_AC-2_edit-cancelled`

**Given** the task list contains a task titled "Buy groceries"
**When** the user taps "Buy groceries", modifies the text, and cancels without confirming
**Then** the task title remains "Buy groceries"

---

### UC-03: Complete a Task

#### AC-1: Task marked as completed

→ e2e: `e2e/flows/001-task-management/UC-03-complete-task/AC-1-task-marked-completed.yaml`
→ test-name: `UC-03_AC-1_task-marked-completed`

**Given** the task list contains an active task titled "Buy groceries"
**When** the user taps the completion toggle on "Buy groceries"
**Then** "Buy groceries" shows as completed (strikethrough / dimmed)
**And** the completion toggle reflects the completed state

#### AC-2: Completed task reverted to active

→ e2e: `e2e/flows/001-task-management/UC-03-complete-task/AC-2-completed-task-reverted.yaml`
→ test-name: `UC-03_AC-2_completed-task-reverted`

**Given** the task list contains a completed task titled "Buy groceries"
**When** the user taps the completion toggle on "Buy groceries"
**Then** "Buy groceries" reverts to active/unchecked state

---

### UC-04: Delete a Task

#### AC-1: Task deleted

→ e2e: `e2e/flows/001-task-management/UC-04-delete-task/AC-1-task-deleted.yaml`
→ test-name: `UC-04_AC-1_task-deleted`

**Given** the task list contains a task titled "Buy groceries"
**When** the user performs the delete action on "Buy groceries"
**Then** "Buy groceries" is removed from the list
**And** the total task count decreases by one

---

### UC-05: Filter Task List

#### AC-1: Filter shows all tasks

→ e2e: `e2e/flows/001-task-management/UC-05-filter-tasks/AC-1-filter-shows-all-tasks.yaml`
→ test-name: `UC-05_AC-1_filter-shows-all-tasks`

**Given** the task list contains one active task and one completed task
**When** the user selects the "All" filter
**Then** both the active and completed tasks are visible

#### AC-2: Filter shows active tasks only

→ e2e: `e2e/flows/001-task-management/UC-05-filter-tasks/AC-2-filter-shows-active-tasks.yaml`
→ test-name: `UC-05_AC-2_filter-shows-active-tasks`

**Given** the task list contains one active task and one completed task
**When** the user selects the "Active" filter
**Then** only the active task is visible
**And** the completed task is hidden

#### AC-3: Filter shows completed tasks only

→ e2e: `e2e/flows/001-task-management/UC-05-filter-tasks/AC-3-filter-shows-completed-tasks.yaml`
→ test-name: `UC-05_AC-3_filter-shows-completed-tasks`

**Given** the task list contains one active task and one completed task
**When** the user selects the "Completed" filter
**Then** only the completed task is visible
**And** the active task is hidden

#### AC-4: Empty state when no tasks match filter

→ e2e: `e2e/flows/001-task-management/UC-05-filter-tasks/AC-4-empty-state-no-matching-tasks.yaml`
→ test-name: `UC-05_AC-4_empty-state-no-matching-tasks`

**Given** the task list has no completed tasks
**When** the user selects the "Completed" filter
**Then** an appropriate empty-state message is shown (e.g., "No completed tasks yet")

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: A new task can be created and visible in the list within 2 seconds of opening the app
- **SC-002**: Any task management action (create, edit, complete, delete) completes in a single screen with no navigation
- **SC-003**: Filter switching is instant — no perceivable delay when toggling between All / Active / Completed
- **SC-004**: All acceptance criteria are verified by automated tests that run without manual intervention before the feature is considered complete

## Assumptions

- **Single-user**: The app serves one user locally. No authentication, sharing, or collaboration.
- **In-memory state**: Task data lives in React component state. Refreshing the app resets all data.
- **Minimal task model**: A task consists of a title and a completion status. No descriptions, due dates, or tags in this version.
- **Inline editing**: Editing a task happens in-place on the list screen (tap title → edit → confirm), not on a separate screen or modal.
- **No delete confirmation**: Deletion is immediate with no confirmation dialog. Aligns with lightweight mobile pattern.
- **Segmented filter control**: Filters are presented as a horizontal segmented control (All / Active / Completed) at the top of the list.
- **Swipe to delete**: The primary delete gesture is a horizontal swipe on the task row. Alternative methods (long press, delete button) may be added but are not required.
