import { ALWAYS_INCLUDED, type AddonSelection } from "../types.js";

/**
 * Addon keys that have been renamed and should be dropped from older
 * state files / configs. Their replacement is in `ALWAYS_INCLUDED`, so the
 * baseline merge re-introduces the correct entry automatically.
 */
const RENAMED_KEYS: Record<string, string> = {
  // The redaxo.org installer registry calls it `viterex_addon`; older state
  // files written before the rename carry the bare `viterex` key, which
  // doesn't exist on redaxo.org and breaks `install:download`.
  viterex: "viterex_addon",
};

/**
 * Merge `ALWAYS_INCLUDED` into an existing addons list so the baseline is
 * enforced regardless of how the config was loaded (interactive prompts,
 * `--config`, or `--resume` from an older state file).
 *
 * - Baseline addons appear first, in `ALWAYS_INCLUDED` order.
 * - If the user already has an entry for a baseline key, the user's entry is
 *   preserved (so custom `plugins` / `version` survive).
 * - Entries with a renamed key (see `RENAMED_KEYS`) are dropped — the
 *   baseline already provides the new key.
 * - Non-baseline entries (preset / interactive extras) keep their original
 *   relative order.
 *
 * Idempotent: running this on an already-merged list returns an equivalent
 * list.
 */
export function mergeBaselineAddons(existing: AddonSelection[]): AddonSelection[] {
  const userByKey = new Map(existing.map((a) => [a.key, a]));
  const baseline = ALWAYS_INCLUDED.map((b) => userByKey.get(b.key) ?? b);
  const extras = existing.filter(
    (a) =>
      !ALWAYS_INCLUDED.some((b) => b.key === a.key) && !(a.key in RENAMED_KEYS),
  );
  return [...baseline, ...extras];
}
