# create-viterex

Create CLI tool to scaffold a ViteRex project (Redaxo CMS + Vite JS + Tailwind CSS). Published as `pnpx create-viterex`.
Analyse the current state of the codebase for an up-to-date overview of the current architecture (root directory, setup/). The new implementation will be in `src/`, which already contains some typescript files outlining the intended structure. Pay close attention to the current shell script in `setup/` for the actual commands being run, as these will need to be translated into the new TypeScript implementation.

## Architecture

Three-layer design:

1. **Config collection** (`src/prompts.ts`) — Interactive terminal prompts via `@clack/prompts`. Collects project name, Redaxo version, DB credentials, addon selection, Tailwind/Fluid TW toggles, package manager choice. Bypassable with `--config path/to/config.json` for CI/automated use.

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

- [ ] Populate `templates/` directory with actual config files (port from current viterex repo, which is the current root directory)
- [ ] Verify Redaxo CLI `setup:run` flags against target version
- [ ] Expand `ADDON_CATALOG` with full addon list and plugin sub-selections
- [ ] Add `--resume` flag with `.viterex-state.json` to track completed steps
- [ ] Add SHA checksum verification for Redaxo download
- [ ] Error recovery: let user retry individual failed tasks
- [ ] Add `--verbose` flag to pipe task stdout/stderr to terminal
- [ ] Add `--dry-run` flag that prints what would happen without executing
- [ ] Publish to npm as `create-viterex`
