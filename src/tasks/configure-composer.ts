import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import type { ViterexConfig } from "../types.js";

const DEPLOYER_REQUIREMENT = "^7.5";

/**
 * Idempotently ensure the project's composer.json:
 * - has `config.vendor-dir = ".tools"` so deps go to .tools/ instead of vendor/
 * - has `require.deployer/deployer = "^7.5"` for ydeploy's deployment runner
 *
 * If the project already has a composer.json, this merges into it; otherwise
 * it creates a minimal one. Existing values in unrelated keys are preserved.
 *
 * Warns when an existing composer.json had `vendor-dir` set to something other
 * than ".tools" — files installed at the previous location are not moved.
 */
export async function configureComposer(config: ViterexConfig): Promise<void> {
  const composerPath = path.join(config.projectDir, "composer.json");
  await fs.ensureDir(config.projectDir);

  let manifest: Record<string, unknown> = {};
  if (await fs.pathExists(composerPath)) {
    manifest = await fs.readJSON(composerPath);
  }

  const cfg = ((manifest.config ?? {}) as Record<string, unknown>);
  const previousVendorDir = cfg["vendor-dir"];
  if (previousVendorDir && previousVendorDir !== ".tools") {
    p.log.warn(
      `composer.json has vendor-dir="${previousVendorDir}"; switching to ".tools". ` +
        `Existing dependencies in "${previousVendorDir}/" are not moved automatically — ` +
        `delete that directory and re-run \`composer install\` to converge.`,
    );
  }
  cfg["vendor-dir"] = ".tools";
  manifest.config = cfg;

  const require = ((manifest.require ?? {}) as Record<string, string>);
  if (!require["deployer/deployer"]) {
    require["deployer/deployer"] = DEPLOYER_REQUIREMENT;
  }
  manifest.require = require;

  await fs.writeJSON(composerPath, manifest, { spaces: 2 });
}
