import * as p from "@clack/prompts";
import { ALWAYS_INCLUDED, type AddonSelection } from "../types.js";
import type { DetectionResult } from "../utils/detect.js";

/**
 * Augment-mode addon checklist.
 *
 * Shows the ALWAYS_INCLUDED baseline with already-activated entries hinted
 * and pre-disabled. Returns the user's selection (which the caller treats
 * as the final addon list when `installMode === 'augment'`).
 */
export async function promptAugmentAddons(detection: DetectionResult): Promise<AddonSelection[]> {
  const choices = ALWAYS_INCLUDED.map((a) => {
    const installed = detection.present.addons.includes(a.key);
    const pluginsLabel = a.plugins?.length ? ` + ${a.plugins.join(", ")}` : "";
    return {
      value: a.key,
      label: `${a.key}${pluginsLabel}`,
      hint: installed ? "(already activated)" : undefined,
      disabled: installed,
    };
  });

  const enabled = choices.filter((c) => !c.disabled).map((c) => c.value);

  if (enabled.length === 0) {
    p.log.info("All baseline addons are already activated — nothing to add.");
    return [];
  }

  const selected = await p.multiselect({
    message:
      "Augment mode: which baseline addons should I install on top of the existing Redaxo?",
    options: choices,
    initialValues: enabled,
    required: false,
  });

  if (p.isCancel(selected)) process.exit(0);

  const selectedKeys = new Set(selected as string[]);
  return ALWAYS_INCLUDED.filter((a) => selectedKeys.has(a.key));
}
