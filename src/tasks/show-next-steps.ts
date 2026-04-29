import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

/**
 * Final pipeline step. Refreshes browserslist data (so Vite / Tailwind /
 * autoprefixer use the latest browser-support tables on the very first
 * `<pm> run dev`) and prints a message telling the user how to start the
 * dev server themselves.
 *
 * We intentionally do NOT spawn `<pm> run dev` from the installer: a
 * detached child running in the background can't be Ctrl-C'd from the
 * terminal that started it, which traps users.
 */
export async function showNextSteps(config: ViterexConfig): Promise<void> {
  const { projectDir, packageManager, verbose } = config;

  await exec("npx", ["update-browserslist-db@latest"], { cwd: projectDir, verbose });

  const cdLine =
    path.resolve(projectDir) !== path.resolve(process.cwd())
      ? `  cd ${projectDir}\n`
      : "";

  p.log.success(
    `Next step — start the Vite dev server:\n\n${cdLine}  ${chalk.bold.magentaBright(`${packageManager} run dev`)}\n`,
  );
}
