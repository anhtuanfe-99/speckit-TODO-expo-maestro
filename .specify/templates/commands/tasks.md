# /speckit.tasks — 4-Layer Override
<!-- Overrides the default /speckit.tasks command.                    -->
<!-- Enforces the UC gate pattern and task structure from §8.        -->

## What this command does

Generates a dependency-ordered task breakdown from the spec and plan,
following the UC gate pattern (constitution §8). Each UC gets its own
task group with a GATE task that confirms flow files exist before any
implementation task.

## Pre-flight checks

1. Does `specs/NNN-[feature]/plan.md` exist?
   NO → run /speckit.plan first.

2. Does `specs/NNN-[feature]/spec.md` exist with all four layers?
   NO → run /speckit.specify first.

3. Do `e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml` files
   exist for every AC in Layer 4?
   NO → run /speckit.flows first.

## Behavior

1. Read `.specify/memory/constitution.md` (especially §8 Task Structure).
2. Read `specs/NNN-[feature]/spec.md` (all four layers).
3. Read `specs/NNN-[feature]/plan.md`.
4. Read `specs/NNN-[feature]/data-model.md` if it exists.
5. Read all `e2e/flows/[feature]/**/*.yaml` to enumerate ACs.
6. Read `.specify/templates/overrides/tasks-template.md`.
7. Generate `specs/NNN-[feature]/tasks.md` with:
   - Phase 0: Setup tasks (dependencies, directory structure)
   - One section per UC, each starting with a GATE task
   - Parallel-capable tasks marked with `[P]`
   - Final verification section
8. Stop. Do NOT generate source code.

## Task structure rules (from constitution §8)

Every UC task group follows this pattern:
```markdown
## UC-NN: [Use Case Name]
<!-- AC-1 → AC-N map to e2e/flows/[feature]/UC-NN-[slug]/AC-*.yaml -->

- [ ] **T-NNN GATE** — confirm e2e/flows/[feature]/UC-NN-[slug]/ exists with all AC flow files
- [ ] T-NNN [P] First implementation task
- [ ] T-NNN [P] Second implementation task (parallel with above)
- [ ] T-NNN Third implementation task (depends on above)

- [ ] **T-NNN GATE** — maestro test e2e/flows/[feature]/UC-NN-[slug]/ → all GREEN
```

## GATE task rules

- Every UC section starts with a GATE confirming flow files exist.
- Every UC section ends with a GATE confirming flows pass (GREEN).
- GATE tasks are bold and prefixed with **GATE**.
- No implementation task may exist without its preceding GATE.

## Output

- `specs/NNN-[feature]/tasks.md`
- Summary: total tasks, UC count, AC count, parallel groups
