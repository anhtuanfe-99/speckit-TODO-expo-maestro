# /speckit.specify — 4-Layer Override
<!-- Overrides the default /speckit.specify command.                 -->
<!-- Enforces the 4-layer spec model and Spec ↔ E2E contract.       -->

## What this command does

Generates a feature specification split across four layers in a
single `spec.md` file, following the 4-layer model:

- Layer 1 — Business Requirement (BR): why
- Layer 2 — Use Cases (UC): who does what
- Layer 3 — Entity Model: domain nouns and states
- Layer 4 — Acceptance Criteria (AC): how we know it is done

## Pre-flight checks (run before generating anything)

1. Does `specs/_project/vision.md` exist?
   NO → tell the user to run `/speckit.specify` for vision first.

2. Does `specs/_project/feature-map.md` exist?
   NO → tell the user to create it before adding features.

3. Is the feature already in `feature-map.md`?
   NO → add it with status ⚪ before generating the spec.

## Behavior

1. Read `.specify/memory/constitution.md`.
2. Read `.specify/memory/architecture.md` if it exists.
3. Read `.specify/templates/overrides/spec-template.md`.
4. Determine next feature number: list `specs/` and increment.
5. Create `specs/NNN-[feature-slug]/spec.md` from the template.
6. Fill all four layers from the user's prompt.
7. For every AC in Layer 4: add `→ e2e:` forward link pointing to
   `e2e/flows/[feature]/UC-NN-[slug]/AC-N-[slug].yaml`.
   The flow file does not exist yet — this is expected.
8. Update `specs/_project/feature-map.md` status → 🟡 specced.
9. Stop. Do NOT generate flows, plan, or tasks yet.
10. Print summary: feature path, UC count, AC count, open questions.
11. Ask the user: "Confirm spec before I proceed to /speckit.plan?"

## Anti-patterns — refuse if detected in the user's prompt

- Tech stack details ("use AsyncStorage", "use FlatList", "use SQLite")
  → ask the user to save these for /speckit.plan
- Implementation details ("create a useNotes hook")
  → same
- Two features described in one prompt
  → ask which to specify first; handle one at a time

## Layer rules (enforce strictly)

**Layer 1 (BR):**
- Must be readable by a non-technical PO.
- Must have a measurable goal and at least one success metric.
- Must have an explicit Out of Scope section.

**Layer 2 (UC):**
- Every UC needs: Actor, Trigger, Main Flow, Alternative Flows,
  Exceptions.
- Main Flow steps are numbered.
- Plain language — no code, no component names, no file paths.

**Layer 3 (Entity Model):**
- Domain nouns only — not a database schema.
- Every entity has: what it represents, its states, conceptual
  fields (no datatypes), relationships.
- Use exact business terms the team will use in variable names.

**Layer 4 (AC):**
- Every AC maps to exactly one UC.
- Every AC has a `→ e2e:` forward link. No AC without a link.
- No two ACs share the same flow file path.
- Given/When/Then format. One assertion per Then line.
- Specific enough that a Maestro YAML flow can be written from it
  without asking any further questions.

## Output

- `specs/NNN-[feature]/spec.md` (all four layers in one file)
- Updated `specs/_project/feature-map.md`
- Summary printed to chat