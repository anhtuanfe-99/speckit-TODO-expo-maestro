# Constitution
<!-- Read by every /speckit.* command before acting.               -->
<!-- Core Contract (§1–§5): never modify.                          -->
<!-- Project-Specific Rules (§6): append below the divider.        -->

---

## §1. Spec ↔ E2E Locked Pair (non-negotiable)

Every AC in `spec.md` Layer 4 MUST have a Maestro flow at the path
in its `→ e2e:` link. Every flow MUST have a header block tracing
back to its AC in `spec.md`. Neither may exist without the other.

**Forward links in `spec.md` Layer 4 (required on every AC):**
```
→ e2e:       `e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml`
→ test-name: `UC-NN_AC-N_[slug]`
```

Both lines are mandatory. They must appear together, in this order,
immediately after the AC title. No AC without both links.

**Back links in every flow file (required header block):**
```yaml
# spec: specs/NNN-[feature]/spec.md
# use-case: UC-NN
# ac: AC-N
# scenario: <exact scenario title from spec.md Layer 4>
# test-name: UC-NN_AC-N_[slug]
# protocol: changes require PROTOCOL B
```

All six lines are mandatory. `check-sync.sh` validates each one.

---

## §2. 4-Layer Spec Model (enforce in every /speckit.specify run)

Every feature spec lives in `specs/NNN-[feature]/spec.md` and
contains exactly four layers in this order:

**Layer 1 — Business Requirement (BR)**
- Answers: why are we building this?
- Audience: PO and stakeholders. No implementation detail.
- Must contain: measurable goal, success metric(s), out of scope.

**Layer 2 — Use Cases (UC)**
- Answers: who does what with the system?
- Audience: PO + dev. No code, no component names, no file paths.
- Each UC must contain: Actor, Trigger, Main Flow (numbered),
  Alternative Flows, Exceptions.

**Layer 3 — Entity Model**
- Answers: what are the domain nouns?
- Audience: dev + AI. Not a schema — no datatypes, no indexes.
- Each entity must contain: what it represents, its states,
  conceptual fields, relationships.
- Use exact business terms the team will use in variable names.

**Layer 4 — Acceptance Criteria (AC)**
- Answers: how do we know it is done correctly?
- Audience: dev + Maestro (directly executable).
- Each AC must contain: → e2e: link, → test-name: link,
  Given / When / Then in that format.
- One AC = one flow file. No two ACs share the same flow path.
- Every Then line is one observable assertion.

---

## §3. Command Order (never skip a step)

```
/speckit.specify    →  specs/NNN-[feature]/spec.md (all 4 layers)
/speckit.flows      →  e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml
                       confirm ALL flows RED before continuing
/speckit.plan       →  specs/NNN-[feature]/plan.md + data-model.md
/speckit.tasks      →  specs/NNN-[feature]/tasks.md
/speckit.implement  →  source code, UC by UC, GREEN gate per UC
```

If asked to skip any step: refuse, name what is missing, ask the
user to run the missing command first.

**Project-level artifacts must exist before any feature spec:**
```
specs/_project/vision.md         (created by /speckit.vision)
specs/_project/feature-map.md    (created by /speckit.vision)
.specify/memory/architecture.md  (created by /speckit.architecture)
```

If any are missing when a feature spec is requested: stop, identify
what is missing, and tell the user the exact command to run.

**Order of first-time setup (run once per project, in this order):**
```
/speckit.vision        →  vision.md, feature-map.md
/speckit.architecture  →  architecture.md
/speckit.specify       →  first feature's spec.md
```

---

## §4. Change Protocols (code is always last)

**PROTOCOL A — requirement changed:**
1. Edit `spec.md` (Layer 1–4 as needed)
2. Update `→ e2e:` and `→ test-name:` forward links if AC changed
3. Update or create the corresponding flow file(s)
4. Run `maestro test` → confirm RED
5. Update implementation code
6. Run `maestro test` → confirm GREEN
7. Commit spec + flow + code together — never separately

**PROTOCOL B — flow needs to change:**
1. Find `# scenario:` and `# ac:` headers in the flow
2. Find that exact AC in `spec.md` Layer 4
3. If not found: STOP — tell the user to open a spec PR first
4. Update `spec.md` Layer 4 first
5. Update the flow file
6. Confirm RED → update code → confirm GREEN → commit all

**Bug fix (no behaviour change):**
1. Fix code
2. Run the relevant flow → confirm still GREEN
3. If flow goes RED for a new reason → treat as PROTOCOL A

---

## §5. testID Rules

- Every interactable (`Pressable`, `TextInput`, `TouchableOpacity`)
  and every data-display element the user reads MUST have a `testID`.
- Format: `snake_case` only.
- List items: base name only — NO array-index suffix.
  ✗ `note_item_0`     ✓ `note_item`  (use Maestro `index:` selector)
  ✗ `note_row_2`      ✓ `note_row_{note.id}`  (UUID-keyed rows only)
- Use `id:` selectors (testID) for all interactions in flows.
- Use `text:` selectors for assertions only, never for taps.

---

## §6. Test Naming Convention

**Format:** `UC-{NN}_AC-{N}_{slug}`

Rules:
- `UC-` always uppercase, 2-digit zero-padded: `UC-01`, `UC-12`
- `AC-` always uppercase, no padding: `AC-1`, `AC-9`
- Slug: lowercase, hyphens only, derived from scenario title
- No spaces, no special characters

Examples:
```
UC-01_AC-1_new-note-saved
UC-01_AC-2_empty-note-discarded
UC-01_AC-3_first-line-is-title
UC-02_AC-1_changes-auto-saved
UC-03_AC-1_no-note-created
```

The `test-name` is the canonical identifier in CI reports.
Every occurrence of the test name must be identical across:
- `→ test-name:` in `spec.md` Layer 4
- `# test-name:` in the flow file header
- CI output label

---

## §7. One Spec Per Feature

- Each feature lives in its own folder: `specs/NNN-[feature]/`
- Never put two features in one `spec.md`
- Never put two features' flows in one directory
- Never implement a feature before its spec folder exists
- Feature implementation order follows dependency, not convenience

**Feature folder structure:**
```
specs/NNN-[feature]/
  spec.md          all 4 layers in one file
  plan.md          architecture + testID inventory
  data-model.md    TypeScript types derived from Layer 3
  tasks.md         UC gate pattern

e2e/flows/[feature]/
  UC-NN-[slug]/
    AC-1-[slug].yaml    one file per AC
    AC-2-[slug].yaml

e2e/suites/[feature].yaml
```

---

## §8. Task Structure (enforce in every tasks.md)

Every UC task group follows this exact pattern:

```markdown
## UC-NN: [Use Case Name]

- [ ] GATE — confirm e2e/flows/[feature]/UC-NN-[slug]/ exists
             with AC flow files for every AC in this UC
- [ ] Add testID props required by this UC's flows
- [ ] [implementation tasks]
- [ ] GATE — maestro test e2e/flows/[feature]/UC-NN-[slug]/
             → all AC flows GREEN
```

Both GATE tasks are mandatory. A UC is complete only when its
final GATE passes. Never mark a UC complete without running Maestro.

---

## §9. CI Gate

`bash e2e/check-sync.sh` passes before every merge.

**check-sync.sh validates:**
1. Every flow has all six required header lines
2. Every `→ e2e:` in `spec.md` points to a real file
3. Every `# spec:` in a flow points to a real spec file
4. Every `# test-name:` matches format `UC-NN_AC-N_[slug]`
5. Every `→ e2e:` is followed immediately by `→ test-name:`
6. No list-item testID contains an array-index suffix (`name_0`)

**During development:** run feature suite only (fast):
```bash
maestro test e2e/suites/[feature].yaml
```

**Before merge:** run full regression (CI):
```bash
maestro test e2e/suite.yaml
bash e2e/check-sync.sh
npx tsc --noEmit
```

---

## §10. feature-map.md (keep current)

`specs/_project/feature-map.md` is updated on every status change.

Status values:
```
⚪ not started    spec does not exist
🟡 specced         spec.md exists, flows not yet written
🔵 flows ready     flows exist and confirmed RED
🟢 implemented     all flows GREEN, code committed
🔴 broken          a flow has regressed to RED
```

Never let the map go stale. Update before every commit.

---

## §11. Model Tiering

Match the model to the task:
- Spec writing (`/speckit.specify`, `/speckit.plan`): frontier model
- Implementation (`/speckit.implement`): mid-range model
- Verification (`maestro`, `tsc`, `check-sync.sh`): automated, no model

---

## §12. SDD Scope Rule

Fewer than 2 use cases and single developer only:
skip `/speckit.flows` and `/speckit.plan`, write a short inline
spec comment, and use `/speckit.implement` directly.

The 4-layer model earns its cost when:
- A non-developer needs to read or correct the spec, OR
- The feature has 3 or more use cases, OR
- E2E tests are mandatory, OR
- The feature will outlive the first implementation.


---

## §13. Maestro Mode

**Current:** `local-expo-go`

The Maestro mode determines how flows launch the app and interact
with the build pipeline.

| Mode | When to use |
|---|---|
| `local-expo-go` | No native modules needed. App launches via Expo Go. |
| `dev-client` | Custom native modules or config plugins. Requires a dev-client build. |
| `production` | Testing against a published build (internal distribution or app store). |

### §13.1 Expo Go Project Name

Value: `speckit-todo-expo-maestro` (from `app.json` → `expo.name`)

Used in the launch preamble of every flow: `tapOn: { text: "speckit-todo-expo-maestro" }`

### §13.2 First-Screen Anchor

Value: `task_input`

The testID of the first element that becomes visible after the Expo
Go project screen is dismissed. Must exist on the initial route
before any user interaction.

When the anchor testID changes (e.g. during refactoring), update
this value and regenerate all flow preambles via Protocol B
(test-change, no spec-change required).

---

## Project-Specific Rules
<!-- /speckit.specify appends platform and team rules below here.  -->
<!-- Do not edit §1–§12 above this line.                           -->