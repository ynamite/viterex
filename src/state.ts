import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import type { ViterexConfig } from "./types.js";

const STATE_FILE = ".viterex-state.json";

interface StateData {
  config: ViterexConfig;
  completedTasks: string[];
}

/**
 * Resolve the state file path. When resuming, we need to find the project dir
 * from the state file itself — so we check the provided project name argument
 * or scan the current directory.
 */
function resolveStatePath(projectDir: string): string {
  return path.join(projectDir, STATE_FILE);
}

/**
 * Load state for --resume. Finds the state file in the project directory,
 * reads back the saved config and list of completed task names.
 */
export async function loadState(
  projectNameArg: string | undefined,
  options: Record<string, unknown>
): Promise<StateData> {
  // The project dir must be determined from the argument or config
  const projectName = projectNameArg as string | undefined;
  if (!projectName) {
    throw new Error(
      "--resume requires a project name argument so we can find .viterex-state.json"
    );
  }

  const projectDir = path.resolve(process.cwd(), projectName);
  const statePath = resolveStatePath(projectDir);

  if (!(await fs.pathExists(statePath))) {
    throw new Error(
      `No state file found at ${statePath}. Cannot resume — run without --resume to start fresh.`
    );
  }

  const data: StateData = await fs.readJSON(statePath);

  // Apply any CLI overrides on top of saved config
  if (options.skipDb) data.config.skipDb = true;
  if (options.skipAddons) data.config.skipAddons = true;
  if (options.skipGit) data.config.skipGit = true;

  p.log.info(
    `Resuming from state file — ${data.completedTasks.length} task(s) already completed`
  );

  return data;
}

/**
 * Save state after a task completes. Writes the full config and the list of
 * completed task names so the run can be resumed.
 */
export async function saveState(
  config: ViterexConfig,
  completedTasks: string[]
): Promise<void> {
  const statePath = resolveStatePath(config.projectDir);
  await fs.ensureDir(path.dirname(statePath));

  const data: StateData = { config, completedTasks };
  await fs.writeJSON(statePath, data, { spaces: 2 });
}

/**
 * Delete the state file. Called on fresh runs (to clear stale state)
 * and after successful completion.
 */
export async function clearState(projectDir: string): Promise<void> {
  const statePath = resolveStatePath(projectDir);
  await fs.remove(statePath);
}
