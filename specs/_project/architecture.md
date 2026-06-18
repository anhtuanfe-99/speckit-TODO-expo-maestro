# Project Architecture

**Created**: 2026-06-18
**Status**: Active

## Platform

- **Runtime**: Expo SDK 56 (React Native 0.85.3, React 19.2.3)
- **Language**: TypeScript 6.0
- **Rendering**: React Native (Views, FlatList, Pressable, TextInput, etc.)
- **Testing**: Maestro (E2E flow testing)
- **Targets**: iOS, Android (via Expo)

## Application Shell

The app is a single-screen or minimal-navigation React Native application. All features live within the component tree rooted at `App.tsx`.

### Entry Point

- `index.ts` — Expo entry point
- `App.tsx` — Root component

## Component Architecture

- Screens are composed of reusable components
- State is managed locally (React state / hooks) — no external state library
- Every interactive element carries a `testID` prop in `snake_case` format
- Styling uses React Native `StyleSheet` objects

## Data Layer

- **Storage**: In-memory state (React state). Data resets on app restart.
- Future enhancements may add persistent storage (AsyncStorage, SQLite, etc.)
- State flows unidirectional: user action → state update → re-render

## Testing Strategy

- **E2E**: Maestro flows for every acceptance criterion
- **Flow structure**: One flow file per AC, organized by use case
- **Suite structure**: Feature-level suites aggregate flows; master `suite.yaml` aggregates all feature suites
- **Sync validation**: `bash e2e/check-sync.sh` validates spec-flow consistency before every merge

## Spec-Driven Development (SDD) Workflow

Per project constitution (§3):

1. `/speckit.specify` → `specs/NNN-feature/spec.md`
2. `/speckit.flows` → `e2e/flows/[feature]/...` (confirmed RED)
3. `/speckit.plan` → `specs/NNN-feature/plan.md` + `data-model.md`
4. `/speckit.tasks` → `specs/NNN-feature/tasks.md`
5. `/speckit.implement` → source code, UC by UC, GREEN per UC

## Naming Conventions

- **testID**: `snake_case` — no array-index suffixes
- **Feature folders**: `specs/NNN-[feature]/` with zero-padded number
- **Flow paths**: `e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml`
- **Test names**: `UC-NN_AC-N_[slug]`
