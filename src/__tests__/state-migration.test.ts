import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadState } from "../state.js";

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "viterex-state-test-"));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe("loadState — older state-file migration", () => {
  it("backfills layout / installMode / redaxoLang / redaxoTimezone when absent", async () => {
    const stateFile = path.join(tmpDir, ".viterex-state.json");
    // An old state file that pre-dates the v3 layout-detection / lang fields.
    await fs.writeJSON(stateFile, {
      config: {
        projectName: "legacy",
        projectDir: tmpDir,
        redaxoVersion: "5.20.2",
        redaxoAdminUser: "admin",
        redaxoAdminPassword: "x",
        redaxoAdminEmail: "a@b.test",
        redaxoErrorEmail: "e@b.test",
        redaxoServerName: "legacy.test",
        skipDb: true,
        dbHost: "127.0.0.1",
        dbPort: 3306,
        dbName: "legacy",
        dbUser: "root",
        dbPassword: "",
        skipAddons: false,
        addons: [],
        packageManager: "yarn",
        preset: "custom",
        templateReplacements: {},
        setupDeploy: false,
        skipGit: true,
        gitProvider: "",
        gitNamespace: "",
        gitRepoName: "",
        verbose: false,
      },
      completedTasks: [],
    });

    const result = await loadState(tmpDir, {});

    expect(result.config.layout).toBe("modern");
    expect(result.config.installMode).toBe("fresh");
    expect(result.config.redaxoLang).toBe("de_de");
    expect(result.config.redaxoTimezone).toBe("Europe/Berlin");
  });

  it("migrates legacy massifSettings into templateReplacements", async () => {
    const stateFile = path.join(tmpDir, ".viterex-state.json");
    await fs.writeJSON(stateFile, {
      config: {
        projectDir: tmpDir,
        massifSettings: {
          firma: "ACME",
          email: "info@acme.test",
        },
        addons: [],
      },
      completedTasks: [],
    });

    const result = await loadState(tmpDir, {});

    expect(
      (result.config as unknown as Record<string, unknown>).massifSettings,
    ).toBeUndefined();
    expect(result.config.templateReplacements.MASSIF_FIRMA).toBe("ACME");
    expect(result.config.templateReplacements.MASSIF_EMAIL).toBe(
      "info@acme.test",
    );
  });
});
