import type { DamageType } from "@/types";

/**
 * Builds the damage simulation prompt for the AI model.
 *
 * This function constructs a detailed prompt that instructs the AI to simulate
 * damage on a product while maintaining its original identity, shape, and perspective.
 *
 * @param damageType - The type of damage to simulate
 * @param customInstruction - Optional additional instructions for the damage
 * @returns The complete prompt string ready to be sent to the AI model
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
  const damageInstruction = `The goal is to simulate damage to the product shown while STRICTLY maintaining the product's original identity, shape, and perspective. 
    The background should remain largely unchanged.
    Apply the following damage effect: ${damageType}.
    ${customInstruction ? `Additional details: ${customInstruction}` : ""}
    
    Ensure the damage looks photorealistic. Do not replace the object.`;

  const basePrompt = `Edit this image. Do not make any changes to the photo, simply move the object freely downwards.
    
    ${damageType ? `${damageInstruction}` : ""}`;

  return basePrompt.trim();
};
