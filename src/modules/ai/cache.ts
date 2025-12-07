/**
 * Simple in-memory cache for AI-generated images to reduce API costs.
 *
 * 🔹 Cost Impact:
 * - Avoids duplicate API calls for same inputs
 * - Can reduce costs by 20-50% for repeated requests
 * - Reduces latency for cached results
 */

interface CacheEntry {
  image: string;
  timestamp: number;
  prompt: string;
}

interface CacheKey {
  imageHash: string;
  damageType: string;
  customInstruction: string;
}

class ImageCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generates a simple hash from image data for cache key.
   * In production, consider using a proper hash function (e.g., SHA-256).
   */
  private generateImageHash(base64Image: string): string {
    // Simple hash: use first 100 chars + last 100 chars + length
    // For production, use a proper hash library like crypto-js
    const start = base64Image.substring(0, 100);
    const end = base64Image.substring(Math.max(0, base64Image.length - 100));
    const length = base64Image.length.toString();
    return `${start}${end}${length}`.replace(/[^a-zA-Z0-9]/g, "");
  }

  /**
   * Creates a cache key from the request parameters.
   */
  private createCacheKey(key: CacheKey): string {
    return `${key.imageHash}_${key.damageType}_${key.customInstruction}`;
  }

  /**
   * Checks if a cached result exists and is still valid.
   *
   * @param base64Image - Original image
   * @param damageType - Type of damage
   * @param customInstruction - Custom instruction
   * @returns Cached image if found and valid, null otherwise
   */
  get(
    base64Image: string,
    damageType: string,
    customInstruction: string = "",
  ): string | null {
    const imageHash = this.generateImageHash(base64Image);
    const cacheKey = this.createCacheKey({
      imageHash,
      damageType,
      customInstruction,
    });

    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Check if entry is still valid (not expired)
    const now = Date.now();
    if (now - entry.timestamp > this.TTL_MS) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.image;
  }

  /**
   * Stores a generated image in the cache.
   *
   * @param base64Image - Original image
   * @param damageType - Type of damage
   * @param customInstruction - Custom instruction
   * @param generatedImage - Generated image to cache
   * @param prompt - Prompt used for generation
   */
  set(
    base64Image: string,
    damageType: string,
    customInstruction: string,
    generatedImage: string,
    prompt: string,
  ): void {
    const imageHash = this.generateImageHash(base64Image);
    const cacheKey = this.createCacheKey({
      imageHash,
      damageType,
      customInstruction,
    });

    this.cache.set(cacheKey, {
      image: generatedImage,
      timestamp: Date.now(),
      prompt,
    });
  }

  /**
   * Clears expired entries from the cache.
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL_MS) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets the current cache size.
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const imageCache = new ImageCache();

// Clean expired entries every hour
if (typeof window !== "undefined") {
  setInterval(() => {
    imageCache.clearExpired();
  }, 60 * 60 * 1000);
}

