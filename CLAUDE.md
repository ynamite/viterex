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

- [x] Populate `templates/` directory with actual config files (port from current viterex repo, which is the current root directory)
- [x] Verify Redaxo CLI `setup:run` flags against target version
- [x] Expand `ADDON_CATALOG` with full addon list and plugin sub-selections
- [x] Add `--resume` flag with `.viterex-state.json` to track completed steps
- [x] Error recovery: let user retry individual failed tasks
- [x] Add `--verbose` flag to pipe task stdout/stderr to terminal
- [x] Add `--dry-run` flag that prints what would happen without executing
- [ ] add `--generate-config` flag to output a config JSON file based on CLI prompts and exit, for easier CI usage
- [ ] publish `viterex` addon package (viterex addon repo, not this one) to redaxo installer for one-click install from Redaxo backend
- [ ] install `viterex` addon package from redaxo installer in `install-addons.ts` instead of cloning from GitHub (currently the addon is not published, so we clone the repo directly). `viterex` is a required addon as it contains shared assets and logic for the frontend, so it should be installed by default.
- [ ] Allow custom addons via separate `addons.json` config file that extends `ADDON_CATALOG`
- [ ] in `addons.json` allow installing addons by cloning them from a repository instead of from installing from redaxo installer by providing the repository url in `install-addons.ts`
- [ ] Optionally also allow installing an addon as a submodule by marking them as `submodule: true` in `addons.json` file. This way we can also have addons that are not published in the redaxo installer, like `viterex`, as part of the configuration and installation process. Submodules will be added to the project and can be used in the same way as addons installed from the redaxo installer, but they will be managed as git submodules, which means they can be versioned and updated independently from the main project. Submodules MUST be installed in the `install-submodule-addons.ts` step. When installing submodules, we also need to run `composer install --working-dir=src/addons/${addonName} --optimize-autoloader --no-interaction --quiet` in their directories if a `composer.json` file is present to install their dependencies (just as is currently the case with `viterex` addon).
- [ ] remove hard coded submodules `viterex` (required anyway), `massif`, `massif_settings`, `massif_dnd_sorter` submodules and instead allow installing them via the `addons.json` file as described in the previous point. This way we can also have versioning for them and decouple their release cycles from the main `create-viterex` package.
- [ ] redaxo installer config file (`templates/redaxo/redaxo_install_config.json`) should be provided by the user or be generated based on user input during setup and then can be used for installing redaxo and addons from the redaxo installer in `install-redaxo.ts` and `install-addons.ts` instead of passing all the parameters via CLI flags.
- [ ] redaxo custom sql seed file (`templates/redaxo/redaxo_massif_install.sql.tpl`) is entirely optional and should be provided by the user instead of hard coded, like it is now. It can be used to seed custom data during redaxo installation, like we currently do for the massif demo content. If provided, it should be executed at the same moment it is now in `scaffold-frontend.ts` and also allow usage of replacements like `{{DB_NAME}}`, `{{DB_USER}}`, etc. for dynamic values based on user input.
- [ ] Publish to npm as `create-viterex`
