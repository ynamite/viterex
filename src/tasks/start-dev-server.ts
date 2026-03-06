import { spawn } from "node:child_process";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function startDevServer(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager, verbose } = config;

  await exec("npx", ["update-browserslist-db@latest"], { cwd: projectDir, verbose });

  const child = spawn(packageManager, ["run", "dev"], {
    cwd: projectDir,
    stdio: "ignore",
    detached: true,
  });

  child.unref();

  // Give the child process time to fully start before the parent exits
  await new Promise((resolve) => setTimeout(resolve, 2000));
}
