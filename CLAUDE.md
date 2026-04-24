# create-viterex

Create CLI tool to scaffold a ViteRex project (Redaxo CMS + Vite JS + Tailwind CSS). Published as `pnpx create-viterex`.
Analyse the current state of the codebase for an up-to-date overview of the current architecture (root directory, setup/). The new implementation will be in `src/`, which already contains some typescript files outlining the intended structure. Pay close attention to the current shell script in `setup/` for the actual commands being run, as these will need to be translated into the new TypeScript implementation.

## Architecture

Three-layer design:

1. **Config collection** (`src/prompts.ts`) — Interactive terminal prompts via `@clack/prompts`. Collects project name, Redaxo version, DB credentials, addon selection, package manager choice. Bypassable with `--config path/to/config.json` for CI/automated use.

2. **Task pipeline** (`src/pipeline.ts`) — Ordered array of `Task` objects, each with `name`, optional `skip` predicate, and async `run` function. Tasks execute sequentially with spinner feedback. Each task is idempotent — safe to re-run on failure.

3. **Individual tasks** (`src/tasks/`) — Each file does one thing via `execa` shell commands:
   - `download-redaxo.ts` — curl + unzip Redaxo release from GitHub
   - `setup-database.ts` — DROP IF EXISTS + CREATE via mysql CLI
   - `install-redaxo.ts` — `php redaxo/bin/console setup:run` with flags
   - `install-addons.ts` — Loop: download → install → activate per addon via Redaxo CLI
   - `scaffold-frontend.ts` — Copy template files and generate .env
   - `install-deps.ts` — composer install + yarn/npm/pnpm install
   - `init-git.ts` — git init + initial commit

## Tech stack

- TypeScript, ESM, built with `tsup`
- `@clack/prompts` — terminal UI (same lib as create-svelte, nuxi)
- `commander` — CLI arg parsing and --flags
- `execa` — shell command execution (no shell injection, proper error handling)
- `chalk` — colored output
- `fs-extra` — file operations
- `ora` — spinners (used in pipeline)

## Key types

- `ViterexConfig` (`src/types.ts`) — Single config object passed through entire pipeline
- `AddonSelection` — Per-addon install/activate state with optional plugins
- `ADDON_CATALOG` — Static list of available Redaxo addons with recommended defaults
- `Task` (`src/pipeline.ts`) — `{ name, skip?, run }` interface

## Build & run

```bash
pnpm install
pnpm run build        # tsup → dist/
node bin/cli.js      # dev run
pnpm run dev          # same thing
```

Published usage: `pnpx create-viterex [project-name] [--flags]`

## CLI flags

- `--skip-db` — skip database creation
- `--skip-addons` — skip addon installation
- `--skip-git` — don't init git repo
- `--pm <yarn|npm|pnpm>` — package manager (default: yarn)
- `--config <path>` — load config from JSON file, skip all prompts

## Templates

The `templates/` directory contains `.tpl` files that get copied/transformed into the project. Uses `{{PLACEHOLDER}}` token replacement. Needs to be populated with:

- `base/` — static files copied as-is (LocalValetDriver.php, etc.)

## Redaxo-specific notes

- Redaxo releases download from `https://github.com/redaxo/redaxo/releases/download/{version}/redaxo_{version}.zip`
- CLI commands: `php redaxo/bin/console setup:run`, `package:download`, `package:install`, `package:activate`
- Plugin keys use slash notation: `addonname/pluginname`
- The exact CLI flags for `setup:run` need to be verified against the targeted Redaxo version — they may vary

## TODO

Shipped work has moved to `CHANGELOG.md`. Remaining open items are grouped by theme.

### Product / roadmap

- [ ] Publish to npm as `create-viterex`
- [ ] Publish `viterex-addon` to the Redaxo installer (separate repo)
- [ ] Swap `install-submodule-addons.ts` for a Redaxo-installer install once `viterex-addon` is published — it's the shared frontend logic and should be installed by default
- [ ] Ship default `templates/base/package.json.tpl` with Vite + Tailwind deps and scripts (token replacement for project name)
- [ ] Ship default `templates/base/vite.config.js.tpl`, `tailwind.config.js.tpl`, `index.js`, `.gitignore.tpl`
- [ ] `--generate-config` flag: run prompts, write JSON, exit (for CI)
- [ ] Prompt for `redaxo_install_config.json` contents instead of copying the hard-coded `templates/redaxo/redaxo_install_config.json`; skip the step entirely when the user provides nothing

### Decouple from MASSIF

- [ ] Support a user-level `~/.viterex/addons.json` that adds extra entries to `ADDON_CATALOG` for interactive selection across projects — presets already cover per-project submodule-addons and template replacements
- [ ] Remove `gittower` call from `open-browser.ts` (or gate behind a preset/flag) — currently hard-wired for the MASSIF workflow

### Bugs / cleanup (found during the current review)

- [ ] Delete unused `src/tasks/setup-database.ts` — never imported; DB is created inline by `setup:run --db-createdb=yes`
- [ ] Fix `scripts/test-run.sh`: `CLI` points to `src/dist/index.js`, should be `dist/index.js`
- [ ] Update `README.md` addon table to match `ADDON_CATALOG` (drop `plyr`, `markitup`, `redactor`, `yform_quick_edit`); replace `massifSettings` docs with `templateReplacements`
- [ ] Allow `--resume` with `--config` (derive project dir from the config file, not only from the positional arg) in `src/state.ts#loadState`
- [ ] Stop silent `git push --force` fallback in `create-git-remote.ts` — prompt or require an explicit `--force` flag
- [ ] Honour `skipDb` in `install-redaxo.ts` (currently still passes DB creds and `--db-createdb=yes`)
- [ ] Make `install-redaxo.ts` locale/timezone configurable (prompt defaults: `de_de` / `Europe/Berlin`)
- [ ] Surface dev-server failures: `start-dev-server.ts` uses `stdio: "ignore"` — write to a log file or inherit when `--verbose`
- [ ] Handle Windows in `open-browser.ts` (`start` command) or gracefully skip

### Tooling

- [ ] Add `tsup.config.ts` so the build is declarative
- [ ] Rename `pnpm run dev` → `pnpm run start`, and have a real `dev` script run `tsup --watch` — today `dev` requires a prior `build`
- [ ] Add a minimal Vitest unit test for `replacePlaceholders` (in `scaffold-frontend.ts`) and the `loadState` migration logic
- [ ] Add CI (GitHub Actions) running `pnpm build` + `scripts/test-run.sh`