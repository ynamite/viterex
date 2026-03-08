import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import type { PresetConfig } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presetsDir = path.resolve(__dirname, "../presets");

/**
 * Scan the built-in presets/ directory for folders containing preset.json.
 * Always appends "custom" as a virtual option.
 */
export async function discoverPresets(): Promise<string[]> {
  const presets: string[] = [];

  if (await fs.pathExists(presetsDir)) {
    const entries = await fs.readdir(presetsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const configPath = path.join(presetsDir, entry.name, "preset.json");
        if (await fs.pathExists(configPath)) {
          presets.push(entry.name);
        }
      }
    }
  }

  presets.push("custom");
  return presets;
}

/**
 * Load a preset by ID.
 * - "custom" returns null (user configures everything manually)
 * - If presetId contains "/" or ends with ".json", treat as external file path
 * - Otherwise look up in built-in presets/ directory
 */
export async function loadPreset(
  presetId: string
): Promise<{ config: PresetConfig; dir: string } | null> {
  if (presetId === "custom") return null;

  let configPath: string;
  let dir: string;

  if (presetId.includes("/") || presetId.endsWith(".json")) {
    // External preset path
    configPath = path.resolve(presetId);
    dir = path.dirname(configPath);
  } else {
    // Built-in preset
    dir = path.join(presetsDir, presetId);
    configPath = path.join(dir, "preset.json");
  }

  if (!(await fs.pathExists(configPath))) {
    throw new Error(`Preset not found: ${configPath}`);
  }

  const config: PresetConfig = await fs.readJSON(configPath);
  return { config, dir };
}

/**
 * Resolve a seed file path relative to a preset directory.
 */
export function resolveSeedFile(seedFile: string, presetDir: string): string {
  return path.resolve(presetDir, seedFile);
}
