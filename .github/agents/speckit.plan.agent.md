---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## Hooks: before_plan
Read `.specify/extensions.yml` → `hooks.before_plan`. Skip disabled (enabled=false), non-empty condition. Optional: prompt user. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.

## Outline

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json` → parse FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH.
2. **Load**: Read FEATURE_SPEC + `.specify/memory/constitution.md`. Load IMPL_PLAN template.
3. **Execute**: Follow IMPL_PLAN template:
   - Fill Technical Context (unknowns → "NEEDS CLARIFICATION")
   - Fill Constitution Check
   - Evaluate gates (ERROR if unjustified violations)
   - Phase 0: Generate research.md (resolve NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context
   - Re-evaluate Constitution Check

## Hooks: after_plan
Read `.specify/extensions.yml` → `hooks.after_plan`. Skip disabled, non-empty condition. Optional: prompt. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.

## Completion

Report: branch, IMPL_PLAN path, generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define interface contracts** (if project has external interfaces) → `/contracts/`:
   - Identify what interfaces the project exposes to users or other systems
   - Document the contract format appropriate for the project type
   - Examples: public APIs for libraries, command schemas for CLI tools, endpoints for web services, grammars for parsers, UI contracts for applications
   - Skip if project is purely internal (build scripts, one-off tools, etc.)

3. **Create quickstart validation guide** → `quickstart.md`:
   - Document runnable validation scenarios that prove the feature works end-to-end
   - Include prerequisites, setup commands, test/run commands, and expected outcomes
   - Use links or references to contracts and data model details instead of duplicating them
   - Do not include full implementation code, model/service/controller bodies, migrations, or complete test suites
   - Keep this artifact as a validation/run guide; implementation details belong in `tasks.md` and the implementation phase

4. **Agent context update**:
   - Update the plan reference between the `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` markers in `.github/copilot-instructions.md` to point to the plan file created in step 1 (the IMPL_PLAN path)

**Output**: data-model.md, /contracts/*, quickstart.md, updated agent context file

## Key rules

- Use absolute paths for filesystem operations; use project-relative paths for references in documentation and agent context files
- ERROR on gate failures or unresolved clarifications

## Done When

- [ ] Plan workflow executed and design artifacts generated
- [ ] Extension hooks (Hooks: after_plan) dispatched or skipped
- [ ] Completion reported to user with branch, plan path, and generated artifacts
