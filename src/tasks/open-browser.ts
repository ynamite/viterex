import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function openBrowser(config: ViterexConfig): Promise<void> {
  const { redaxoServerName, withTower, verbose } = config;
  const frontendUrl = `http://${redaxoServerName}/`;
  const backendUrl = `http://${redaxoServerName}/redaxo/`;

  const openCmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";

  const execOpts = { verbose, shell: process.platform === "win32" };

  await exec(openCmd, [frontendUrl], execOpts);
  await exec(openCmd, [backendUrl], execOpts);

  // Tower: only when the user explicitly opted in (prompt, --with-tower, or preset).
  if (process.platform === "darwin" && withTower) {
    try {
      await exec("gittower", ["."], { cwd: config.projectDir, verbose });
    } catch {
      // Tower may not be installed — skip silently
    }
  }
}
