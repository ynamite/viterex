import * as p from "@clack/prompts";
import type { ViterexConfig } from "./types.js";
import { saveState } from "./state.js";
import { downloadRedaxo } from "./tasks/download-redaxo.js";
import { setupDatabase } from "./tasks/setup-database.js";
import { installRedaxo } from "./tasks/install-redaxo.js";
import { installAddons } from "./tasks/install-addons.js";
import { scaffoldFrontend } from "./tasks/scaffold-frontend.js";
import { installDependencies } from "./tasks/install-deps.js";
import { initGitRepo, gitInitialCommit } from "./tasks/init-git.js";
import { installSubmoduleAddons } from "./tasks/install-submodule-addons.js";
import { createGitRemote } from "./tasks/create-git-remote.js";

export interface Task {
  name: string;
  skip?: (config: ViterexConfig) => boolean;
  run: (config: ViterexConfig) => Promise<void>;
}

/**
 * All installation tasks in order.
 * Each task is idempotent — if it fails, fix the issue and re-run.
 * The `skip` predicate lets tasks be conditionally bypassed.
 */
const tasks: Task[] = [
  {
    name: "Download Redaxo",
    run: downloadRedaxo,
  },
  {
    name: "Create database",
    skip: (c) => c.skipDb,
    run: setupDatabase,
  },
  {
    name: "Install Redaxo",
    run: installRedaxo,
  },
  {
    name: "Install addons",
    skip: (c) => c.skipAddons || c.addons.length === 0,
    run: installAddons,
  },
  {
    name: "Scaffold frontend (Vite, Tailwind, configs)",
    run: scaffoldFrontend,
  },
  {
    name: "Install dependencies (composer + packages)",
    run: installDependencies,
  },
  {
    name: "Initialize git repo",
    skip: (c) => c.skipGit,
    run: initGitRepo,
  },
  {
    name: "Install submodule addons (viterex, massif, massif_settings, massif_dnd_sorter)",
    skip: (c) => c.skipGit,
    run: installSubmoduleAddons,
  },
  {
    name: "Git initial commit",
    skip: (c) => c.skipGit,
    run: gitInitialCommit,
  },
  {
    name: "Create remote git repository",
    skip: (c) => c.skipGit || !c.gitProvider,
    run: createGitRemote,
  },
];

export interface PipelineOptions {
  completedTasks?: string[];
  dryRun?: boolean;
}

export async function runPipeline(
  config: ViterexConfig,
  options: PipelineOptions = {}
): Promise<void> {
  const { completedTasks = [], dryRun = false } = options;
  const total = tasks.length;
  const done = new Set(completedTasks);

  if (dryRun) {
    p.log.info("Dry run — no tasks will be executed\n");
  }

  for (let i = 0; i < total; i++) {
    const task = tasks[i];
    const label = `[${i + 1}/${total}] ${task.name}`;

    if (done.has(task.name)) {
      p.log.info(`Already done: ${task.name}`);
      continue;
    }

    if (task.skip?.(config)) {
      p.log.info(`${dryRun ? "Would skip" : "Skipping"}: ${task.name}`);
      continue;
    }

    if (dryRun) {
      p.log.step(`Would run: ${task.name}`);
      continue;
    }

    const s = p.spinner();
    s.start(label);

    try {
      await task.run(config);
      s.stop(`${label} ✓`);

      // Persist progress after each successful task
      done.add(task.name);
      await saveState(config, [...done]);
    } catch (err) {
      s.stop(`${label} ✗`);
      throw new Error(`Task "${task.name}" failed: ${(err as Error).message}`);
    }
  }
}
