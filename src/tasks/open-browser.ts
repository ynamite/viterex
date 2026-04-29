import { commandExists, exec } from "../utils/exec.js";
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

  // Tower: only on macOS, and only when explicitly requested OR available on PATH
  if (process.platform === "darwin" && (withTower || (await commandExists("gittower")))) {
    try {
      await exec("gittower", ["."], { cwd: config.projectDir, verbose });
    } catch {
      // Tower may not be installed — skip silently
    }
  }
}
