import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function installSubmoduleAddons(config: ViterexConfig): Promise<void> {
  const { projectDir, verbose, submoduleAddons } = config;
  if (!submoduleAddons?.length) return;

  // Add each addon as a git submodule
  for (const addon of submoduleAddons) {
    await exec(
      "git",
      ["submodule", "add", addon.url, addon.path],
      { cwd: projectDir, verbose }
    );
  }

  // Initialize and fetch all submodule contents
  await exec(
    "git",
    ["submodule", "update", "--init", "--recursive"],
    { cwd: projectDir, verbose }
  );

  // Install composer deps and activate each submodule addon via Redaxo CLI
  for (const addon of submoduleAddons) {
    if (addon.hasComposerDeps) {
      await exec(
        "composer",
        ["install", `--working-dir=${addon.path}`, "--optimize-autoloader", "--no-interaction", "--quiet"],
        { cwd: projectDir, verbose }
      );
    }
    await exec(
      "php",
      ["bin/console", "package:install", addon.packageKey, "--no-interaction", "--quiet"],
      { cwd: projectDir, verbose }
    );
    await exec(
      "php",
      ["bin/console", "package:activate", addon.packageKey, "--no-interaction", "--quiet"],
      { cwd: projectDir, verbose }
    );
  }
}
