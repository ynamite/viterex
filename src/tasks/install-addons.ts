import path from "node:path";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function installAddons(config: ViterexConfig): Promise<void> {
  const { projectDir, addons, dbHost, dbUser, dbPassword, dbName, verbose } = config;

  for (const addon of addons) {
    const isPlugin = addon.key.includes("/");

    // Download top-level addons only if not already present on disk
    // (plugins are part of their parent addon, no separate download needed)
    if (!isPlugin && addon.install) {
      const addonDir = path.join(projectDir, "src", "addons", addon.key);
      if (!(await fs.pathExists(addonDir))) {
        await exec(
          "php",
          ["bin/console", "install:download", addon.key, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
      }
    }

    if (addon.install) {
      await exec(
        "php",
        ["bin/console", "package:install", addon.key, "--no-interaction", "--quiet"],
        { cwd: projectDir, verbose }
      );
    }

    if (addon.activate) {
      await exec(
        "php",
        ["bin/console", "package:activate", addon.key, "--no-interaction", "--quiet"],
        { cwd: projectDir, verbose }
      );
    }

    // Install and activate plugins if specified
    if (addon.plugins) {
      for (const plugin of addon.plugins) {
        const pluginKey = `${addon.key}/${plugin}`;
        await exec(
          "php",
          ["bin/console", "package:install", pluginKey, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
        await exec(
          "php",
          ["bin/console", "package:activate", pluginKey, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
      }
    }
  }

  // Post-addon setup: clear cache, remove markitup cache, compile backend styles
  await exec("php", ["bin/console", "cache:clear", "--quiet"], { cwd: projectDir, verbose });
  await fs.remove(path.join(projectDir, "public", "assets", "addon", "markitup", "cache"));
  await exec("php", ["bin/console", "be_style:compile", "--quiet"], { cwd: projectDir, verbose });

  // Import the massif install SQL (base articles, config presets, admin user email, yrewrite domain)
  const sqlFile = path.join(projectDir, "var", "data", "redaxo_massif_install.sql");
  if (await fs.pathExists(sqlFile)) {
    const authArgs = [
      "-h", dbHost,
      "-u", dbUser,
      ...(dbPassword ? [`--password=${dbPassword}`] : []),
      `--database=${dbName}`,
    ];

    await exec("mysql", [...authArgs], {
      cwd: projectDir,
      inputFile: sqlFile,
      verbose,
    });
  }
}
