import type { DamageType } from "@/types";
import { AngleType } from "@/types";

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
 * @param angleType - Optional camera angle or position change
 * @returns The optimized prompt string ready to be sent to the AI model
 *
 * @example
 * ```ts
 * const prompt = buildDamagePrompt(
 *   DamageType.BROKEN_SEAL,
 *   "Make it look like it was tampered with",
 *   AngleType.SIDE
 * );
 * ```
 */
export const buildDamagePrompt = (
  damageType: DamageType,
  customInstruction: string = "",
  angleType: AngleType | null = null,
): string => {
  // Optimized: Removed redundant base prompt, combined instructions
  const instructions = [
    "Maintain product identity, shape, and all visual details",
    angleType && angleType !== AngleType.ORIGINAL
      ? `Change camera angle or object position to ${angleType.toLowerCase()}, preserving all product details, damage characteristics, textures, and materials exactly as they appear`
      : "Maintain original camera perspective",
    `Simulate ${damageType} damage`,
    "Make damage photorealistic",
    customInstruction?.trim() || "",
  ]
    .filter((instruction) => instruction.length > 0)
    .join(". ");

  return `${instructions}.`;
};
