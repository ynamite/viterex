# Changelog

All notable changes to `create-viterex` are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project aims to
follow [Semantic Versioning](https://semver.org/) once it ships its first
release. Nothing has been published to npm yet — everything lives under
`[Unreleased]`.

## [Unreleased]

### Added

- Preset system: `src/preset.ts` discovers `presets/*/preset.json`; external
  preset paths also accepted via `--preset <path>`. Built-in `default` preset
  ships with the essential addon set and a viterex-addon submodule
  (`presets/default/preset.json`, `presets/default/seed.sql.tpl`). (5fb8a37)
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
- `src/index.ts` help text mentions a `massif` preset that doesn't exist in
  `presets/`.
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