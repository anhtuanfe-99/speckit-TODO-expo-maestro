# /speckit.flows — 4-Layer Extension
<!-- New command. Not in default spec-kit.                           -->
<!-- Generates Maestro flows from Layer 4 (Acceptance Criteria).    -->
<!-- This is the TDD gate: flows are written BEFORE any code.       -->

## What this command does

Reads Layer 4 (AC) of `spec.md` and generates one Maestro YAML
flow file per AC. Each AC maps to exactly one file.

## Pre-flight checks

1. Does `specs/NNN-[feature]/spec.md` exist?
   NO → run /speckit.specify first.

2. Does every AC in Layer 4 have a `→ e2e:` forward link?
   NO → fix spec.md before generating flows. A missing link means
        the spec is incomplete.

3. Does every AC in Layer 4 have a `→ test-name:` forward link?
   NO → fix spec.md before generating flows. A missing link means
        the spec is incomplete.

4. Does the `→ test-name:` value in spec.md Layer 4 match the expected
   format `UC-NN_AC-N_[slug]` for each AC?
   NO → fix spec.md before generating flows. The generated `# test-name:`
        value must be identical to the `→ test-name:` value in the spec.
        If they would not match exactly, stop and flag the mismatch.

## Behavior

1. Read `.specify/memory/constitution.md` (testID rules).
2. Read `specs/NNN-[feature]/spec.md` Layer 4 (AC section).
3. For each AC:
   a. Read the `→ e2e:` path from the forward link.
   b. Create the directory if it does not exist.
   c. Generate the flow file at that exact path.
   d. Write the required header block, including the `# test-name:` line
      derived as: `UC-{use-case-number, zero-padded to 2 digits}_AC-{ac-number, no padding}_{slug from scenario title, lowercase, hyphenated}`.
      This value MUST match the `→ test-name:` value in spec.md Layer 4.
      If they would not match exactly, stop and flag the mismatch.
   e. Translate Given/When/Then into Maestro steps.
4. Generate `e2e/suites/[feature].yaml` listing all flows.
5. Update `e2e/suite.yaml` to include the feature suite.
6. Update `specs/_project/feature-map.md` status → 🔵 flows ready.
7. Stop. Do NOT generate plan, tasks, or source code.
8. Print: list of files created, total AC count.
9. Tell the user: "Build the dev client and run:
   maestro test e2e/flows/[feature]/
   All flows must FAIL before you proceed to /speckit.plan."

## Required flow file header (every file, no exceptions)

```yaml
# spec: specs/NNN-[feature]/spec.md
# use-case: UC-NN
# ac: AC-N
# scenario: [exact scenario title from spec.md Layer 4]
# test-name: UC-NN_AC-N_[slug]
# protocol: changes require PROTOCOL B

appId: [app bundle id from constitution.md]
---
- launchApp
```

## testID rules (from constitution.md — enforce strictly)

- Use `id:` selectors (testID) for all interactions.
- Use `text:` selectors only for assertions, never for taps.
- List items: `id: "base_name"` + `index: N`. Never `id: "name_0"`.
- UUID-keyed rows: `id: "item_{item.id}"` only when identity matters.

## Flow structure rules

- Every flow starts with `- launchApp`.
- Every flow uses a clean state — build all test data within the flow.
- One flow = one AC = one Given/When/Then block.
- If setup requires another feature (e.g. auth), use:
  `- runFlow: e2e/flows/_shared/[setup-flow].yaml`

## Output

```
e2e/flows/[feature]/
  UC-01-[slug]/
    AC-1-[slug].yaml
    AC-2-[slug].yaml
  UC-02-[slug]/
    AC-1-[slug].yaml
e2e/suites/[feature].yaml   (updated)
e2e/suite.yaml              (updated)
specs/_project/feature-map.md (status → 🔵)
```