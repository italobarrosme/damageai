import type { DamageType } from "@/types";

/**
 * Builds an optimized damage simulation prompt for the AI model.
 *
 * This function constructs a concise prompt that instructs the AI to simulate
 * damage on a product while maintaining its original identity, shape, and perspective.
 *
 * 🔹 Cost Optimization Techniques Applied:
 * - Removed redundant instructions
 * - Used concise, direct language
 * - Eliminated unnecessary whitespace
 * - Combined related instructions
 *
 * @param damageType - The type of damage to simulate
 * @param customInstruction - Optional additional instructions for the damage
 * @returns The optimized prompt string ready to be sent to the AI model
 *
 * @example
 * ```ts
 * const prompt = buildDamagePrompt(
 *   DamageType.BROKEN_SEAL,
 *   "Make it look like it was tampered with"
 * );
 * ```
 */
export const buildDamagePrompt = (
  damageType: DamageType,
  customInstruction: string = "",
): string => {
  // Optimized: Removed redundant base prompt, combined instructions
  const instructions = [
    `Simulate ${damageType} damage`,
    "Maintain product identity, shape, perspective, and background",
    "Make damage photorealistic",
    customInstruction?.trim() || "",
  ]
    .filter((instruction) => instruction.length > 0)
    .join(". ");

  return `${instructions}.`;
};
