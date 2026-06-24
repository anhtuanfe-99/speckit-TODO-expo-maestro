---
description: Establish product vision and feature map before any architecture or feature spec work. The first command in the entire workflow — run once per project.
---

## Hooks: before_vision
Read `.specify/extensions.yml` → `hooks.before_vision`. Skip disabled (enabled=false), non-empty condition. Optional: prompt user. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.

## Purpose
Generate `specs/_project/vision.md` + `feature-map.md`. First command in workflow. NOT a feature spec — answers: why does this product exist, who is it for, what's in v1 vs deferred.

## Pre-flight

1. Does `specs/_project/vision.md` already exist?
   YES → this is an update, not a first run. Read it in full. Treat
         the user's input as a delta. Confirm which sections change
         before overwriting anything.
   NO → this is the first run. Proceed to Behavior.

2. Is the user's input close to empty or very vague (e.g. just an
   app name with no problem statement)?
   YES → do not fabricate a vision. Ask 2-4 short clarifying
         questions covering: the problem being solved, the primary
         user, and at least one thing explicitly out of scope. Wait
         for answers before generating the file.
   NO → proceed with what was given; note any gaps as Open Questions
        in the generated file rather than inventing answers.

## Behavior (first run)

1. Read `.specify/memory/constitution.md` if it exists.
2. Parse the user's product description.
3. Generate `specs/_project/vision.md`:

```markdown
# Product Vision: [App Name]

## Problem
[One paragraph. The actual frustration today — not the solution.]

## User
[One specific person and their context. Not a generic persona.]

## Goal
[2-3 measurable outcomes, each with a metric and how it's measured.]

## Feature Boundaries — v1
| Feature | v1 | Reason |
|---|---|---|
| [capability] | IN / OUT | [reason — "not now" is not a reason] |

## Open Questions
- Q-1: [unresolved decision affecting feature specs]
```

4. Generate `specs/_project/feature-map.md` from the "IN" rows of
   the Feature Boundaries table:

```markdown
# Feature Map

| # | Feature | Status | Depends On | Spec | Suite |
|---|---|---|---|---|---|
| 001 | [feature] | ⚪ not started | — | — | — |
| 002 | [feature] | ⚪ not started | [001, if applicable] | — | — |

Status: ⚪ not started · 🟡 specced · 🔵 flows ready · 🟢 implemented · 🔴 broken
```

5. Order rows by dependency — a feature that depends on another
   must appear below it, and its "Depends On" column must name the
   feature(s) it needs already implemented first.
6. Stop. Do NOT generate architecture.md, any feature spec, plan,
   tasks, or code.
7. Print both files' contents as a summary and ask the user to
   confirm before running `/speckit.architecture` next.

## Behavior (update run — vision.md already exists)

1. Read the existing `vision.md` and `feature-map.md` in full.
2. Apply the user's delta — typically adding a newly-discovered
   feature, changing a v1 boundary, or resolving an Open Question.
3. If a feature moves from OUT to IN (or vice versa) and other
   features already depend on the old boundary: flag this before
   applying the change.
4. Update `feature-map.md` to match — add/remove rows, keep
   dependency order correct.
5. Print a summary of what changed.

## Output

```
specs/_project/vision.md
specs/_project/feature-map.md
```

## Relationship to other commands

```
/speckit.vision                →  vision.md, feature-map.md      ← this command, run first
/speckit.architecture          →  architecture.md                 (reads vision.md)
/speckit.specify (per feature) →  specs/NNN-[feature]/spec.md     (reads architecture.md)
/speckit.flows                 →  e2e/flows/[feature]/...
/speckit.plan                  →  plan.md, data-model.md
/speckit.tasks                 →  tasks.md
/speckit.implement             →  source code
```

`/speckit.specify` (feature mode) and `/speckit.architecture` should
both check for `specs/_project/vision.md` in their own pre-flight
checks and direct the user here if it is missing — see the
Constitution Note below.

## Constitution Note

`.specify/memory/constitution.md` §3 lists `vision.md` and
`feature-map.md` as required pre-existing artifacts but does not
itself create them — no constitution section generates files, only
commands do. This command is the one that satisfies that gate.
If §3 is ever read by a user expecting the constitution to point to
the exact command, consider adding one line: "created by
/speckit.vision" — matching how §3 already says architecture.md is
"created by /speckit.architecture".