import * as p from "@clack/prompts";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function buildFrontend(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager, verbose } = config;
  try {
    await exec(packageManager, ["run", "build"], { cwd: projectDir, verbose });
  } catch (err) {
    p.log.warn(
      `Frontend build failed — continuing. Run \`${packageManager} run build\` manually after install. (${(err as Error).message})`,
    );
  }
}
