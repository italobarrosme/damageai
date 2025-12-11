import { useState } from "react";
import { UploadControls } from "@/modules/generate-images/components/UploadControls";
import { OutputImageGenerated } from "@/modules/generate-images/components/OutputImageGenerated";
import { generateDamagedProduct } from "@/services/geminiService";
import type { AppState } from "@/types";

export default function GenerateImagesRender() {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    error: null,
    selectedDamage: null,
    selectedAngle: null,
    customPrompt: "",
  });

  const handleImageSelect = (base64: string) => {
    setState((prev) => ({
      ...prev,
      originalImage: base64,
      generatedImage: null,
      error: null,
    }));
  };

  const handleClear = () => {
    setState({
      originalImage: null,
      generatedImage: null,
      isGenerating: false,
      error: null,
      selectedDamage: null,
      selectedAngle: null,
      customPrompt: "",
    });
  };

  const handleGenerate = async (ignoreCache: boolean = false) => {
    if (!state.originalImage) return;

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generateDamagedProduct(
        state.originalImage,
        state.selectedDamage,
        state.customPrompt,
        state.selectedAngle,
        !ignoreCache, // useCache = !ignoreCache
      );
      setState((prev) => ({
        ...prev,
        generatedImage: result,
        isGenerating: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate image. Please try again.";
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));
    }
  };

  const handleRetry = async () => {
    await handleGenerate(true); // ignoreCache = true
  };

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement("a");
      link.href = state.generatedImage;
      link.download = `damaged-product-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Upload & Controls */}
      <UploadControls
        originalImage={state.originalImage}
        selectedDamage={state.selectedDamage}
        selectedAngle={state.selectedAngle}
        customPrompt={state.customPrompt}
        isGenerating={state.isGenerating}
        hasGeneratedImage={!!state.generatedImage}
        onImageSelect={handleImageSelect}
        onClear={handleClear}
        onDamageSelect={(damage) =>
          setState((prev) => ({ ...prev, selectedDamage: damage }))
        }
        onAngleSelect={(angle) =>
          setState((prev) => ({ ...prev, selectedAngle: angle }))
        }
        onCustomPromptChange={(prompt) =>
          setState((prev) => ({ ...prev, customPrompt: prompt }))
        }
        onGenerate={() => handleGenerate(false)}
        onRetry={handleRetry}
      />

      {/* Right Column: Output */}
      <OutputImageGenerated
        generatedImage={state.generatedImage}
        isGenerating={state.isGenerating}
        error={state.error}
        onDownload={handleDownload}
        onErrorDismiss={() => setState((prev) => ({ ...prev, error: null }))}
      />
    </div>
  );
}
