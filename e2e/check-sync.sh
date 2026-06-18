#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ERRORS=0

echo "=== e2e/check-sync.sh — Spec ↔ Flow sync validation ==="
echo ""

# ── Existing: header checks ──────────────────────────────────────────
echo "--- Checking flow file headers ---"
for flow in "$ROOT_DIR"/e2e/flows/**/*.yaml; do
  [ -f "$flow" ] || continue
  rel="${flow#$ROOT_DIR/}"

  if ! grep -q "^# spec:" "$flow"; then
    echo "❌ MISSING '# spec:' header → $rel"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^# use-case:" "$flow" && ! grep -q "^# user-story:" "$flow"; then
    echo "❌ MISSING '# use-case:' or '# user-story:' header → $rel"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^# scenario:" "$flow"; then
    echo "❌ MISSING '# scenario:' header → $rel"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^# ac:" "$flow"; then
    echo "❌ MISSING '# ac:' header → $rel"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^# protocol:" "$flow"; then
    echo "❌ MISSING '# protocol:' header → $rel"
    ERRORS=$((ERRORS + 1))
  fi
done

# ── Validation A: every flow has correctly formatted # test-name: ────
echo ""
echo "--- Checking # test-name: format in all flows ---"
for flow in "$ROOT_DIR"/e2e/flows/**/*.yaml; do
  [ -f "$flow" ] || continue
  rel="${flow#$ROOT_DIR/}"

  if ! grep -q "^# test-name:" "$flow"; then
    echo "❌ MISSING '# test-name:' header → $rel"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  test_name=$(grep "^# test-name:" "$flow" | sed "s/^# test-name: //")

  if ! echo "$test_name" | grep -qE '^UC-[0-9]{2}_AC-[0-9]+_[a-z0-9-]+$'; then
    echo "❌ INVALID test-name format: '$test_name' → $rel"
    echo "   Expected: UC-NN_AC-N_slug (e.g. UC-01_AC-1_new-note-saved)"
    ERRORS=$((ERRORS + 1))
  fi
done

# ── Validation B: every → e2e: in spec.md is followed by → test-name: ─
echo ""
echo "--- Checking → test-name: follows every → e2e: in specs ---"
for spec in "$ROOT_DIR"/specs/**/*.md; do
  [ -f "$spec" ] || continue
  rel="${spec#$ROOT_DIR/}"

  while IFS=: read -r line_num _; do
    next_line=$(sed -n "$((line_num + 1))p" "$spec")
    if ! echo "$next_line" | grep -q "^→ test-name:"; then
      echo "❌ MISSING '→ test-name:' after '→ e2e:' at line $line_num in $rel"
      ERRORS=$((ERRORS + 1))
    fi
  done < <(grep -n "^→ e2e:" "$spec")
done

# ── Every → e2e: in spec.md points to a real file ────────────────────
echo ""
echo "--- Checking → e2e: paths point to real files ---"
for spec in "$ROOT_DIR"/specs/**/*.md; do
  [ -f "$spec" ] || continue
  rel="${spec#$ROOT_DIR/}"

  while IFS= read -r e2e_path; do
    # Strip backticks and whitespace
    e2e_path="$(echo "$e2e_path" | sed 's/[`"'"'"']//g' | xargs)"
    full_path="$ROOT_DIR/$e2e_path"
    if [ ! -f "$full_path" ]; then
      echo "❌ → e2e: path does not exist → $e2e_path (in $rel)"
      ERRORS=$((ERRORS + 1))
    fi
  done < <(grep -oP '(?<=→ e2e: ).*?(?=($| →|$))' "$spec" 2>/dev/null || true)
done

# ── Every # spec: in a flow points to a real spec file ────────────────
echo ""
echo "--- Checking # spec: paths point to real spec files ---"
for flow in "$ROOT_DIR"/e2e/flows/**/*.yaml; do
  [ -f "$flow" ] || continue
  rel="${flow#$ROOT_DIR/}"

  spec_ref=$(grep "^# spec:" "$flow" | sed "s/^# spec: //" | xargs)
  if [ -n "$spec_ref" ]; then
    full_path="$ROOT_DIR/$spec_ref"
    if [ ! -f "$full_path" ]; then
      echo "❌ # spec: path does not exist → '$spec_ref' (in $rel)"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

# ── No list-item testID contains an array-index suffix ───────────────
echo ""
echo "--- Checking for array-index testID suffixes ---"
for flow in "$ROOT_DIR"/e2e/flows/**/*.yaml; do
  [ -f "$flow" ] || continue
  rel="${flow#$ROOT_DIR/}"

  if grep -nP 'id: ".*_\d+"' "$flow" 2>/dev/null; then
    echo "❌ Array-index suffix found in testID → $rel"
    echo "   Use index: N instead of id: \"name_N\""
    ERRORS=$((ERRORS + 1))
  fi
done || true

# ── Final result summary ─────────────────────────────────────────────
echo ""
echo "=================================="
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ All checks passed."
else
  echo "❌ $ERRORS error(s) found."
fi
echo "=================================="
exit "$ERRORS"
