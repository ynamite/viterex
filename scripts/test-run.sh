#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="node $REPO_ROOT/src/dist/index.js"
TMPDIR_BASE="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_BASE"' EXIT

pass=0
fail=0

run_test() {
  local name="$1"
  shift
  echo "--- TEST: $name"
  if "$@"; then
    echo "    PASS"
    pass=$((pass + 1))
  else
    echo "    FAIL (exit code $?)"
    fail=$((fail + 1))
  fi
}

# ─── 1. --help works ──────────────────────────────────────────────────
run_test "--help flag" $CLI --help

# ─── 2. --version works ───────────────────────────────────────────────
run_test "--version flag" $CLI --version

# ─── 3. --dry-run without --config (no project-name, should list tasks) ─
# This tests that dry-run + skip flags bypass prompts-needing paths
# We pass a project name and all skip flags so it doesn't actually need prompts
CONFIG_FILE="$TMPDIR_BASE/test-config.json"
PROJECT_DIR="$TMPDIR_BASE/test-project"
mkdir -p "$PROJECT_DIR"

cat > "$CONFIG_FILE" <<JSON
{
  "projectName": "test-project",
  "projectDir": "$PROJECT_DIR",
  "redaxoVersion": "5.17.1",
  "redaxoAdminUser": "admin",
  "redaxoAdminPassword": "admin123",
  "redaxoAdminEmail": "admin@example.com",
  "redaxoErrorEmail": "error@example.com",
  "redaxoServerName": "test-project.test",
  "skipDb": true,
  "dbHost": "127.0.0.1",
  "dbPort": 3306,
  "dbName": "test_project",
  "dbUser": "root",
  "dbPassword": "",
  "skipAddons": true,
  "addons": [],
  "packageManager": "npm",
  "useTailwind": false,
  "useFluidTw": false,
  "setupDeploy": false,
  "skipGit": true,
  "verbose": false
}
JSON

# ─── 4. --config + --dry-run (core test) ──────────────────────────────
# Should print "Would run" / "Would skip" for each task and exit 0
run_test "--config + --dry-run" $CLI --config "$CONFIG_FILE" --dry-run

# ─── 5. --config + --dry-run output contains expected task names ───────
echo "--- TEST: dry-run output contains all task names"
OUTPUT=$($CLI --config "$CONFIG_FILE" --dry-run 2>&1)
all_found=true
for task in "Download Redaxo" "Install Redaxo" "Scaffold frontend" "Install dependencies" "Initialize git"; do
  if echo "$OUTPUT" | grep -q "$task"; then
    echo "    Found: $task"
  else
    echo "    MISSING: $task"
    all_found=false
  fi
done
# Skipped tasks should say "Would skip"
for task in "Create database" "Install addons"; do
  if echo "$OUTPUT" | grep -q "Would skip.*$task"; then
    echo "    Correctly skipped: $task"
  else
    echo "    MISSING skip for: $task"
    all_found=false
  fi
done
if $all_found; then
  echo "    PASS"
  pass=$((pass + 1))
else
  echo "    FAIL"
  fail=$((fail + 1))
fi

# ─── 6. --config + --dry-run + --verbose (flags combine) ──────────────
run_test "--config + --dry-run + --verbose" $CLI --config "$CONFIG_FILE" --dry-run --verbose

# ─── 7. --config with addons enabled ──────────────────────────────────
CONFIG_ADDONS="$TMPDIR_BASE/test-config-addons.json"
cat > "$CONFIG_ADDONS" <<JSON
{
  "projectName": "test-addons",
  "projectDir": "$TMPDIR_BASE/test-addons",
  "redaxoVersion": "5.17.1",
  "redaxoAdminUser": "admin",
  "redaxoAdminPassword": "admin123",
  "redaxoAdminEmail": "admin@example.com",
  "redaxoErrorEmail": "error@example.com",
  "redaxoServerName": "test-addons.test",
  "skipDb": false,
  "dbHost": "127.0.0.1",
  "dbPort": 3306,
  "dbName": "test_addons",
  "dbUser": "root",
  "dbPassword": "",
  "skipAddons": false,
  "addons": [
    { "key": "yrewrite", "install": true, "activate": true },
    { "key": "developer", "install": true, "activate": true }
  ],
  "packageManager": "yarn",
  "useTailwind": true,
  "useFluidTw": true,
  "setupDeploy": true,
  "skipGit": false,
  "verbose": false
}
JSON

echo "--- TEST: --config (all enabled) + --dry-run lists all tasks as Would run"
OUTPUT=$($CLI --config "$CONFIG_ADDONS" --dry-run 2>&1)
all_run=true
for task in "Download Redaxo" "Create database" "Install Redaxo" "Install addons" "Scaffold frontend" "Install dependencies" "Initialize git"; do
  if echo "$OUTPUT" | grep -q "Would run.*$task"; then
    echo "    Would run: $task"
  else
    echo "    MISSING run for: $task"
    all_run=false
  fi
done
if $all_run; then
  echo "    PASS"
  pass=$((pass + 1))
else
  echo "    FAIL"
  fail=$((fail + 1))
fi

# ─── Summary ──────────────────────────────────────────────────────────
echo ""
echo "================================"
echo "  $pass passed, $fail failed"
echo "================================"

[ "$fail" -eq 0 ]
