# testID Inventory: Task Management

**Purpose**: Every testID used by Maestro flows, mapped to its component and AC usage.

**Rule**: All `snake_case`. No array-index suffixes. Use Maestro `index:` for list items.

## Input Controls

| testID | Component | Used By ACs |
|--------|-----------|-------------|
| `task_input` | `TextInput` for creating new tasks | UC-01 AC-1, UC-01 AC-2 |
| `add_task_button` | Submit button for new task creation | UC-01 AC-2 |
| `cancel_edit_button` | Cancel button during task editing | UC-02 AC-2 |

## Task List Items

| testID | Component | Used By ACs |
|--------|-----------|-------------|
| `task_item` | Root `View` for each task row | UC-01 AC-1, UC-02 AC-1/2, UC-03 AC-1/2, UC-04 AC-1 |
| `task_title` | Task title text / inline edit input | UC-02 AC-1, UC-02 AC-2 |
| `task_checkbox` | Completion toggle (Pressable) | UC-03 AC-1, UC-03 AC-2, UC-05 AC-1/2/3 |
| `task_completed` | Indicator of completed state (visible when completed) | UC-03 AC-1, UC-03 AC-2 |
| `delete_button` | Delete action trigger | UC-04 AC-1 |

## Filter Controls

| testID | Component | Used By ACs |
|--------|-----------|-------------|
| `filter_all` | Filter option: All | UC-05 AC-1 |
| `filter_active` | Filter option: Active | UC-05 AC-2, UC-05 AC-4 |
| `filter_completed` | Filter option: Completed | UC-05 AC-3, UC-05 AC-4 |

## Empty State

| testID | Component | Used By ACs |
|--------|-----------|-------------|
| `empty_state` | Empty state message View | UC-05 AC-4 |

## Selector Rules (for Maestro flows)

- **Use `id:` selectors for all interactions** (taps, inputText). testID is the canonical hook.
- **Use `text:` selectors for assertions only** (assertVisible with text:). Never use text: for taps.
- **List items**: Reference by `id: task_item` — if multiple items exist, use `index:` to disambiguate.
- **Completed tasks**: Checked by presence of `task_completed` testID, not by visual style.
