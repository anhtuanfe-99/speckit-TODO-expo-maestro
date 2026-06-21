---
description: "Generate Maestro E2E flow files from spec.md Acceptance Criteria (Layer 4). TDD gate: flows written before any code."
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before flows generation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_flows` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Mandatory syntax grounding (read before generating anything)

Before generating ANY flow file, read in full:
`.specify/references/maestro/syntax-reference.md`

This is not optional context — it is the grounding source. Maestro's
YAML syntax is underrepresented in training data, and without this
file as a direct reference, generated flows will silently mix in
Cypress/Playwright/Jest patterns that look plausible but do not exist
in Maestro (`click:`, `type:`, `expect().toBeVisible()`, `describe()`
blocks, `sleep()`, CSS selectors).

If a command is needed that is not covered in the reference file's
Core Commands section:
1. Check the reference file's "What does NOT exist" table first —
   confirm you are not about to generate a hallucinated command.
2. If the command is genuinely missing from the reference file,
   web_fetch the official page before using it:
   `https://docs.maestro.dev/api-reference/commands/{command-name}`
3. Never write a Maestro command from memory alone if it is not
   already confirmed in the reference file or freshly fetched from
   the official docs in this session.

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

5. Does `.specify/memory/constitution.md` §13 declare a current
   Maestro mode (`local-expo-go`, `dev-client`, or `production`)?
   NO → default to `local-expo-go` and tell the user you are doing so.
        Recommend they add §13 to the constitution so this is explicit
        going forward.

## Behavior

1. Read `.specify/memory/constitution.md` (testID rules and §13
   Maestro mode — see step 5 of Pre-flight checks above).
2. Read `.specify/references/maestro/syntax-reference.md` (syntax —
   MANDATORY, see above. Do this even if read earlier in the session).
3. Read `specs/NNN-[feature]/spec.md` Layer 4 (AC section).
4. For each AC:
   a. Read the `→ e2e:` path from the forward link.
   b. Create the directory if it does not exist.
   c. Generate the flow file at that exact path, using ONLY commands
      and selector forms confirmed in the syntax reference.
   d. Write the required header block, including the `# test-name:` line
      derived as: `UC-{use-case-number, zero-padded to 2 digits}_AC-{ac-number, no padding}_{slug from scenario title, lowercase, hyphenated}`.
      This value MUST match the `→ test-name:` value in spec.md Layer 4.
      If they would not match exactly, stop and flag the mismatch.
   e. Write the `appId:` line and launch preamble according to the
      current Maestro mode (see "Required flow file header" below).
   f. Translate Given/When/Then into Maestro steps, appended after
      the mode-specific preamble.
5. Self-check every generated flow against the syntax reference's
   "What does NOT exist" table before writing the file. If any
   hallucinated pattern is found, rewrite using the correct command
   from Core Commands before proceeding.
6. Generate `e2e/suites/[feature].yaml` listing all flows.
7. Update `e2e/suite.yaml` to include the feature suite.
8. Update `specs/_project/feature-map.md` status → 🔵 flows ready.
9. Stop. Do NOT generate plan, tasks, or source code.
10. Print: list of files created, total AC count, current Maestro mode used.
11. Tell the user: "Build the dev client and run:
    maestro test e2e/flows/[feature]/
    All flows must FAIL before you proceed to /speckit.plan."

## Required flow file header (every file, no exceptions)

Read constitution.md §13 to determine the current Maestro mode
(`local-expo-go`, `dev-client`, or `production`) before writing the
`appId:` line and launch preamble. Do not hardcode either — both
come from §13's "Current mode for this project" value.

**If mode is `local-expo-go`** (default during development):

```yaml
# spec: specs/NNN-[feature]/spec.md
# use-case: UC-NN
# ac: AC-N
# scenario: [exact scenario title from spec.md Layer 4]
# test-name: UC-NN_AC-N_[slug]
# protocol: changes require PROTOCOL B

appId: host.exp.Exponent
---
- launchApp
- tapOn:
    text: "[expo.name from app.json, per constitution.md §13.1]"
- extendedWaitUntil:
    visible: "[first-screen anchor, per constitution.md §13.2]"
    timeout: 10000
```

**If mode is `dev-client` or `production`:**

```yaml
# spec: specs/NNN-[feature]/spec.md
# use-case: UC-NN
# ac: AC-N
# scenario: [exact scenario title from spec.md Layer 4]
# test-name: UC-NN_AC-N_[slug]
# protocol: changes require PROTOCOL B

appId: [real bundle id from constitution.md §13.3]
---
- launchApp
```

The three-line Expo Go preamble (`tapOn` project name +
`extendedWaitUntil`) is environment setup, not part of any AC's
Given/When/Then. It must be identical across every flow in the
feature. If `app.json`'s `expo.name` changes, regenerate all flow
preambles via Protocol B (test-change, no spec-change required).

## testID rules (from constitution.md — enforce strictly)

- Use `id:` selectors (testID) for all interactions.
- Use `text:` selectors only for assertions, never for taps.
- List items: `id: "base_name"` + `index: N`. Never `id: "name_0"`.
- UUID-keyed rows: `id: "item_{item.id}"` only when identity matters.

## Flow structure rules

- Every flow starts with the mode-specific preamble (`launchApp`,
  plus the Expo Go project-select steps if mode is `local-expo-go`).
- Every flow uses a clean state — build all test data within the flow.
- One flow = one AC = one Given/When/Then block.
- If setup requires another feature (e.g. auth), use:
  `- runFlow: e2e/flows/_shared/[setup-flow].yaml`
  (placed after the launch preamble, before the AC's own steps)

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

Every flow file is now guaranteed to use only commands present in
`.specify/references/maestro/syntax-reference.md`, and to use the
correct `appId:` and launch preamble for the project's current
Maestro mode as declared in `constitution.md` §13.