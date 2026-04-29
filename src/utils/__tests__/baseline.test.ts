import { describe, expect, it } from "vitest";
import { ALWAYS_INCLUDED, type AddonSelection } from "../../types.js";
import { mergeBaselineAddons } from "../baseline.js";

const baselineKeys = ALWAYS_INCLUDED.map((a) => a.key);

describe("mergeBaselineAddons", () => {
  it("drops the legacy viterex key and includes the renamed viterex_addon baseline", () => {
    const input: AddonSelection[] = [
      { key: "viterex", install: true, activate: true },
    ];
    const result = mergeBaselineAddons(input);

    expect(result.some((a) => a.key === "viterex")).toBe(false);
    expect(result.some((a) => a.key === "viterex_addon")).toBe(true);
  });

  it("returns the full baseline in ALWAYS_INCLUDED order when input is empty", () => {
    const result = mergeBaselineAddons([]);
    expect(result.map((a) => a.key)).toEqual(baselineKeys);
  });

  it("preserves user-customised baseline entries (e.g. version pin)", () => {
    const input: AddonSelection[] = [
      {
        key: "viterex_addon",
        install: true,
        activate: true,
        version: "3.2.0",
      },
    ];
    const result = mergeBaselineAddons(input);

    const viterex = result.find((a) => a.key === "viterex_addon");
    expect(viterex?.version).toBe("3.2.0");
  });

  it("keeps non-baseline extras in their original order, after the baseline", () => {
    const input: AddonSelection[] = [
      { key: "url", install: true, activate: true },
      { key: "be_tools", install: true, activate: true },
      { key: "adminer", install: true, activate: true },
    ];
    const result = mergeBaselineAddons(input);

    const extras = result
      .map((a) => a.key)
      .filter((k) => !baselineKeys.includes(k));
    expect(extras).toEqual(["url", "be_tools", "adminer"]);
  });

  it("is idempotent — running on an already-merged list returns the same shape", () => {
    const input: AddonSelection[] = [
      { key: "url", install: true, activate: true },
    ];
    const once = mergeBaselineAddons(input);
    const twice = mergeBaselineAddons(once);

    expect(twice.map((a) => a.key)).toEqual(once.map((a) => a.key));
  });
});
