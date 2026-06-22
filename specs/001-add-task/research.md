# Research: Add Task

## Purpose

Resolve all `[NEEDS CLARIFICATION]` markers and validate technology choices before Phase 1 design.

## Findings

### Language / Framework
- **Decision**: TypeScript + React Native via Expo SDK 56
- **Rationale**: Already established by the project (`package.json` → `expo: ~56.0.12`, `react-native: 0.85.3`). No alternative considered.
- **Alternatives considered**: None — project dependency is fixed.

### Storage
- **Decision**: `expo-sqlite`
- **Rationale**: Architecture.md already selected this over AsyncStorage. Filter operations (All / Active / Completed maps to SQL `WHERE` clauses) justify the choice. No additional research needed.
- **Alternatives considered**: AsyncStorage (rejected — requires loading all rows into memory for filtering).

### State Management
- **Decision**: React Context + `useReducer`
- **Rationale**: Architecture.md specifies `TaskContext` wrapping the full app. The single-screen scope means no need for Zustand, Redux, or Jotai. The reducer pattern keeps state transitions explicit (ADD_TASK, TOGGLE_TASK, DELETE_TASK, SET_FILTER).
- **Alternatives considered**: Zustand (overkill for one context), Redux (overkill).

### Navigation
- **Decision**: Expo Router, single route `app/index.tsx`
- **Rationale**: Architecture.md specifies file-based routing. Single-screen app needs no tab bars or nested layouts.
- **Alternatives considered**: Bare react-navigation (Expo Router is the idiomatic Expo choice).

### Testing
- **Decision**: Maestro for E2E (constitution §1–§5). No unit test framework installed — not blocking for v1.
- **Rationale**: The constitution mandates E2E flows for every AC. Unit tests can be added later. For now, manual verification + Maestro flows cover all acceptance criteria.
- **Alternatives considered**: Jest + React Native Testing Library (useful but not required for v1).

### Performance
- **Decision**: No special optimisation needed for v1.
- **Rationale**: Single-user, local-only. SQLite handles 10k+ rows with sub-ms queries. ≤3s task-add target is trivially met.
- **Alternatives considered**: VirtualisedList is the React Native default for FlatList — no custom solution needed.

### Task Ordering
- **Decision**: Newest-first (reverse chronological).
- **Rationale**: Vision Q-1 resolved — users most commonly want to see their latest task at the top. Simplest implementation (ORDER BY createdAt DESC).
- **Alternatives considered**: Alphabetical (less useful for a list), manual drag-reorder (out of scope for v1).

### Delete Confirmation
- **Decision**: No confirmation — one-tap delete.
- **Rationale**: Vision Q-3 resolved — the app is intentionally quick. Undo can be added later if users request it.
- **Alternatives considered**: Confirmation dialog (adds extra tap, contradicts the "instant" vision).
