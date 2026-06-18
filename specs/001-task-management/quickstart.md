# Quickstart: Task Management

**Purpose**: Runnable validation scenarios to prove the feature works end-to-end.
**Date**: 2026-06-18

## Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- Maestro CLI installed (`brew install maestro-io/tap/maestro`)
- iOS Simulator or Android Emulator running
- App built and installed on the simulator (`npx expo run:ios` or `npx expo run:android`)

## Test Data Contract

All Maestro flows reference testIDs defined in `contracts/testid-inventory.md`. Before implementing, ensure every component listed there has a `testID` prop.

## Run All Task Management Flows

```bash
maestro test e2e/suites/001-task-management.yaml
```

**Expected outcome**: All flows pass GREEN after implementation is complete.

## Run a Single Use Case

```bash
# Create tasks (UC-01)
maestro test e2e/flows/001-task-management/UC-01-create-task/

# Edit tasks (UC-02)
maestro test e2e/flows/001-task-management/UC-02-edit-task/

# Complete tasks (UC-03)
maestro test e2e/flows/001-task-management/UC-03-complete-task/

# Delete tasks (UC-04)
maestro test e2e/flows/001-task-management/UC-04-delete-task/

# Filter tasks (UC-05)
maestro test e2e/flows/001-task-management/UC-05-filter-tasks/
```

**Expected outcome**: Each UC's flows pass GREEN independently.

## Run a Single Flow

```bash
maestro test e2e/flows/001-task-management/UC-01-create-task/AC-1-task-created-with-valid-title.yaml
```

## Run Full Regression (Before Merge)

```bash
maestro test e2e/suite.yaml          # All feature suites
bash e2e/check-sync.sh               # Spec-flow sync validation
npx tsc --noEmit                     # TypeScript type check
```

## Validation Scenarios

### Scenario 1: Basic CRUD

1. Open the app → empty task list shown
2. Type "Buy groceries" and confirm → task appears (active)
3. Tap completion checkbox → task shows as completed
4. Tap completion checkbox again → task reverts to active
5. Tap title, change to "Buy vegetables", confirm → title updates
6. Tap delete → task disappears

### Scenario 2: Filtering

1. Create "Task A" (keep active) and "Task B" (mark completed)
2. Select "All" filter → both visible
3. Select "Active" filter → only Task A visible
4. Select "Completed" filter → only Task B visible
5. Delete all tasks, select "Completed" filter → "No completed tasks" empty state shown

### Scenario 3: Edge Cases

1. Confirm empty input → no task created
2. Start editing, cancel → original title preserved

## Implementation Order (Recommended)

| Order | UC | Flows | Dependencies |
|-------|----|-------|--------------|
| 1 | UC-01 Create Task | 2 flows | None — start here |
| 2 | UC-02 Edit Task | 2 flows | Depends on UC-01 (needs tasks to edit) |
| 3 | UC-03 Complete Task | 2 flows | Depends on UC-01 (needs tasks to toggle) |
| 4 | UC-04 Delete Task | 1 flow | Depends on UC-01 (needs tasks to delete) |
| 5 | UC-05 Filter Tasks | 4 flows | Depends on UC-01, UC-03 (needs active + completed tasks) |

## References

- [Spec](specs/001-task-management/spec.md) — all 4 layers
- [Data Model](specs/001-task-management/data-model.md) — TypeScript types
- [testID Inventory](specs/001-task-management/contracts/testid-inventory.md) — all testIDs
- [Plan](specs/001-task-management/plan.md) — architecture decisions
