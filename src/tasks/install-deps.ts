import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function installDependencies(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager, verbose } = config;

  // Run composer install
  await exec("composer", ["install", "--no-interaction", "--quiet"], {
    cwd: projectDir,
    verbose,
  });

  // Run JS package manager install
  await exec(packageManager, ["install"], {
    cwd: projectDir,
    verbose,
  });

  // Upgrade dependencies (non-interactive equivalent of yarn upgrade-interactive)
  if (packageManager === "yarn") {
    await exec("yarn", ["upgrade", "--latest"], { cwd: projectDir, verbose });
  } else if (packageManager === "npm") {
    await exec("npm", ["update"], { cwd: projectDir, verbose });
  } else if (packageManager === "pnpm") {
    await exec("pnpm", ["update", "--latest"], { cwd: projectDir, verbose });
  }
}
