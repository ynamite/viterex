import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import type { ViterexConfig } from "../types.js";

/**
 * Copy a preset's `files/` directory into projectDir, merging folders and
 * overwriting individual files. Pre-existing destination files outside the
 * preset's source tree are left untouched; files that exist on both sides
 * are replaced by the preset version.
 *
 * `presetFilesDir` and `presetLayout` are pre-resolved in prompts.ts (mirroring
 * how `installerConfig` and `deployerExtras` are resolved before the pipeline
 * runs). The pipeline `skip` predicate already short-circuits when no preset
 * files dir is present; the early-return here is a defensive belt-and-braces.
 */
export async function applyPresetFiles(config: ViterexConfig): Promise<void> {
  const { presetFilesDir, presetLayout, projectDir, layout, preset } = config;
  if (!presetFilesDir) return;

  if (presetLayout && presetLayout !== layout) {
    throw new Error(
      `Preset '${preset}' targets layout '${presetLayout}', but '${layout}' was selected. ` +
      `Either choose a matching layout or pick a different preset.`,
    );
  }

  await fs.copy(presetFilesDir, projectDir, { overwrite: true });
  p.log.info(
    `Applied preset files from ${path.relative(process.cwd(), presetFilesDir)}`,
  );
}
