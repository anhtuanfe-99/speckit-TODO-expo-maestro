# `.specify` — Spec Kit Engine

This folder is the configuration and engine directory for **Spec Kit** (speckit), the Spec-Driven Development (SDD) toolchain used by this project. It is generated and managed by the `specify` CLI.

> **Do not manually edit files in this directory unless you know what you're doing.** Templates and scripts are overwritten on `specify` upgrades. Configuration files (YAML/JSON) and `memory/` are safe to edit.

---

## What Spec Kit Does

Spec Kit implements the **Spec-Driven Development** workflow:

```
/speckit.specify  →  specs/NNN-feature/spec.md        (4-layer spec)
/speckit.flows    →  e2e/flows/[feature]/AC-N.yaml    (Maestro flows)
/speckit.plan     →  specs/NNN-feature/plan.md         (architecture)
/speckit.tasks    →  specs/NNN-feature/tasks.md        (task breakdown)
/speckit.implement → source code                       (implementation)
```

Commands are dispatched through the active integration (Copilot, Claude, Gemini, etc.) via agent files in `.github/agents/` and prompts in `.github/prompts/`.

---

## Folder Structure

```
.specify/
├── extensions.yml              # Installed extensions & hook config
├── feature.json                # Currently active feature directory
├── integration.json            # Active integration & version
├── init-options.json           # Initialization settings (AI, numbering, etc.)
│
├── memory/                     # Project knowledge fed to every command
│   ├── architecture.md         # Stack, conventions, key file map
│   └── constitution.md         # Enforced rules (the "project constitution")
│
├── integrations/               # Integration manifests
│   ├── copilot.manifest.json   # Copilot agent/prompt file hashes
│   └── speckit.manifest.json   # Script & template file hashes
│
├── extensions/
│   └── agent-context/          # Manages coding agent context files
│       ├── extension.yml       # Extension definition & hooks
│       ├── agent-context-config.yml  # Config: context file path & markers
│       ├── README.md           # Extension documentation
│       ├── commands/
│       │   └── speckit.agent-context.update.md  # Command definition
│       └── scripts/
│           ├── bash/update-agent-context.sh
│           └── powershell/update-agent-context.ps1
│
├── scripts/
│   └── bash/
│       ├── common.sh                 # Shared functions (path resolution, etc.)
│       ├── check-prerequisites.sh    # Validates preconditions for commands
│       ├── create-new-feature.sh     # Scaffolds a new feature directory
│       ├── setup-plan.sh             # Copies plan template into feature dir
│       └── setup-tasks.sh            # Copies tasks template into feature dir
│
├── templates/                  # Templates for generated artifacts
│   ├── spec-template.md        # 4-layer spec template
│   ├── plan-template.md        # Implementation plan template
│   ├── tasks-template.md       # Task breakdown template
│   ├── checklist-template.md   # Custom checklist template
│   ├── constitution-template.md
│
└── workflows/                  # Workflow definitions
    ├── workflow-registry.json  # Installed workflow registry
    └── speckit/
        └── workflow.yml        # "Full SDD Cycle" workflow (specify → implement)
```

---

## Key Files Explained

### `memory/constitution.md`

The **project constitution** — a set of enforced rules read by every `/speckit.*` command before acting. Contains:

- **§1** — Spec ↔ E2E Locked Pair (every AC must have a flow file)
- **§2** — 4-Layer Spec Model (BR, UC, Entity, AC)
- **§3** — Command Order (specify → flows → plan → tasks → implement)
- **§4** — Change Protocols (how to handle requirement/flow/code changes)
- **§5** — testID Rules (snake_case, no array-index suffixes)
- **§6** — Test Naming Convention (UC-NN_AC-N_slug format)
- **§7** — One Spec Per Feature
- **§8** — Task Structure (UC gate pattern)

### `memory/architecture.md`

A snapshot of the project's stack, conventions, and key file locations. Auto-synced by the agent-context extension after `/speckit.specify` and `/speckit.plan`.

### `extensions.yml`

Controls which extensions are installed and their hook behavior. Currently installed:
- **agent-context** — Refreshes the coding agent context file (`.github/copilot-instructions.md`) after `/speckit.specify` and `/speckit.plan` via hooks.

### `feature.json`

Points to the currently active feature directory (e.g., `specs/001-task-management`). Updated by `/speckit.specify`.

### `integration.json`

Tracks the active integration (Copilot, Claude, etc.) and version. Contains checksums for all installed agent/prompt files.

### `init-options.json`

Records the choices made during `specify init`: which AI integration, numbering scheme, script type, etc.

---

## Agent Context Extension

The `agent-context` extension manages a managed section in the coding agent's instruction file (`.github/copilot-instructions.md`). The section is delimited by markers:

```
<!-- SPECKIT START -->
... auto-managed content (points to the latest plan.md) ...
<!-- SPECKIT END -->
```

- Runs automatically as a hook after `/speckit.specify` and `/speckit.plan`.
- Can be triggered manually via `/speckit.agent-context.update`.
- Can be disabled with `specify extension disable agent-context`.

---

## Scripts

Bash scripts in `scripts/bash/` support the workflow from the command line:

| Script | Purpose |
|--------|---------|
| `create-new-feature.sh` | Scaffolds a new feature directory (`specs/NNN-feature/`) with branch name detection and dry-run support |
| `check-prerequisites.sh` | Validates that required docs exist before running a command |
| `setup-plan.sh` | Copies the plan template into the feature directory |
| `setup-tasks.sh` | Copies the tasks template into the feature directory |
| `common.sh` | Shared path resolution and utility functions |

---

## Workflows

The `workflows/speckit/workflow.yml` defines a **"Full SDD Cycle"** workflow that runs:

1. `/speckit.specify` — generate spec
2. **Review gate** — approve or abort
3. `/speckit.plan` — generate plan
4. **Review gate** — approve or abort
5. `/speckit.tasks` — generate tasks
6. `/speckit.implement` — implement code

---

## How It All Fits Together

```
User prompt
     │
     ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Integration  │────→│  Agent/Prompt    │────→│  .specify/       │
│ (Copilot)    │     │  .github/agents/ │     │  ├─ memory/      │
└─────────────┘     │  .github/prompts/ │     │  ├─ templates/   │
                    └──────────────────┘     │  ├─ scripts/     │
                                             │  └─ extensions/  │
                                                    │
                                                    ▼
                                          ┌──────────────────┐
                                          │ Generated Artifacts│
                                          │ specs/NNN-feature/│
                                          │ e2e/flows/       │
                                          │ App.tsx           │
                                          └──────────────────┘
```

The integration (e.g., Copilot) reads agent instructions from `.github/agents/` and `.github/prompts/`. Those instructions reference the constitution, architecture, templates, and scripts in `.specify/`. The commands produce artifacts in `specs/`, `e2e/`, and the source tree.

---

## Maintenance

- **Upgrade Spec Kit**: `pip install --upgrade specify` (or the relevant package manager)
- **Reinstall integration files**: `specify integration install copilot`
- **Disable an extension**: `specify extension disable agent-context`
- **Check status**: `specify status`
