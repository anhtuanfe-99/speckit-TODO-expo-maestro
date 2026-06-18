# /speckit.plan — 4-Layer Override
<!-- Overrides the default /speckit.plan command.                    -->

## What this command does

Translates the 4-layer spec into a technical plan: architecture,
component tree, testID inventory, file structure, dependencies.

## Pre-flight checks

1. Does `specs/NNN-[feature]/spec.md` exist with all four layers?
   NO → run /speckit.specify first.

2. Do `e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml` files
   exist for every AC in Layer 4?
   NO → run /speckit.flows first. The testID inventory is derived
        from the flow files — it cannot be generated without them.

3. Have flows been confirmed RED?
   NO → tell the user to run `maestro test e2e/flows/[feature]/`
        before planning.

## Behavior

1. Read `.specify/memory/constitution.md`.
2. Read `.specify/memory/architecture.md`.
3. Read `specs/NNN-[feature]/spec.md` (all four layers).
4. Read all `e2e/flows/[feature]/**/*.yaml` to extract testIDs.
5. Read `.specify/templates/overrides/plan-template.md`.
6. Generate `specs/NNN-[feature]/plan.md`.
7. Generate `specs/NNN-[feature]/data-model.md` (TypeScript types
   derived from Layer 3 entity model — first translation to code).
8. Stop. Do NOT generate tasks or source code.

## testID inventory rule

The testID inventory section in plan.md lists every testID found
in the flow files. These are the ground truth — the implementation
must provide every one of them. No testID may appear in a flow
that is not in the inventory. No testID may be in the inventory
without appearing in at least one flow.

## data-model.md rule

Layer 3 (Entity Model) uses business language. data-model.md
translates it to TypeScript types. The field names in data-model.md
must match the conceptual field names in Layer 3 exactly — this is
what makes the code readable in the same language the team uses.

## Output

- `specs/NNN-[feature]/plan.md`
- `specs/NNN-[feature]/data-model.md`
- Summary: component count, testID count, new dependencies