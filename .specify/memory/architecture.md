# Architecture Memory

**Last Synced**: 2026-06-18

## Stack

- Expo SDK 56, React Native 0.85.3, React 19.2.3, TypeScript 6.0
- Maestro for E2E testing
- No external state library — React hooks only

## Conventions

- `testID` in `snake_case` on every interactive element
- One Maestro flow file per acceptance criterion
- Spec-flow sync enforced by `e2e/check-sync.sh`
- Feature numbering is sequential (001, 002, ...)

## Key Files

| File | Purpose |
|------|---------|
| `specs/_project/vision.md` | Project vision and principles |
| `specs/_project/feature-map.md` | Feature tracking with status |
| `specs/_project/architecture.md` | Full architecture reference |
| `App.tsx` | Root component |
| `e2e/check-sync.sh` | Spec-flow sync validator |
| `e2e/suite.yaml` | Master test suite |
