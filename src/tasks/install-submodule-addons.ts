import path from "node:path";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

/**
 * Private addons installed as git submodules.
 * Each entry: [git SSH URL, target path relative to project root]
 */
const SUBMODULE_ADDONS = [
  ["git@github.com:ynamite/viterex-addon.git", "src/addons/viterex"],
  ["git@github.com:ynamite/redaxo_massif.git", "src/addons/massif"],
  ["git@github.com:ynamite/massif_settings.git", "src/addons/massif_settings"],
  ["git@github.com:ynamite/massif_dnd_sorter.git", "src/addons/massif_dnd_sorter"],
] as const;

/**
 * Package keys to install + activate after submodules are cloned.
 */
const SUBMODULE_PACKAGES = ["viterex", "massif", "massif_settings", "massif_dnd_sorter"];

export async function installSubmoduleAddons(config: ViterexConfig): Promise<void> {
  const { projectDir, verbose } = config;

  // Add each addon as a git submodule
  for (const [url, targetPath] of SUBMODULE_ADDONS) {
    await exec(
      "git",
      ["submodule", "add", url, targetPath],
      { cwd: projectDir, verbose }
    );
  }

  // Initialize and fetch all submodule contents
  await exec(
    "git",
    ["submodule", "update", "--init", "--recursive"],
    { cwd: projectDir, verbose }
  );

  // The viterex addon has its own composer dependencies
  await exec(
    "composer",
    ["install", "--working-dir=src/addons/viterex", "--optimize-autoloader", "--no-interaction", "--quiet"],
    { cwd: projectDir, verbose }
  );

  // Install and activate each submodule addon via Redaxo CLI
  for (const pkg of SUBMODULE_PACKAGES) {
    await exec(
      "php",
      ["bin/console", "package:install", pkg, "--no-interaction", "--quiet"],
      { cwd: projectDir, verbose }
    );
    await exec(
      "php",
      ["bin/console", "package:activate", pkg, "--no-interaction", "--quiet"],
      { cwd: projectDir, verbose }
    );
  }
}
