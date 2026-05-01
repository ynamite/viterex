import * as p from "@clack/prompts";
import { exec } from "../utils/exec.js";
import { consolePathFor } from "../utils/detect.js";
import type { ViterexConfig } from "../types.js";

/**
 * Sync filesystem-side templates/modules/actions into the database via the
 * developer addon, then clear the Redaxo cache. Without `developer:sync`,
 * freshly-scaffolded templates aren't picked up until something else triggers
 * a sync (e.g. the user logging into the backend), which leaves the public
 * frontend rendering stale/empty content on first load.
 *
 * `developer:sync` is best-effort: in `--augment` mode the addon may not be
 * installed, in which case we skip silently. `cache:clear` always runs.
 */
export async function clearCache(config: ViterexConfig): Promise<void> {
  const { projectDir, layout, verbose, addons } = config;
  const consolePath = consolePathFor(layout);

  const developerActive = addons.some(
    (a) => a.key === "developer" && a.activate,
  );
  if (developerActive) {
    try {
      await exec(
        "php",
        [consolePath, "developer:sync", "--no-interaction"],
        { cwd: projectDir, verbose },
      );
    } catch (err) {
      p.log.warn(
        `developer:sync failed — continuing with cache:clear. (${(err as Error).message})`,
      );
    }
  }

  await exec(
    "php",
    [consolePath, "cache:clear", "--no-interaction"],
    { cwd: projectDir, verbose },
  );
}
