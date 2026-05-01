import { exec } from "../utils/exec.js";
import { consolePathFor } from "../utils/detect.js";
import type { ViterexConfig } from "../types.js";

/**
 * Clear Redaxo cache so the just-opened browser doesn't show stale templates,
 * modules, or asset paths left behind by earlier setup phases (setup:run,
 * addon install, viterex:install-stubs, submodule activation).
 *
 * Idempotent — `cache:clear` is safe to run any number of times.
 */
export async function clearCache(config: ViterexConfig): Promise<void> {
  const { projectDir, layout, verbose } = config;
  const consolePath = consolePathFor(layout);

  await exec(
    "php",
    [consolePath, "cache:clear", "--no-interaction"],
    { cwd: projectDir, verbose },
  );
}
