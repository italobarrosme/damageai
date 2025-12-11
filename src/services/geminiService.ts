import { GoogleGenAI } from "@google/genai";
import type { DamageType, AngleType } from "@/types";
import {
  buildDamagePrompt,
  compressImage,
  imageCache,
} from "@/modules/ai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a damaged version of the provided image.
 *
 * 🔹 Cost Optimization Features:
 * - Image compression before sending (reduces tokens)
 * - Cache system to avoid duplicate requests
 * - Optimized prompts (fewer tokens)
 *
 * @param base64Image The source image in base64 format (data:image/...)
 * @param damageType The selected preset damage type
 * @param customInstruction Optional additional instructions
 * @param angleType Optional camera angle change
 * @param useCache Whether to use cache (default: true)
 * @param compress Whether to compress image before sending (default: true)
 * @returns The generated image as a base64 string
 */
export const generateDamagedProduct = async (
  base64Image: string,
  damageType: DamageType,
  customInstruction: string = "",
  angleType: AngleType | null = null,
  useCache: boolean = true,
  compress: boolean = true,
): Promise<string> => {
  try {
    const angleTypeKey = angleType || "";
    
    // Check cache first to avoid API call
    if (useCache) {
      const cached = imageCache.get(
        base64Image,
        damageType,
        customInstruction,
        angleTypeKey,
      );
      if (cached) {
        return cached;
      }
    }

    // Compress image to reduce size and costs
    let processedImage = base64Image;
    if (compress) {
      try {
        processedImage = await compressImage(processedImage, 1024, 1024, 0.85);
      } catch (error) {
        console.warn("Image compression failed, using original:", error);
        // Continue with original image if compression fails
      }
    }

    // Clean base64 string if it contains metadata prefix
    const base64Data =
      processedImage.split(",")[1] || processedImage;
    const mimeType =
      processedImage.substring(
        processedImage.indexOf(":") + 1,
        processedImage.indexOf(";"),
      ) || "image/jpeg";

    // Build optimized prompt
    const prompt = buildDamagePrompt(damageType, customInstruction, angleType);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
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
        const generatedImage = `data:image/png;base64,${part.inlineData.data}`;

        // Cache the result
        if (useCache) {
          imageCache.set(
            base64Image,
            damageType,
            customInstruction,
            angleTypeKey,
            generatedImage,
            prompt,
          );
        }

        return generatedImage;
      }
    }

    throw new Error(
      "The model did not return an image. It might have refused the request due to safety policies.",
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
