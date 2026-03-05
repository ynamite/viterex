import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function startDevServer(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager } = config;

  // Start the Vite dev server — always show output since this is the final
  // interactive step and the user needs to see the dev server URL.
  await exec(packageManager, ["run", "dev"], {
    cwd: projectDir,
    verbose: true,
  });
}
