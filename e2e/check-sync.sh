#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ERRORS=0
red=$(tput setaf 1 2>/dev/null || echo '')
green=$(tput setaf 2 2>/dev/null || echo '')
reset=$(tput sgr0 2>/dev/null || echo '')

# ──────────────────────────────────────────────────────────────────────
# 1. Every flow has all six required header lines
# ──────────────────────────────────────────────────────────────────────
REQUIRED_HEADERS=(
    "# spec:"
    "# use-case:"
    "# ac:"
    "# scenario:"
    "# test-name:"
    "# protocol: changes require PROTOCOL B"
)

while IFS= read -r -d '' flow; do
    for header in "${REQUIRED_HEADERS[@]}"; do
        if ! grep -qF "$header" "$flow"; then
            echo "${red}ERROR${reset}: $flow — missing header: $header"
            ERRORS=$((ERRORS + 1))
        fi
    done
done < <(find "$REPO_ROOT/e2e/flows" -name '*.yaml' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# 2. Every → e2e: in spec.md points to a real file
# ──────────────────────────────────────────────────────────────────────
while IFS= read -r -d '' spec; do
    while IFS= read -r line; do
        e2e_path=$(echo "$line" | sed -n 's/.*→ e2e:[[:space:]]*`\([^`]*\)`.*/\1/p')
        if [ -n "$e2e_path" ]; then
            if [ ! -f "$REPO_ROOT/$e2e_path" ]; then
                echo "${red}ERROR${reset}: $spec → e2e: links to missing file: $e2e_path"
                ERRORS=$((ERRORS + 1))
            fi
        fi
    done < <(grep '→ e2e:' "$spec" 2>/dev/null | grep -v '<!--' || true)
done < <(find "$REPO_ROOT/specs" -name 'spec.md' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# 3. Every # spec: in a flow points to a real spec file
# ──────────────────────────────────────────────────────────────────────
while IFS= read -r -d '' flow; do
    spec_ref=$(grep '^# spec:' "$flow" 2>/dev/null | head -1 | sed 's/^# spec:[[:space:]]*//' | xargs)
    if [ -n "$spec_ref" ] && [ ! -f "$REPO_ROOT/$spec_ref" ]; then
        echo "${red}ERROR${reset}: $flow — # spec: references missing file: $spec_ref"
        ERRORS=$((ERRORS + 1))
    fi
done < <(find "$REPO_ROOT/e2e/flows" -name '*.yaml' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# 4. Every # test-name: matches format UC-NN_AC-N_[slug]
# ──────────────────────────────────────────────────────────────────────
TEST_NAME_RE='^UC-[0-9][0-9]_AC-[0-9][0-9]*_[a-z0-9][-a-z0-9]*$'

while IFS= read -r -d '' flow; do
    test_name=$(grep '^# test-name:' "$flow" 2>/dev/null | head -1 | sed 's/^# test-name:[[:space:]]*//' | xargs)
    if [ -n "$test_name" ]; then
        if ! echo "$test_name" | grep -qE "$TEST_NAME_RE"; then
            echo "${red}ERROR${reset}: $flow — invalid test-name format: $test_name"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done < <(find "$REPO_ROOT/e2e/flows" -name '*.yaml' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# 5. Every → e2e: is immediately followed by → test-name:
# ──────────────────────────────────────────────────────────────────────
while IFS= read -r -d '' spec; do
    # Get line numbers of → e2e: lines (skip HTML comments), check the next line
    while IFS=: read -r lnum _; do
        next_line=$((lnum + 1))
        next_content=$(sed -n "${next_line}p" "$spec" 2>/dev/null)
        if ! echo "$next_content" | grep -q '→ test-name:'; then
            echo "${red}ERROR${reset}: $spec line $lnum — → e2e: not immediately followed by → test-name:"
            ERRORS=$((ERRORS + 1))
        fi
    done < <(grep -n '→ e2e:' "$spec" 2>/dev/null | grep -v '<!--' || true)
done < <(find "$REPO_ROOT/specs" -name 'spec.md' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# 6. No testID with array-index suffix (e.g. id: "foo_0")
# ──────────────────────────────────────────────────────────────────────
while IFS= read -r -d '' flow; do
    if grep -qE 'id:[[:space:]]*"[^"]*_[0-9]+"' "$flow" 2>/dev/null; then
        echo "${red}ERROR${reset}: $flow — testID contains array-index suffix (e.g. foo_0)"
        ERRORS=$((ERRORS + 1))
    fi
done < <(find "$REPO_ROOT/e2e/flows" -name '*.yaml' -print0 2>/dev/null || true)

# ──────────────────────────────────────────────────────────────────────
# Result
# ──────────────────────────────────────────────────────────────────────
echo ""
if [ "$ERRORS" -gt 0 ]; then
    echo "${red} FAIL${reset} check-sync.sh: $ERRORS error(s) found"
    exit 1
else
    echo "${green} PASS${reset} check-sync.sh: all checks passed"
    exit 0
fi
