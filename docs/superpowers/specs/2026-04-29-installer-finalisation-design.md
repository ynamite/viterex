# viterex-installer — finalisation (preset extension + Roadmap close-out)

**Date:** 2026-04-29
**Branch:** `v3-installer-refactor`
**Scope:** Decouple personal Massif files from default templates via a preset-extension mechanism, and complete the remaining unchecked Roadmap items in `viterex-installer/CLAUDE.md` (excluding npm publish).

## Context

`viterex-installer` is sub-project #3 of the Viterex refactor. After the prior session, all major architectural work is complete (15-step idempotent pipeline, layout detection, augment mode, baseline addon merge, password-rule recovery). This spec covers the close-out work:

1. **Personal Massif files leaking into defaults.** Two files currently ship in `templates/` and get installed into every fresh project regardless of preset:
   - `templates/redaxo/redaxo_installer_config.json` — contains the user's personal `api_login: "ynamite"` and an API key for the REDAXO Installer.
   - `templates/deploy/deployer.task.release.metanet.php` — Massif-specific Deployer task targeting Metanet hosting.
   These need to move into the Massif preset, with the default install path covering them via a generalised preset-extension mechanism so other preset authors get the same hooks.
2. **Roadmap close-out.** Five unchecked items in the Roadmap are still genuinely unimplemented; the rest were completed in the prior session but the checkboxes weren't ticked.

## Non-goals

- npm publish (`Publish to npm as create-viterex`) — explicitly out of scope per user.
- Any architecture-level refactor of the pipeline, prompt flow, or state-file format.
- Cross-preset migration tooling. Existing presets just need the new fields populated by their author.

## 1. Preset extension for personal files

### 1.1 Type changes (`src/types.ts`)

```ts
export interface PresetConfig {
  // ... existing fields ...
  installerConfig?: string;     // already declared; finally wired in this change
  deployerExtras?: string[];    // NEW — paths to .php files (relative to preset dir)
}

export interface ViterexConfig {
  // ... existing fields ...
  // Preset-derived; populated from PresetConfig in prompts.ts (same pattern
  // as submoduleAddons / templateReplacements / seedFile).
  installerConfig?: string;     // absolute path resolved against preset dir
  deployerExtras?: string[];    // absolute paths resolved against preset dir

  // Prompt-derived (used only when preset.installerConfig is unset)
  installerApiLogin?: string;
  installerApiKey?: string;
}
```

`prompts.ts` resolves the preset paths to absolute paths once (`path.resolve(presetDir, file)`) so downstream tasks don't need access to `presetDir`.

### 1.2 Default-template changes

**`templates/redaxo/redaxo_installer_config.json`** — **deleted**. No default installer config.

**`templates/deploy/deployer.task.release.metanet.php`** — **deleted**.

**`templates/deploy/deploy.php.tpl`**:
- Line 31 (currently `// require __DIR__ . '/deployer.task.release.metanet.php';`) → replaced with `{{DEPLOYER_EXTRAS}}`.
- Inside `add('clear_paths', [...])` (line ~68 currently `'deployer.task.release.metanet.php',`) → that hardcoded line is removed; a `{{DEPLOYER_EXTRAS_CLEAR_PATHS}}` placeholder is inserted in the same position.

When no extras are declared, both placeholders are replaced with empty string and the resulting empty line is collapsed.

### 1.3 Massif preset migration

```
presets/massif/
  preset.json                                    (UPDATED: + installerConfig, + deployerExtras)
  redaxo_installer_config.json                   (NEW: moved from templates/redaxo/)
  deployer.task.release.metanet.php              (NEW: moved from templates/deploy/)
  ... existing files ...
```

`presets/massif/preset.json` gains:
```json
{
  "installerConfig": "redaxo_installer_config.json",
  "deployerExtras": ["deployer.task.release.metanet.php"]
}
```

### 1.4 Prompt UX (`src/prompts.ts`)

In fresh-mode only, after the existing Redaxo-credentials block and only when the loaded preset does **not** declare `installerConfig`:

```ts
if (!presetConfig?.installerConfig) {
  const wants = await p.confirm({
    message: "Configure REDAXO Installer API credentials?",
    initialValue: false,
  });
  if (p.isCancel(wants)) process.exit(0);
  if (wants) {
    const login = await p.text({
      message: "REDAXO Installer username",
      validate: (v) => (v.length === 0 ? "Required" : undefined),
    });
    if (p.isCancel(login)) process.exit(0);
    const key = await p.password({
      message: "REDAXO Installer API key",
      validate: (v) => (v.length === 0 ? "Required" : undefined),
    });
    if (p.isCancel(key)) process.exit(0);
    config.installerApiLogin = login as string;
    config.installerApiKey = key as string;
  }
}
```

Augment mode skips this prompt entirely (consistent with the existing rule that augment doesn't set up Redaxo from scratch).

### 1.5 Scaffold logic (`src/tasks/scaffold-frontend.ts`)

**Installer config** — replace the current unconditional `copyTemplate` block with a three-way decision:

```ts
const installerConfigPath = path.join(dataDir, "addons", "install", "config.json");
if (config.installerConfig) {
  await fs.copy(config.installerConfig, installerConfigPath, { overwrite: false });
} else if (config.installerApiLogin && config.installerApiKey) {
  await fs.writeJSON(installerConfigPath, {
    backups: true,
    api_login: config.installerApiLogin,
    api_key: config.installerApiKey,
  }, { spaces: 2 });
}
// else: no installer config installed
```

`config.installerConfig` is the absolute path resolved by `prompts.ts` from the preset's relative path. No new parameters on `scaffoldFrontend`.

**Deployer extras** — only when `setupDeploy === true`:

```ts
const extras = config.deployerExtras ?? [];

// 1. copy each extra file to project root
for (const absPath of extras) {
  await fs.copy(
    absPath,
    path.join(projectDir, path.basename(absPath)),
    { overwrite: false },
  );
}

// 2. expand placeholders in deploy.php
const requiresBlock = extras
  .map((f) => `require __DIR__ . '/${path.basename(f)}';`)
  .join("\n");
const clearPathsBlock = extras
  .map((f) => `    '${path.basename(f)}',`)
  .join("\n");

const expandedReplacements = {
  ...replacements,
  DEPLOYER_EXTRAS: requiresBlock,
  DEPLOYER_EXTRAS_CLEAR_PATHS: clearPathsBlock,
};

await processTemplate(
  path.join(deployDir, "deploy.php.tpl"),
  path.join(projectDir, "deploy.php"),
  expandedReplacements,
);
```

When `extras` is empty, both blocks are empty strings. After template substitution, run `content.replace(/\n{3,}/g, "\n\n")` on the rendered file to collapse the resulting empty lines. This handles both the `{{DEPLOYER_EXTRAS}}` line at line 31 and the empty entry inside `clear_paths`.

### 1.6 README and CHANGELOG

- `README.md` — document the precedence rule (preset wins over prompt) under a new "Preset extension" section. Add `installerConfig` and `deployerExtras` rows to the Config JSON schema. Note that `installerApiLogin`/`installerApiKey` are also accepted in `--config` JSON for CI/automation. Document that the generated `config.json` contains an API key in plaintext when written.
- `CHANGELOG.md` — under `[Unreleased]` dated 2026-04-29: deleted personal templates; new `installerConfig` + `deployerExtras` preset fields wired through; new prompt for installer credentials; default `deploy.php.tpl` replaces hardcoded metanet line with placeholder.

## 2. Roadmap close-out

### 2.1 `--generate-config` flag

**File:** `src/index.ts`

New commander option: `--generate-config [path]` (path defaults to `viterex.json` in cwd). When set:
1. Refuses to proceed if the target file exists, unless `--force`.
2. Runs the same prompt flow as a normal fresh install (honours all other flags as defaults: `--layout`, `--lang`, `--timezone`, `--pm`, `--preset`).
3. Writes the resulting `ViterexConfig` JSON to the target path (excluding runtime-only fields: `verbose`, `forcePush`, `withTower`).
4. Prints `Wrote viterex.json — re-run with --config viterex.json to install.` and exits 0.
5. Ignores `--config` (otherwise the loaded config short-circuits prompts and the generated file would just be a copy).

### 2.2 `tsup.config.ts`

**File:** `tsup.config.ts` (new, repo root)

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  target: "node18",
});
```

`package.json` `scripts.build` becomes simply `tsup`.

### 2.3 Vitest unit tests

**Files:** `src/utils/__tests__/replace-placeholders.test.ts`, `src/__tests__/state-migration.test.ts`, `src/utils/__tests__/baseline.test.ts`

Add `vitest` as devDep, `pnpm test` script `vitest run`. Three tests, scoped to the highest-value pure functions:
1. **`replacePlaceholders`** (extract to `src/utils/replace-placeholders.ts` from `scaffold-frontend.ts:10-14` so it's importable): basic substitution, missing key returns the literal `{{KEY}}` token, multiple occurrences of the same key.
2. **`loadState` migration** (`src/state.ts`): given a state file written before the layout/installMode/lang/timezone fields existed, loaded config has the four fields backfilled with defaults `modern` / `fresh` / `de_de` / `Europe/Berlin`.
3. **`mergeBaselineAddons`** (`src/utils/baseline.ts`): given an existing addon list with the legacy `viterex` key, the result drops the `viterex` entry, includes the new `viterex_addon` baseline entry, preserves user-customised baseline entries (e.g. version pin), and keeps non-baseline extras in their original order.

### 2.4 GitHub Actions CI

**File:** `.github/workflows/ci.yml` (new)

Trigger on push to any branch and on PRs targeting `main`. Single job:
1. `actions/checkout@v4`
2. `pnpm/action-setup@v3` (pnpm 9)
3. `actions/setup-node@v4` (Node 20, with pnpm cache)
4. `pnpm install --frozen-lockfile`
5. `pnpm build`
6. `pnpm test`
7. `bash scripts/test-run.sh`

`scripts/test-run.sh` is already self-contained (dry-run only, no DB or PHP), so the workflow needs no service containers.

### 2.5 `pnpm run dev` → `pnpm dev` (docs only)

`pnpm run dev` works as `pnpm dev` automatically (pnpm aliases `run`). Sweep `README.md`, `CLAUDE.md`, and any other markdown for `pnpm run dev` → `pnpm dev`. No code change.

## 3. Affected files

### Modified
- `src/types.ts` — `PresetConfig.deployerExtras`; `ViterexConfig.{installerConfig, deployerExtras, installerApiLogin, installerApiKey}`
- `src/prompts.ts` — installer-credential prompt; resolve `presetConfig.installerConfig` and `presetConfig.deployerExtras` to absolute paths and store on `ViterexConfig`
- `src/tasks/scaffold-frontend.ts` — installer-config three-way branch, deployer-extras expansion, post-replace newline collapse
- `src/preset.ts` — no change required
- `src/index.ts` — `--generate-config [path]` and `--force` options
- `src/utils/replace-placeholders.ts` (NEW, extracted from scaffold-frontend)
- `templates/deploy/deploy.php.tpl` — placeholders + collapsed blank line handling
- `presets/massif/preset.json` — new fields
- `package.json` — `tsup` script, vitest devDep, `test` script
- `README.md` — Preset extension section, new flags, JSON schema additions, `pnpm dev`
- `CHANGELOG.md` — `[Unreleased]` 2026-04-29 entry
- `CLAUDE.md` — Roadmap checkboxes ticked (only npm publish remains)
- `scripts/test-run.sh` — additional fixture coverage for `--generate-config` (dry-run check that the flag is recognised and writes a file)

### New
- `tsup.config.ts`
- `.github/workflows/ci.yml`
- `presets/massif/redaxo_installer_config.json` (moved from `templates/redaxo/`)
- `presets/massif/deployer.task.release.metanet.php` (moved from `templates/deploy/`)
- `src/utils/__tests__/replace-placeholders.test.ts`
- `src/__tests__/state-migration.test.ts`
- `src/utils/__tests__/baseline.test.ts`

### Deleted
- `templates/redaxo/redaxo_installer_config.json`
- `templates/deploy/deployer.task.release.metanet.php`

## 4. Risks / open points

- **API key in plaintext JSON.** When `--generate-config` writes the resulting config or the user's preset embeds `installerConfig`, the API key is on disk in plaintext. Not a regression (the current Massif file does the same), but worth a one-line README note that the generated `viterex.json` should not be checked into a public repo.
- **Placeholder collapse robustness.** The `s/\n{3,}/\n\n/g` post-process is a safety net. The simpler approach is to expand `{{DEPLOYER_EXTRAS}}` to the empty string and let `\n{{DEPLOYER_EXTRAS}}\n` become `\n\n`, then collapse. Verified: works for both empty and populated cases.
- **`--generate-config` and `--config` interaction.** If both are passed, `--generate-config` wins and `--config` is ignored with a warning. Prevents the surprising "you generated a copy of your existing config" behaviour.
- **CI test-run.sh runtime.** The seven dry-run scenarios complete in well under a minute on local hardware; GitHub-hosted runners should be similar. If runtime drifts, the workflow gains a 5-minute timeout step.
- **Vitest as a fourth dev tool.** Adds a devDep but no runtime weight. CI gains one extra step. The roadmap explicitly asked for these tests, so keeping the cost localised to dev/CI.
- **Existing preset authors.** Any preset that currently relied on the leaking `templates/redaxo/redaxo_installer_config.json` (unlikely outside Massif) loses access. Documented in CHANGELOG; one-line README migration tip points to `installerConfig`.

## 5. Verification

After implementation:

1. Run `pnpm build && pnpm test` — all three vitest tests pass; build is green.
2. Run `bash scripts/test-run.sh` — all dry-run scenarios pass (now including `--generate-config`).
3. Smoke a fresh modern install with the default preset against `~/Herd/`: confirm no `redaxo_installer_config.json` lands in `var/data/addons/install/`, no `deployer.task.release.metanet.php` in project root.
4. Smoke a fresh install with `--preset massif`: confirm both files are present and `deploy.php` contains the metanet require + clear_paths entry.
5. Run `node dist/index.js --generate-config /tmp/test-cfg.json --layout classic --pm pnpm`: confirm the file is written, contains the user's prompt answers, and `node dist/index.js --config /tmp/test-cfg.json --dry-run` runs cleanly against it.
6. Push the branch — confirm GitHub Actions runs the CI workflow successfully end-to-end.

## 6. Out-of-scope follow-ups

- npm publish workflow (separate task).
- Validating preset.json schema with a JSON schema definition (would catch typos in `installerConfig` / `deployerExtras`; nice-to-have but not blocking).
- Migrating ALL hardcoded Massif preferences out of default templates (this round only covers the two files; future round can audit `composer.json.tpl`, `env.tpl`, etc.).
