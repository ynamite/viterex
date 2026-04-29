import { exec } from "../utils/exec.js";
import { consolePathFor } from "../utils/detect.js";
import type { ViterexConfig } from "../types.js";

/**
 * Trigger viterex_addon's StubsInstaller via its CLI command.
 *
 * Background: viterex_addon ships its scaffolding files (package.json,
 * vite.config.js, .env.example, biome.jsonc, stylelint.config.js,
 * .browserslistrc, .prettierrc, jsconfig.json, plus main.js / style.css under
 * <assets_source_dir>/) inside its own `stubs/` directory. Without this step
 * the project root has no package.json, so the next pipeline step (`composer
 * install` + package-manager install) fails with ERR_PNPM_NO_PKG_MANIFEST.
 *
 * The `viterex:install-stubs` command was added in viterex_addon v3.2.0
 * (lib/Console/InstallStubsCommand.php → registered via package.yml's
 * `console_commands:`). It calls Ynamite\ViteRex\StubsInstaller::run() — the
 * same code path as the Settings-page "Install stubs" button.
 *
 * Idempotent: default mode skips files that already exist.
 *
 * Requires viterex_addon ≥ 3.2.0.
 */
export async function installViterexStubs(config: ViterexConfig): Promise<void> {
  const { projectDir, layout, verbose } = config;
  const consolePath = consolePathFor(layout);

  await exec(
    "php",
    [consolePath, "viterex:install-stubs", "--no-interaction"],
    { cwd: projectDir, verbose },
  );
}
