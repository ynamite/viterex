import path from "node:path";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

/**
 * Minimum ignores to prevent heavy directories from being committed
 * even if the full .gitignore hasn't been written yet.
 */
const SAFETY_IGNORES = ["node_modules", "vendor", "/var/cache/*", "/var/log/*"];

export async function initGitRepo(config: ViterexConfig): Promise<void> {
  const { projectDir, verbose } = config;

  await exec("git", ["init"], { cwd: projectDir, verbose });

  // Ensure critical ignores exist before any `git add`
  const gitignorePath = path.join(projectDir, ".gitignore");
  if (await fs.pathExists(gitignorePath)) {
    const existing = await fs.readFile(gitignorePath, "utf-8");
    const missing = SAFETY_IGNORES.filter((entry) => !existing.includes(entry));
    if (missing.length > 0) {
      await fs.appendFile(gitignorePath, "\n" + missing.join("\n") + "\n");
    }
  } else {
    await fs.writeFile(gitignorePath, SAFETY_IGNORES.join("\n") + "\n");
  }
}

export async function gitInitialCommit(config: ViterexConfig): Promise<void> {
  const { projectDir, verbose } = config;

  await exec("git", ["add", "."], { cwd: projectDir, verbose });

  // Ensure executable scripts are tracked with +x in git
  await exec("git", ["update-index", "--chmod=+x", "bin/console"], { cwd: projectDir, verbose });

  await exec("git", ["commit", "-m", "initial commit"], { cwd: projectDir, verbose });
}
