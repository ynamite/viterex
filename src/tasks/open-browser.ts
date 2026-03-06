import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function openBrowser(config: ViterexConfig): Promise<void> {
  const { redaxoServerName, verbose } = config;
  const frontendUrl = `http://${redaxoServerName}/`;
  const backendUrl = `http://${redaxoServerName}/redaxo/`;

  // macOS: open, Linux: xdg-open
  const openCmd = process.platform === "darwin" ? "open" : "xdg-open";

  await exec(openCmd, [frontendUrl], { verbose });
  await exec(openCmd, [backendUrl], { verbose });

  // Open Tower git client (macOS only, ignore if not installed)
  if (process.platform === "darwin") {
    try {
      await exec("gittower", ["."], { cwd: config.projectDir, verbose });
    } catch {
      // Tower not installed — skip silently
    }
  }
}
