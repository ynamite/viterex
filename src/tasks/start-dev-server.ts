import { spawn } from "node:child_process";
import type { ViterexConfig } from "../types.js";

export async function startDevServer(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager } = config;

  const child = spawn(packageManager, ["run", "dev"], {
    cwd: projectDir,
    stdio: "inherit",
    detached: true,
  });

  child.unref();
}
