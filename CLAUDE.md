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

- [ ] add default `templates/base/package.json.tpl` with basic dependencies and scripts for Vite. This will be copied to the project during `scaffold-frontend.ts` with token replacement for project name and other dynamic values. This way we can provide a ready-to-go `package.json` file that users can further customize after installation, and also ensure that all necessary dependencies are included by default.

- [ ] currently there's a lot of MASSIF specific stuff going on in the codebase, which is not ideal as it couples the `create-viterex` package to a specific use case. We should aim to make the installation process more generic and flexible, so that it can be used for different projects and use cases without being tied to MASSIF. This can be achieved by allowing users to choose which addons they want to install during the prompts phase, and then installing only those addons during the installation phase. We can also provide a default configuration that includes the most commonly used addons, but allow users to customize it based on their needs. This way we can make `create-viterex` a more versatile and widely applicable tool for scaffolding ViteRex projects. Still, we can keep the MASSIF demo content as an optional addon that users can choose to install if they want to have a ready-to-go demo environment, but it shouldn't be the default or only option.

- [ ] publish `viterex-addon` package (viterex addon repo, not this one) to redaxo installer for one-click install from Redaxo backend

- [ ] install `viterex-addon` addon package from redaxo installer in `install-addons.ts` instead of cloning from GitHub (currently the addon is not published, so we clone the repo directly). `viterex-addon` is a required addon as it contains shared assets and logic for the frontend, so it should be installed by default.

- [ ] Allow custom addons via separate `addons.json` config file that extends `ADDON_CATALOG`. Custom addons should allow replacement key/value pairs to replace values in the custom sql seed file (`redaxo_custom_sql_seed.sql.tpl`) during installation, like `massif_settings` currently does. This way we can have a more flexible and customizable installation process that can adapt to different use cases and requirements. For example, we could have a custom addon that seeds specific demo content during installation by providing a custom sql seed file with the necessary replacements for dynamic values like database credentials. This would allow us to easily set up different demo environments with different content based on the same base configuration.

- [ ] Remove `massif_settings`, `massif_dnd_sorter` and `massif` addons from main config, setup process and `ADDON_CATALOG` and instead allow installing them via the `addons.json` file as described in the previous point. This way we can also have versioning for them and decouple their release cycles from the main `create-viterex` package.

- [ ] in `addons.json` allow installing addons by cloning them from a repository instead of from installing from redaxo installer by optionally providing the repository url in `install-addons.ts`

- [ ] Only install `viterex-addon`, `massif_settings`, `massif_dnd_sorter` and `massif` addons as a submodules under the `massif` preset.

- [ ] redaxo installer config file (`templates/redaxo/redaxo_install_config.json`) shouldn't be hard coded and instead be prompted by the setup routine. If presented, it should be used in `scaffold-frontend.ts` to generate the file `redaxo_install_config.json` in the data dir (as is the case now). If none is provided, this step should be skipped.

- [ ] add `--generate-config` flag to output a config JSON file based on CLI prompts and exit, for easier CI usage

- [ ] Publish to npm as `create-viterex`
