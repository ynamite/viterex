import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function initGit(config: ViterexConfig): Promise<void> {
  const { projectDir, verbose } = config;

  await exec("git", ["init"], { cwd: projectDir, verbose });
  await exec("git", ["add", "."], { cwd: projectDir, verbose });
  await exec("git", ["commit", "-m", "initial commit"], { cwd: projectDir, verbose });
}
