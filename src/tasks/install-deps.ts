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

  // Upgrade dependencies — these commands are interactive and need a TTY
  const upgradeCmd: Record<string, string[]> = {
    yarn: ["upgrade-interactive"],
    npm: ["outdated"], // npm has no built-in interactive upgrade
    pnpm: ["update", "--interactive", "--latest"],
  };

  const args = upgradeCmd[packageManager];
  if (args) {
    await exec(packageManager, args, {
      cwd: projectDir,
      stdio: "inherit",
    });
  }
}
