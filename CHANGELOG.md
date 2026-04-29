# Changelog

All notable changes to `create-viterex` are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project aims to
follow [Semantic Versioning](https://semver.org/) once it ships its first
release. Nothing has been published to npm yet — everything lives under
`[Unreleased]`.

## [Unreleased]

### Added (2026-04-30)

- **Preset extension: `installerConfig` and `deployerExtras`.** Presets can now ship personal/site-specific files instead of leaking them into default templates.
  - `installerConfig` (`string`, relative to preset dir) — a `redaxo_installer_config.json` copied to `<dataDir>/addons/install/config.json`. Skips the new credentials prompt when set.
  - `deployerExtras` (`string[]`, relative to preset dir) — `.php` files copied to the project root, `require`'d in `deploy.php` (via the new `{{DEPLOYER_EXTRAS}}` placeholder) and added to its `clear_paths` (via `{{DEPLOYER_EXTRAS_CLEAR_PATHS}}`).
  - Wired in `src/types.ts` (PresetConfig + ViterexConfig), `src/prompts.ts` (resolved to absolute paths after `loadPreset`), and `src/tasks/scaffold-frontend.ts` (three-way installer-config decision; deploy-extras expansion + post-render `\n{3,}` collapse).
- **REDAXO Installer credentials prompt.** Fresh installs now ask `Configure REDAXO Installer API credentials? (no/yes)` (default: no) when no preset declares `installerConfig`. A confirmed answer collects username + API key and writes `{ backups: true, api_login, api_key }` to `<dataDir>/addons/install/config.json`. Augment mode skips the prompt entirely.
- **`--generate-config [path]` and `--force` flags.** Run the prompt flow, write `viterex.json` (or a custom path) excluding runtime-only fields (`verbose`, `forcePush`, `withTower`), then exit. Refuses to overwrite an existing file unless `--force` is passed. `--config` is ignored when `--generate-config` is set.
- **Build and test infrastructure.**
  - `tsup.config.ts` at the repo root replaces inline build args; `scripts.build` is now just `tsup`.
  - Vitest as a dev dep with three targeted unit tests:
    - `src/utils/__tests__/replace-placeholders.test.ts` — placeholder substitution, missing-key fallback, repeated occurrences.
    - `src/utils/__tests__/baseline.test.ts` — `mergeBaselineAddons` drops legacy `viterex` key, preserves user-customised baseline entries, keeps non-baseline extras in original order, idempotent.
    - `src/__tests__/state-migration.test.ts` — `loadState` backfills `layout`/`installMode`/`redaxoLang`/`redaxoTimezone`; legacy `massifSettings` migrates to `templateReplacements`.
  - `pnpm test` script (`vitest run`).
- **GitHub Actions CI** at `.github/workflows/ci.yml`. Triggers on push and PRs to `main`. Pipeline: checkout → pnpm 9 → Node 20 (with pnpm cache) → `pnpm install --frozen-lockfile` → `pnpm build` → `pnpm test` → `bash scripts/test-run.sh`. 10-minute job timeout.

### Changed (2026-04-30)

- `templates/deploy/deploy.php.tpl` — line 31 (formerly the commented-out metanet require) is now `{{DEPLOYER_EXTRAS}}`; the hardcoded `'deployer.task.release.metanet.php',` clear_paths entry is replaced with `{{DEPLOYER_EXTRAS_CLEAR_PATHS}}`. Empty for the default preset; populated when a preset declares `deployerExtras`.
- `presets/massif/preset.json` adopts the new fields: `installerConfig: "redaxo_installer_config.json"` and `deployerExtras: ["deployer.task.release.metanet.php"]`. Both files live alongside the preset.
- `replacePlaceholders` extracted from `src/tasks/scaffold-frontend.ts` into `src/utils/replace-placeholders.ts` so it's importable from tests. Behaviour unchanged.

### Removed (2026-04-30)

- `templates/redaxo/redaxo_installer_config.json` (personal MASSIF API credentials previously installed by default into every fresh project). Now lives in `presets/massif/` and is opt-in via `installerConfig`.
- `templates/deploy/deployer.task.release.metanet.php` (Massif-specific Metanet release task). Now lives in `presets/massif/` and is opt-in via `deployerExtras`.

### Added (2026-04-29)

- **`Install viterex stubs (package.json, vite.config.js, ...)` pipeline task** (`src/tasks/install-viterex-stubs.ts`). Runs `php bin/console viterex:install-stubs --no-interaction` between *Install addons* (step 4) and *Scaffold frontend* (step 6). Triggers `Ynamite\ViteRex\StubsInstaller::run()` so `package.json`, `vite.config.js`, `.env.example`, `biome.jsonc`, `stylelint.config.js`, `.browserslistrc`, `.prettierrc`, `jsconfig.json`, plus `main.js` / `style.css` (under the configured `assets_source_dir`) land in the project root. Without this step, *Install dependencies* (step 8) would fail with `ERR_PNPM_NO_PKG_MANIFEST`. **Requires viterex_addon ≥ 3.2.0** (the `viterex:install-stubs` command was added there). Skip predicate: only runs when `viterex_addon` is in `addons[]` with `activate: true`. Idempotent — `StubsInstaller::run(false)` skips files that already exist.
- Pipeline grew from 14 → 15 steps to accommodate the stubs task.

### Removed (2026-04-29)

- Legacy utility scripts dropped from `templates/scripts/`: `quickstart`, `sync-config`, `sync-db`, `sync-media`. The `templates/scripts/` directory is gone. The corresponding copy block in `src/tasks/scaffold-frontend.ts` (the *5. Utility scripts* section that copied each into the project root with `+x`) has been removed.
- Step 15 no longer detaches a `<pm> run dev` background process. The old behaviour spawned an unkillable child that the user couldn't Ctrl-C from their terminal. Replaced by `src/tasks/show-next-steps.ts`: refreshes browserslist data (so the first manual `<pm> run dev` doesn't warn about stale browser tables) and prints a `Next step — start the Vite dev server: <pm> run dev` message. Filename `start-dev-server.ts` and helper `src/utils/log-file.ts` (only the dev-server log path) deleted; `.viterex-dev-server.log` removed from `init-git.ts` SAFETY_IGNORES.

### Added (2026-04-28)

- **Layout detection + augment mode** (`src/utils/detect.ts`). `detectInstallation(targetDir)` returns `{ mode, layout, present, consolePath }`. Three layouts: `modern`, `classic`, `classic+theme`. Modern is detected via `bin/console + src/path_provider.php`; classic via `redaxo/bin/console + no path_provider`; classic+theme adds `theme/` at root. When detection finds an existing Redaxo, the CLI switches to **augment mode** — skips download / `setup:run` / seed, prompts for which baseline addons to add on top of the existing install. Already-activated addons are pre-disabled in the checklist.
- **`ALWAYS_INCLUDED` baseline** in `src/types.ts`. Six addons installed in a fixed order regardless of preset choice: `structure (+history)`, `phpmailer`, `developer`, `yrewrite`, `ydeploy`, `viterex`. `viterex` is the **last** entry so consumer addons that subscribe to its `VITEREX_INSTALL_STUBS` extension point (chiefly `redaxo-massif`) see it as available when they activate. Presets contribute extras on top of the baseline (deduped by key).
- **`viterex` via `install:download`** — viterex_addon v3.1.0 is now published on the Redaxo installer registry, so it's installed via `php bin/console install:download viterex` like any other addon. No longer a git submodule. The `default` and `massif` presets drop their `viterex_addon` `submoduleAddons` entries; `src/preset.ts` filters legacy `packageKey: "viterex"` entries from old preset JSONs in the wild with a one-line warning.
- **`.tools/` Composer convention** (`src/tasks/configure-composer.ts`). New first-step pipeline task patches the project's `composer.json` to include `"config": { "vendor-dir": ".tools" }` and `"require": { "deployer/deployer": "^7.5" }`. Idempotent: parse-merge-write rather than overwrite. Matches the primobau convention.
- New CLI flags: `--layout <m|c|ct>`, `--fresh` (force fresh-install pipeline despite detection), `--force-push`, `--with-tower`, `--lang <locale>`, `--timezone <tz>`.
- `src/utils/log-file.ts` — opens the `.viterex-dev-server.log` append-mode fd used by `start-dev-server.ts` so subprocess errors are no longer swallowed.

### Changed (2026-04-28)

- **Pipeline reordered to 14 steps** (`src/pipeline.ts`). Configure-composer is now step 1. Submodule add/activate moved to *after* `Install dependencies (composer + pm)` (was previously between `Initialize git repo` and `Git initial commit`, which broke composer autoload). Submodule task split into two: `addSubmoduleAddons` (clone + register) and `activateSubmoduleAddons` (composer install per-submodule + Redaxo `package:install`/`activate`). Augment-mode skip set: steps 2 (Download Redaxo), 3 (Install Redaxo), 6 (Seed database).
- `download-redaxo.ts` — layout-aware. Modern path keeps the existing reorganisation. Classic / classic+theme unzip directly into project root with no file moves. Belt-and-braces idempotency: skip when the layout-specific console binary already exists.
- `install-redaxo.ts` — uses `consolePathFor(layout)` for the `bin/console` path. `--lang` and `--timezone` now sourced from `redaxoLang` / `redaxoTimezone` config fields (default `de_de` / `Europe/Berlin`, override via CLI flags). When `skipDb` is set, the inline DB drop block is skipped and `--db-createdb=no` is passed (the user is responsible for an empty DB at the given credentials). Idempotency: read `<dataDir>/core/config.yml` and skip when `setup: true`.
- `install-addons.ts`, `install-submodule-addons.ts`, `init-git.ts` — all use `consolePathFor(layout)` and `srcAddonsDirFor(layout)` (no more hard-coded `bin/console` / `src/addons/`). `init-git.ts` now skips `git init` when `.git/` exists and skips the initial commit when `HEAD` already exists; safety-ignores include `.tools` and `.viterex-dev-server.log`.
- `scaffold-frontend.ts` — uses `dataDirFor(layout)` and `srcAddonsDirFor(layout)`. The legacy `frontendAssetsRepo` clone-and-rsync block is **removed**: the MASSIF preset's frontend tree now arrives via `redaxo-massif`'s `install.php` (it calls `Ynamite\\ViteRex\\StubsInstaller::installFromDir()` once viterex activates). External preset authors who need that path can fork.
- `create-git-remote.ts` — silent `git push --force` fallback replaced with a hard error unless `--force-push` is set. Push target is the current branch via `git symbolic-ref --short HEAD`, no longer hardcoded to `main`.
- `open-browser.ts` — cross-platform: `start` on win32, `xdg-open` on Linux. Tower invocation gated on `--with-tower` OR `commandExists("gittower")` (added to `utils/exec.ts`).
- `start-dev-server.ts` — subprocess stdio writes to `<projectDir>/.viterex-dev-server.log` (or inherits when `--verbose`). Path printed via `p.log.info` after spawn.
- `state.ts:loadState` — accepts `--config` as the project-dir source (no positional name needed). Migration block backfills `layout` / `installMode` / `redaxoLang` / `redaxoTimezone` for older state files.
- `prompts.ts` — branched on `detection.mode`. Augment mode skips Redaxo / admin / DB prompts and runs the new augment-prompt checklist; fresh mode adds layout / lang / timezone selects. Final `addons` list assembled as `[...ALWAYS_INCLUDED, ...extras-deduped]`.
- `presets/default/preset.json` — emptied to `addons: []`, `submoduleAddons: []` (baseline now hard-coded). Just contributes the seed.
- `presets/massif/preset.json` — drops baseline addons (`structure`, `phpmailer`, `developer`, `yrewrite`, `ydeploy`), drops `viterex_addon` from `submoduleAddons`, drops `frontendAssetsRepo`. Keeps `redaxo_massif`, `massif_settings`, `massif_dnd_sorter` submodules and the 12 `customPrompts`.

### Removed (2026-04-28)

- Legacy `setup/` directory (bash `setup`, `setup.cfg`, `_htaccess`, `redaxo_massif_install.sql`, console / index stubs, deploy stubs). Reference-only since the TS port shipped; now gone.
- `src/tasks/setup-database.ts` — never imported (DB creation is inline in `setup:run --db-createdb=yes`).
- `frontendAssetsRepo` from `ViterexConfig` and `PresetConfig` (no longer used).

### Fixed (2026-04-28)

- `scripts/test-run.sh` — `CLI` path was `src/dist/index.js`; corrected to `dist/index.js`. Smoke-test scenarios updated for the 14-step pipeline + augment mode (7 scenarios: help/version, fresh modern, fresh classic, augment modern, augment classic, --resume + --config, legacy preset filter).

### Pipeline (current, 14 steps)

```
 1  Configure composer (.tools/, deployer)   — both modes
 2  Download Redaxo                          — skip when augment
 3  Install Redaxo                           — skip when augment OR setup_complete
 4  Install addons                           — both modes (idempotent)
 5  Scaffold frontend                        — both modes
 6  Seed database                             — skip when augment OR no seedFile
 7  Install dependencies (composer + pm)      — both modes
 8  Initialize git repo                       — skip if .git/ exists or skipGit
 9  Add submodule addons (preset extras)      — runs AFTER deps
10  Activate submodule addons                 — composer install + package:install/activate
11  Git initial commit                        — skip if HEAD exists or skipGit
12  Create remote git repository              — skip if no provider
13  Open frontend and backend in browser      — both
14  Start Vite dev server                     — both
```

### Earlier work

- Preset system: `src/preset.ts` discovers `presets/*/preset.json`; external
  preset paths also accepted via `--preset <path>`. Ships two built-in
  presets: `default` (essential addon set + `viterex-addon` submodule) and
  `massif` (full MASSIF setup — 30 addons, four submodules including
  `redaxo_massif`, `massif_settings`, `massif_dnd_sorter`, twelve `MASSIF_*`
  custom prompts, and the `frontendAssetsRepo`). MASSIF-specific behaviour
  that used to live in the default flow is now isolated to the `massif`
  preset. (5fb8a37, 921cd90)
- `--resume` flag with `.viterex-state.json` — per-task recovery; state file
  is written after each task and removed on success. (`src/state.ts`)
- `--dry-run` flag — logs each task without executing it. (`src/pipeline.ts`)
- `--verbose` flag — pipes subprocess stdout/stderr to the terminal.
  (`src/utils/exec.ts`)
- `--config <path>` non-interactive mode, with automatic migration of old
  `massifSettings` config into the generic `templateReplacements` map.
- `--preset <name>` flag; external preset JSON paths accepted.
- Generic `{{PLACEHOLDER}}` token replacement in `scaffold-frontend.ts`,
  superseding the hard-coded `MASSIF_*` env vars from the bash setup.
- Interactive dependency upgrade step (`yarn upgrade-interactive`, `npm
  outdated`, `pnpm update --interactive --latest`) with TTY handoff via the
  `interactive` task flag. (9be07f2, `install-deps.ts`)
- Submodule-addon task: `git submodule add` for `viterex-addon` (and any
  additional entries a preset defines). (0488766, `install-submodule-addons.ts`)
- Frontend-assets repo merge: clone `frontendAssetsRepo`, strip `.git`, rsync
  into the project root without overwriting. (392d26f, end of
  `scaffold-frontend.ts`)
- Remote-repo creation for GitHub (`gh`) and GitLab (`glab`). (2ec4f29,
  `create-git-remote.ts`)
- Post-setup: open frontend + backend in the default browser; launch Tower
  on macOS if installed. (2e0742b, `open-browser.ts`)
- Start Vite dev server as the final pipeline step, detached so the CLI
  exits cleanly. (1f13b5a, `start-dev-server.ts`)
- 31-entry `ADDON_CATALOG` in `src/types.ts`, including plugin
  sub-selections (e.g. `ui_tools` → `jquery-minicolors`, `selectize`;
  `structure` → `history`). (cba7ea9)
- Admin email re-used as default for the Redaxo error email prompt.
  (2956e32)
- Rebranded banner in `src/utils/log.ts`. (bfb88c0)
- Basic smoke-test script at `scripts/test-run.sh` (currently broken — see
  Known issues).
- MySQL seed task (`import-sql.ts`) — runs post-scaffold, skipped when no
  `seedFile` is configured.

### Changed

- Full port of the 281-line bash `setup/setup` script to a TypeScript CLI
  with an ordered `Task` pipeline (`src/pipeline.ts`). Each task is
  idempotent and resumable.
- `massifSettings` config block replaced by generic `templateReplacements`
  map. `loadState` auto-migrates old state files written before the rename.
  (`src/state.ts`)
- Redaxo CLI PHP helpers (`bin/console`, `path_provider.php`,
  `index.frontend.php`, `index.backend.php`, `.htaccess`) are now copied in
  `download-redaxo.ts`, *before* `setup:run` runs — the previous order
  caused `setup:run` to fail. (f131e94)
- Config/template files moved to repo root; `dist/` added to `.gitignore`.
  (68a91a6)
- Default Redaxo version bumped to `5.20.2` in the interactive prompts.

### Fixed

- `install-redaxo.ts` now handles a pre-existing database on `--resume`:
  `mysqldump` to `backup_<db>_<ts>.sql`, then `DROP DATABASE`, so
  `setup:run` can re-create it cleanly.
- `create-git-remote.ts` tolerates an existing `origin` remote and an
  existing remote repo. (1749206, 4f0bb78)
- `.gitignore` from the frontend-assets repo is preserved during the rsync
  merge. (372002d)
- `tmp-assets/` cleanup runs in a `finally` block so it's removed even when
  the clone/rsync fails. (c617f5c)
- Dev-server subprocess is detached + unref'd so the parent CLI exits
  cleanly after launching it. (994c0d0)
- Dropped the Redaxo zip checksum check (upstream no longer publishes a
  stable SHA manifest). (1004357)
- Removed `fluid_tw` from the default catalog. (dd388c0)

### Pipeline (current)

```
1  Download Redaxo             (download-redaxo.ts)
2  Install Redaxo              (install-redaxo.ts) — drops + backs up DB if present
3  Install addons              (install-addons.ts)
4  Scaffold frontend           (scaffold-frontend.ts) — {{TOKEN}} replacement
5  Seed database               (import-sql.ts)        — skipped if no seedFile
6  Install dependencies        (install-deps.ts)      — composer + pm + upgrade
7  Initialize git repo         (init-git.ts)
8  Install submodule addons    (install-submodule-addons.ts)
9  Git initial commit          (init-git.ts)
10 Create remote git           (create-git-remote.ts)
11 Open browser                (open-browser.ts)
12 Start Vite dev server       (start-dev-server.ts)
```

### Known issues / not yet tracked elsewhere

See the `## TODO` section in `CLAUDE.md` for the full list. Highlights:

- `src/tasks/setup-database.ts` is dead code — never imported from the
  pipeline; DB creation is done inline by `setup:run --db-createdb=yes`.
- `scripts/test-run.sh` references `src/dist/index.js`; the build output
  lives at `dist/index.js`, so the smoke tests don't actually run.
- `README.md` addon table still lists `plyr`, `markitup`, `redactor`,
  `yform_quick_edit` (all removed) and documents the obsolete
  `massifSettings` config block.
- `--resume` requires the positional project-name argument; it can't infer
  the project dir from `--config`.
- `create-git-remote.ts` silently falls back to `git push --force` on any
  push failure.
- `install-redaxo.ts` ignores `skipDb` and hard-codes `--lang=de_de` /
  `--timezone=Europe/Berlin`.
- `open-browser.ts` has no Windows path and hard-codes the macOS-only
  `gittower` call.
- `start-dev-server.ts` uses `stdio: "ignore"`, hiding any startup errors.

### Migration from bash setup

The legacy `setup/` directory (bash `setup` script, `setup.cfg`,
`resetsetup`, `_htaccess`, `redaxo_massif_install.sql`, deploy stubs) is
kept for reference but is no longer used. Every command in the bash script
has an equivalent task in `src/tasks/`. Template files have moved to
`templates/` with `.tpl` suffixes and `{{PLACEHOLDER}}` tokens.