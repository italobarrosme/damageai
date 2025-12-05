import { GoogleGenAI } from "@google/genai";
import type { DamageType } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a damaged version of the provided image.
 * 
 * @param base64Image The source image in base64 format (data:image/...)
 * @param damageType The selected preset damage type
 * @param customInstruction Optional additional instructions
 * @returns The generated image as a base64 string
 */
export const generateDamagedProduct = async (
  base64Image: string,
  damageType: DamageType,
  customInstruction: string = ""
): Promise<string> => {
  try {
    // Clean base64 string if it contains metadata prefix
    const base64Data = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';')) || 'image/jpeg';

    const promptDamage = `The goal is to simulate damage to the product shown while STRICTLY maintaining the product's original identity, shape, and perspective. 
      The background should remain largely unchanged.
      Apply the following damage effect: ${damageType}.
      ${customInstruction ? `Additional details: ${customInstruction}` : ''}
      
      Ensure the damage looks photorealistic. Do not replace the object.`

    const prompt = `
      Edit this image. Do not make any changes to the photo, simply move the object freely downwards.
      
      ${damageType ? `${promptDamage}` : ''}
    `;



    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts) {
      throw new Error("No content generated from Gemini.");
    }

    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image. It might have refused the request due to safety policies.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};