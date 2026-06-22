# Product Vision: Todo App

## Problem

Existing todo apps either bury simple task management under folders, tags, due dates, and collaboration features, or they disappear when the phone restarts. There is no middle ground — a mobile todo list that is instant to open, fast to use, and never loses data.

## User

A person who reaches for their phone half a dozen times a day to jot down or check off a task. They want one tap to add, one tap to complete, and zero surprises about what they already finished. They do not want categories, priorities, or team features — just a list that works.

## Goal

1. **Time to add a task** ≤ 3 seconds from app open (measured by stopwatch on first-tap-to-saved latency).
2. **Zero data loss** — every task added survives app restart (verified by closing and reopening the app across 10 random task states).
3. **Filter accuracy** — the Active filter shows exactly the not-done tasks 100% of the time (verified by counting tasks manually and comparing to the filtered list).

## Feature Boundaries — v1

| Feature | v1 | Reason |
|---|---|---|
| Add task (text input + button) | IN | Core interaction — without it there is no todo list |
| Mark task complete (checkbox) | IN | Core interaction — the fundamental purpose of a todo list |
| Visual distinction for completed tasks (strikethrough) | IN | User must be able to tell at a glance what is done |
| Delete individual tasks (swipe or delete button) | IN | Users need to remove tasks they no longer want to see |
| Persistence across app restarts | IN | Data loss would make the app untrustworthy |
| Filter by All / Active / Completed | IN | Users need to focus on remaining work without distraction |
| Active task count display | IN | Motivates completion — shows progress at a glance |
| Task editing | OUT | Raises UI complexity significantly; users can delete and re-add |
| Task categories / tags | OUT | Adds hierarchy that contradicts the "just a list" vision |
| Due dates and reminders | OUT | Requires notification infrastructure and calendar UI |
| Subtasks | OUT | Adds nesting depth that complicates the simple list model |
| Priorities (high / medium / low) | OUT | Adds complexity without clear benefit for a personal quick-list |
| Cloud sync / account system | OUT | Requires accounts, auth, and backend — out of scope for v1 |
| Dark mode | OUT | Pure polish; zero impact on core task management |
| Push notifications | OUT | No reminders in v1; notifications have no trigger |
| Search | OUT | A fast-scrolling list of ~dozens of items does not need search |
| Undo delete | OUT | Adds state complexity; delete is intentionally quick |

## Open Questions

- Q-1: Should task order be manual (drag to reorder) or automatic (newest first / oldest first)? Affects the list UI and data model.
- Q-2: What storage backend? AsyncStorage (simple) or SQLite (queryable)? Affects filter performance at scale.
- Q-3: Should deleting a task require a confirmation step, or is one-tap deletion preferred?
