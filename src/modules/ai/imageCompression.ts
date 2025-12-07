/**
 * Image compression utilities to reduce API costs.
 *
 * 🔹 Cost Impact:
 * - Smaller images = fewer tokens processed
 * - Reduces bandwidth and processing time
 * - Can reduce costs by 30-70% depending on original size
 */

/**
 * Compresses a base64 image to reduce file size before sending to API.
 *
 * ⚠️ Browser-only: Requires Image and Canvas APIs (client-side only)
 *
 * @param base64Image - The original image in base64 format
 * @param maxWidth - Maximum width in pixels (default: 1024)
 * @param maxHeight - Maximum height in pixels (default: 1024)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @returns Compressed base64 image string
 *
 * @example
 * ```ts
 * const compressed = await compressImage(originalImage, 1024, 1024, 0.85);
 * ```
 */
export const compressImage = async (
  base64Image: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.85,
): Promise<string> => {
  // Check if running in browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error(
      "Image compression requires browser environment (Image and Canvas APIs)",
    );
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG for better compression
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64Image;
  });
};

/**
 * Estimates the size reduction percentage after compression.
 *
 * @param originalSize - Original image size in bytes
 * @param compressedSize - Compressed image size in bytes
 * @returns Percentage reduction (0-100)
 */
export const calculateSizeReduction = (
  originalSize: number,
  compressedSize: number,
): number => {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};
