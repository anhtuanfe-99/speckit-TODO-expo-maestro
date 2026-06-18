# Speckit Todo · Expo + Maestro

A lightweight, test-driven mobile task management app built with **Expo (React Native)** and validated end-to-end via **Maestro**. This project is a reference implementation of the Speckit **Spec-Driven Development (SDD)** workflow — where every acceptance criterion is directly executable as a Maestro flow.

## Features

- **Create tasks** — Add a task with a title. Empty or whitespace-only input is rejected.
- **Edit tasks** — Tap a task title to edit inline. Cancel reverts to the original title.
- **Complete tasks** — Tap the checkbox to toggle between active and completed.
- **Delete tasks** — Remove a task from the list with one tap.
- **Filter tasks** — Switch between All / Active / Completed views. Empty states shown when no tasks match.

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Expo SDK 56 |
| Framework | React Native 0.85.3 |
| Language | React 19.2.3, TypeScript 6.0 |
| E2E Testing | Maestro |
| State | React hooks (in-memory) |
| Targets | iOS, Android |

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- Maestro CLI (`brew install maestro-io/tap/maestro`)
- iOS Simulator or Android Emulator running

### Install & Run

```bash
npm install
npx expo run:ios      # or npx expo run:android
```

### Run E2E Tests

```bash
# Full regression suite
maestro test e2e/suite.yaml

# Single feature suite
maestro test e2e/suites/001-task-management.yaml

# Single use case
maestro test e2e/flows/001-task-management/UC-01-create-task/

# Single acceptance criterion
maestro test e2e/flows/001-task-management/UC-01-create-task/AC-1-task-created-with-valid-title.yaml
```

### Validate Before Merge

```bash
maestro test e2e/suite.yaml          # All E2E flows
bash e2e/check-sync.sh               # Spec-flow sync validation
npx tsc --noEmit                     # TypeScript type check
```

## Project Structure

```
├── App.tsx                          # Root component
├── index.ts                         # Expo entry point
├── app.json                         # Expo config
├── e2e/
│   ├── suite.yaml                   # Master test suite
│   ├── check-sync.sh                # Spec-flow sync checker
│   ├── suites/
│   │   └── 001-task-management.yaml # Feature-level suite
│   └── flows/
│       └── 001-task-management/
│           ├── UC-01-create-task/   # 2 flows
│           ├── UC-02-edit-task/     # 2 flows
│           ├── UC-03-complete-task/ # 2 flows
│           ├── UC-04-delete-task/   # 1 flow
│           └── UC-05-filter-tasks/  # 4 flows
└── specs/
    ├── _project/
    │   ├── vision.md                # Project vision & principles
    │   ├── architecture.md          # Technical architecture
    │   └── feature-map.md           # Feature status tracking
    └── 001-task-management/
        ├── spec.md                  # Full specification (4 layers)
        ├── data-model.md            # TypeScript types & state shape
        ├── plan.md                  # Implementation plan
        ├── tasks.md                 # Task breakdown
        ├── quickstart.md            # Validation scenarios
        └── contracts/
            └── testid-inventory.md  # All component testIDs
```

## Spec-Driven Development

This project follows the Speckit SDD workflow. Every feature starts with a specification, not code:

1. **Specify** — Write the feature spec (`spec.md`) with business requirements, use cases, UI rules, and entity model.
2. **Flow-write** — Create Maestro flows for every acceptance criterion. Confirm they fail (RED) against the unimplemented app.
3. **Plan** — Design the data model and component architecture.
4. **Task** — Break the work into dependency-ordered implementation tasks.
5. **Implement** — Build each use case until its flows pass (GREEN).

## Status

| Feature | Status |
|---------|--------|
| Task Management | 🟢 implemented |

## License

MIT
