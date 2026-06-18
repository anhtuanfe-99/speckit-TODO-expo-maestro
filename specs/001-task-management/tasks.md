# Tasks: Task Management

**Input**: Design documents from `specs/001-task-management/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/testid-inventory.md

**Implementation**: Single-file Expo app — all code in `App.tsx`. FlatList-based UI, React hooks for state.

**Tests**: Not requested — no test tasks generated.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: Which use case this task belongs to (UC1, UC2, UC3, UC4, UC5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization is already complete (Expo project was created, specs and flows exist). No setup tasks needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before any user story can begin.

- [x] T001 Add all testID props to `App.tsx` per `contracts/testid-inventory.md` (task_input, task_item, task_title, task_checkbox, task_completed, delete_button, filter_all, filter_active, filter_completed, empty_state, add_task_button, cancel_edit_button)
- [x] T002 Define TypeScript types (Task, TaskStatus, FilterOption) and state shape in `App.tsx` per `data-model.md`
- [x] T003 Implement getFilteredTasks() and getCounts() utility functions in `App.tsx`

**Checkpoint**: Foundation ready — state types, utilities, and testID hooks are in place. User story implementation can begin.

---

## Phase 3: UC-01 — Create a Task (Priority: P1) 🎯 MVP

**Goal**: User can type a task title, submit it, and see it appear in the list. Empty titles are rejected.

**Independent Test**: `maestro test e2e/flows/001-task-management/UC-01-create-task/`

- [x] T004 GATE — confirm `e2e/flows/001-task-management/UC-01-create-task/` exists with AC flow files for every AC in this UC
- [x] T005 [UC1] Add testID props required by UC-01 flows (`task_input`, `add_task_button`) to `App.tsx`
- [x] T006 [UC1] Implement task creation UI — TextInput (task_input) + submit action in `App.tsx`
- [x] T007 [UC1] Implement state management — add task to tasks array with status 'active' in `App.tsx`
- [x] T008 [UC1] Implement empty-title validation — discard submission when input is empty/whitespace in `App.tsx`
- [x] T009 [UC1] Clear input field after successful task creation in `App.tsx`
- [x] T010 GATE — `maestro test e2e/flows/001-task-management/UC-01-create-task/` → all AC flows GREEN

**Checkpoint**: UC-01 complete. User can create tasks and empty titles are rejected.

---

## Phase 4: UC-02 — Edit a Task (Priority: P2)

**Goal**: User can tap a task title to edit it inline, change the text, and save or cancel the edit.

**Independent Test**: `maestro test e2e/flows/001-task-management/UC-02-edit-task/`

- [x] T011 GATE — confirm `e2e/flows/001-task-management/UC-02-edit-task/` exists with AC flow files for every AC in this UC
- [x] T012 [UC2] Add testID props required by UC-02 flows (`task_title`, `cancel_edit_button`) to `App.tsx`
- [x] T013 [UC2] Implement inline edit mode — tap title to switch text to TextInput in `App.tsx`
- [x] T014 [UC2] Implement edit confirm — save new title when user confirms in `App.tsx`
- [x] T015 [UC2] Implement edit cancel — revert to original title when cancelled in `App.tsx`
- [x] T016 [UC2] Implement empty/whitespace guard during edit — keep original title in `App.tsx`
- [x] T017 GATE — `maestro test e2e/flows/001-task-management/UC-02-edit-task/` → all AC flows GREEN

**Checkpoint**: UC-02 complete. User can edit task titles inline.

---

## Phase 5: UC-03 — Complete a Task (Priority: P2)

**Goal**: User can tap a checkbox to toggle a task between active and completed states.

**Independent Test**: `maestro test e2e/flows/001-task-management/UC-03-complete-task/`

- [x] T018 GATE — confirm `e2e/flows/001-task-management/UC-03-complete-task/` exists with AC flow files for every AC in this UC
- [x] T019 [UC3] Add testID props required by UC-03 flows (`task_checkbox`, `task_completed`) to `App.tsx`
- [x] T020 [UC3] Implement completion toggle — switch task status between 'active' and 'completed' in `App.tsx`
- [x] T021 [UC3] Implement visual completed state — strikethrough or dimmed appearance when task is completed in `App.tsx`
- [x] T022 GATE — `maestro test e2e/flows/001-task-management/UC-03-complete-task/` → all AC flows GREEN

**Checkpoint**: UC-03 complete. User can mark tasks as completed and revert them back.

---

## Phase 6: UC-04 — Delete a Task (Priority: P2)

**Goal**: User can delete a task and it is removed from the list immediately.

**Independent Test**: `maestro test e2e/flows/001-task-management/UC-04-delete-task/`

- [x] T023 GATE — confirm `e2e/flows/001-task-management/UC-04-delete-task/` exists with AC flow files for every AC in this UC
- [x] T024 [UC4] Add testID props required by UC-04 flows (`delete_button`) to `App.tsx`
- [x] T025 [UC4] Implement delete action — remove task from tasks array in `App.tsx`
- [x] T026 GATE — `maestro test e2e/flows/001-task-management/UC-04-delete-task/` → all AC flows GREEN

**Checkpoint**: UC-04 complete. User can delete tasks.

---

## Phase 7: UC-05 — Filter Task List (Priority: P3)

**Goal**: User can switch between All / Active / Completed filters. Empty state messages are shown when no tasks match.

**Independent Test**: `maestro test e2e/flows/001-task-management/UC-05-filter-tasks/`

- [x] T027 GATE — confirm `e2e/flows/001-task-management/UC-05-filter-tasks/` exists with AC flow files for every AC in this UC
- [x] T028 [UC5] Add testID props required by UC-05 flows (`filter_all`, `filter_active`, `filter_completed`, `empty_state`) to `App.tsx`
- [x] T029 [UC5] Implement filter controls — segmented control (All / Active / Completed) in `App.tsx`
- [x] T030 [UC5] Apply active filter to task list display using getFilteredTasks() in `App.tsx`
- [x] T031 [UC5] Implement contextual empty-state messages for each filter in `App.tsx`
- [x] T032 GATE — `maestro test e2e/flows/001-task-management/UC-05-filter-tasks/` → all AC flows GREEN

**Checkpoint**: UC-05 complete. User can filter tasks and see appropriate empty states.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and quality assurance across all use cases.

- [x] T033 Run full regression — `maestro test e2e/suite.yaml` (requires simulator)
- [x] T034 Run spec-flow sync validation — `bash e2e/check-sync.sh`
- [x] T035 Run TypeScript type check — `npx tsc --noEmit`
- [x] T036 Update feature map status — set to 🟢 implemented in `specs/_project/feature-map.md`

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Blocks |
|-------|-----------|--------|
| Phase 1 (Setup) | — | Already complete |
| Phase 2 (Foundational) | — | All UCs |
| Phase 3 (UC-01) | Phase 2 | — (independent MVP) |
| Phase 4 (UC-02) | Phase 2, UC-01 | — |
| Phase 5 (UC-03) | Phase 2, UC-01 | — |
| Phase 6 (UC-04) | Phase 2, UC-01 | — |
| Phase 7 (UC-05) | Phase 2, UC-01, UC-03 | — |
| Phase 8 (Polish) | All phases | — |

### User Story Dependencies

- **UC-01 (P1)**: No dependencies on other UCs — can be implemented first
- **UC-02 (P2)**: Needs tasks to exist (UC-01) but otherwise independent
- **UC-03 (P2)**: Needs tasks to exist (UC-01) but otherwise independent
- **UC-04 (P2)**: Needs tasks to exist (UC-01) but otherwise independent
- **UC-05 (P3)**: Needs active + completed tasks (UC-01 + UC-03)

### Within Each UC

- GATE check first (flows must exist)
- testID props added before implementation
- Implement the interaction (tap handler, state update)
- GATE verification last (Maestro flows GREEN)

### Parallel Opportunities

- UC-02, UC-03, UC-04 can all be implemented in parallel (all depend only on UC-01)
- Within each UC: most tasks are sequential (single-file App.tsx)
- Phase 8 polish tasks can run in parallel

---

## Parallel Example: UC-01 (Create Task)

```bash
# Terminal 1 — Verify flows exist
ls e2e/flows/001-task-management/UC-01-create-task/

# Terminal 2 — Implement (single file, sequential edits to App.tsx)
# 1. Add testID props
# 2. Add TextInput + submit
# 3. Add state management
# 4. Add validation
# 5. Clear input

# Terminal 3 — Quick verification after each change
npx tsc --noEmit
```

## Parallel Example: UC-02 + UC-03 + UC-04 (after UC-01 complete)

```bash
# Terminal 1 — UC-02 Edit (edit tap handler, inline TextInput, save/cancel)
# Terminal 2 — UC-03 Complete (checkbox toggle, visual state)
# Terminal 3 — UC-04 Delete (delete action handler)
# All three modify App.tsx — sequential commits recommended
```

---

## Implementation Strategy

1. **MVP (UC-01 only)**: Task creation is the foundation. Implement first, verify with Maestro.
2. **Phase 2 (UC-02, UC-03, UC-04)**: Edit, Complete, Delete — all build on UC-01's task list. Can be implemented in any order.
3. **Phase 3 (UC-05)**: Filtering depends on task states. Implement last.
4. **Polish**: Full regression before marking complete.

**Total tasks**: 36 (including 5 GATE checks, 6 testID prop tasks, 17 implementation tasks, 4 polish tasks)
