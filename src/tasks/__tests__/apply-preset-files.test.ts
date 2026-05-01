import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyPresetFiles } from "../apply-preset-files.js";
import type { ViterexConfig } from "../../types.js";

let tmpDir: string;
let projectDir: string;
let presetDir: string;
let presetFilesDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "viterex-apply-preset-test-"));
  projectDir = path.join(tmpDir, "project");
  presetDir = path.join(tmpDir, "preset");
  presetFilesDir = path.join(presetDir, "files");
  await fs.ensureDir(projectDir);
  await fs.ensureDir(presetFilesDir);
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

function makeConfig(overrides: Partial<ViterexConfig> = {}): ViterexConfig {
  return {
    projectDir,
    layout: "modern",
    preset: "test-preset",
    ...overrides,
  } as ViterexConfig;
}

describe("applyPresetFiles", () => {
  it("is a no-op when presetFilesDir is undefined", async () => {
    await applyPresetFiles(makeConfig({ presetFilesDir: undefined }));
    const entries = await fs.readdir(projectDir);
    expect(entries).toEqual([]);
  });

  it("copies files verbatim when presetLayout is unset", async () => {
    await fs.outputFile(path.join(presetFilesDir, ".env.example"), "FOO=bar\n");
    await fs.outputFile(
      path.join(presetFilesDir, "src/assets/img/logo.svg"),
      "<svg/>",
    );

    await applyPresetFiles(makeConfig({ presetFilesDir }));

    expect(await fs.readFile(path.join(projectDir, ".env.example"), "utf-8")).toBe(
      "FOO=bar\n",
    );
    expect(
      await fs.readFile(path.join(projectDir, "src/assets/img/logo.svg"), "utf-8"),
    ).toBe("<svg/>");
  });

  it("copies files when presetLayout matches selected layout", async () => {
    await fs.outputFile(path.join(presetFilesDir, ".env.example"), "FOO=bar\n");

    await applyPresetFiles(
      makeConfig({ presetFilesDir, presetLayout: "modern", layout: "modern" }),
    );

    expect(await fs.readFile(path.join(projectDir, ".env.example"), "utf-8")).toBe(
      "FOO=bar\n",
    );
  });

  it("throws before copying when presetLayout does not match", async () => {
    await fs.outputFile(path.join(presetFilesDir, ".env.example"), "FOO=bar\n");

    await expect(
      applyPresetFiles(
        makeConfig({ presetFilesDir, presetLayout: "classic", layout: "modern" }),
      ),
    ).rejects.toThrow(/targets layout 'classic'.*'modern' was selected/);

    expect(await fs.pathExists(path.join(projectDir, ".env.example"))).toBe(false);
  });

  it("overwrites existing destination files", async () => {
    await fs.outputFile(path.join(presetFilesDir, ".env.example"), "FROM=preset\n");
    await fs.outputFile(path.join(projectDir, ".env.example"), "FROM=user\n");

    await applyPresetFiles(makeConfig({ presetFilesDir }));

    expect(await fs.readFile(path.join(projectDir, ".env.example"), "utf-8")).toBe(
      "FROM=preset\n",
    );
  });

  it("merges folder contents without removing pre-existing siblings", async () => {
    await fs.outputFile(path.join(presetFilesDir, "src/a.txt"), "preset-a\n");
    await fs.outputFile(path.join(projectDir, "src/b.txt"), "user-b\n");

    await applyPresetFiles(makeConfig({ presetFilesDir }));

    expect(await fs.readFile(path.join(projectDir, "src/a.txt"), "utf-8")).toBe("preset-a\n");
    expect(await fs.readFile(path.join(projectDir, "src/b.txt"), "utf-8")).toBe("user-b\n");
  });
});
