---
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
tools: ['github/github-mcp-server/issue_write']
---

## Hooks: before_taskstoissues
Read `.specify/extensions.yml` → `hooks.before_taskstoissues`. Skip disabled (enabled=false), non-empty condition. Optional: prompt user. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.

## Outline

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` → parse FEATURE_DIR, AVAILABLE_DOCS.
1. **IF EXISTS**: Load `.specify/memory/constitution.md` for project principles and governance constraints.
1. From the executed script, extract the path to **tasks**.
1. Get the Git remote by running:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> ONLY PROCEED TO NEXT STEPS IF THE REMOTE IS A GITHUB URL

1. For each task in the list, use the GitHub MCP server to create a new issue in the repository that is representative of the Git remote.

> [!CAUTION]
> UNDER NO CIRCUMSTANCES EVER CREATE ISSUES IN REPOSITORIES THAT DO NOT MATCH THE REMOTE URL

## Hooks: after_taskstoissues
Read `.specify/extensions.yml` → `hooks.after_taskstoissues`. Skip disabled, non-empty condition. Optional: prompt. Mandatory: EXECUTE_COMMAND. No hooks/file → skip.
