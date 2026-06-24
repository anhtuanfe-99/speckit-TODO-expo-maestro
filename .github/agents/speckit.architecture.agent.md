---
description: Establish cross-feature technical architecture (navigation, data model, storage) before any feature spec is written. Runs once per project, after vision, before the first /speckit.specify.
---

## Hooks: before_architecture
Read `.specify/extensions.yml` → `hooks.before_architecture`. Skip disabled (enabled=false), non-empty condition. Optional: prompt user. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.

## Purpose
Generate `.specify/memory/architecture.md` — cross-feature technical decisions (navigation, data model, storage). Runs once per project, after vision, before first /speckit.specify.

constitution.md = process rules. architecture.md = technical decisions. Distinct.

## Pre-flight

1. Does `specs/_project/vision.md` exist?
   NO → run /speckit.specify for the project vision first.
        Architecture decisions should follow from what the product
        actually needs, not precede it.

2. Does `specs/_project/feature-map.md` exist?
   NO → tell the user to create it (or run /speckit.specify for
        vision, which should produce it) before settling architecture.

3. Does `.specify/memory/architecture.md` already exist?
   YES → this is an update, not a first run. Read the existing file
         in full. Treat the user's input as a delta to apply, not a
         full replacement. Confirm with the user which sections they
         intend to change before overwriting anything.
   NO → this is the first run. Proceed to Behavior.

## Behavior (first run)

1. Read `.specify/memory/constitution.md` if it exists (platform,
   testID rules, Maestro mode if already declared).
2. Read `specs/_project/vision.md` and `specs/_project/feature-map.md`.
3. Parse the user's architectural input.
4. Generate `.specify/memory/architecture.md` covering:
   - Navigation structure (routes, screen hierarchy)
   - Shared data model (entities used by 2+ features — not
     feature-specific entities, which belong in that feature's
     own Layer 3 Entity Model)
   - Storage layer (what persistence mechanism, where the access
     code lives, e.g. `src/services/db.ts`)
   - State management convention (Context vs other, where hooks live)
   - Any cross-cutting technical constraint that would otherwise
     be decided inconsistently feature-by-feature
5. If Maestro mode (`local-expo-go` / `dev-client` / `production`)
   is not yet declared in constitution.md §13, ask the user to
   confirm it now — architecture and Maestro mode are usually
   decided together since dev-client builds often follow from a
   navigation or native-module decision made here.
6. Stop. Do NOT generate any feature spec, plan, or code.
7. Print a summary of every decision made and ask the user to
   confirm before any `/speckit.specify` run reads this file.

## Behavior (update run — architecture.md already exists)

1. Read the existing `.specify/memory/architecture.md` in full.
2. Read `specs/_project/feature-map.md` to see which features are
   already 🟢 implemented — flag if the proposed change would
   contradict a decision those features already depend on.
3. If a contradiction is found: STOP. Tell the user this is a
   breaking architecture change and ask them to confirm explicitly,
   since downstream features built on the old decision may need
   their own Protocol A change.
4. If no contradiction: apply the delta, update only the relevant
   section, leave everything else untouched.
5. Print a summary of what changed and which existing features (if
   any) should be reviewed against the update.

## Output

```
.specify/memory/architecture.md
```

Example shape of the generated file:

```markdown
# Architecture
<!-- Read by every /speckit.plan run before planning a feature.   -->
<!-- Set once per project; updated deliberately, not per-feature. -->

## Navigation
[e.g. Expo Router, file-based routing, route groups and their purpose]

## Shared Data Model
<!-- Entities used by 2+ features only. Feature-specific entities  -->
<!-- belong in that feature's own spec.md Layer 3.                 -->
[EntityName] { field: type, field: type }

## Storage
[mechanism, e.g. expo-sqlite; access layer location, e.g. src/services/db.ts]

## State Management
[e.g. React Context + useReducer per feature; hook location convention]

## Maestro Mode
See constitution.md §13. Current: [local-expo-go | dev-client | production]

## Cross-Cutting Constraints
[anything else that must stay consistent across every feature]
```

## Relationship to other commands

```
/speckit.specify (vision)   →  specs/_project/vision.md, feature-map.md
/speckit.architecture       →  .specify/memory/architecture.md   ← this command
/speckit.specify (feature)  →  specs/NNN-[feature]/spec.md  (reads architecture.md)
/speckit.flows               →  e2e/flows/[feature]/...
/speckit.plan                →  plan.md  (reads architecture.md again, per feature)
/speckit.tasks
/speckit.implement
```

If `/speckit.specify` is run for a feature and `architecture.md`
does not exist yet, that command's own pre-flight check should stop
and direct the user here first.