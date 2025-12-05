import { Download, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/modules/generate-images/components/Button";
import { LoadingSpinner } from "@/modules/common/Loading";

interface OutputImageGeneratedProps {
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  onDownload: () => void;
  onErrorDismiss: () => void;
}

export function OutputImageGenerated({
  generatedImage,
  isGenerating,
  error,
  onDownload,
  onErrorDismiss,
}: OutputImageGeneratedProps) {
  if (error) {
    return (
      <div className="h-full">
        <div className="h-full min-h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/50">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 p-8 text-center">
            <AlertTriangle className="text-red-500 mb-4" size={48} />
            <p className="text-red-400 font-medium mb-4 text-sm text-center p-4 max-w-sm">
              {error}
            </p>
            <Button variant="secondary" onClick={onErrorDismiss}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="h-full">
        <div className="h-full min-h-[500px] max-h-2/3 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/50">
          <div className="relative w-full h-full p-1">
            <img
              src={generatedImage}
              alt="Damaged Product"
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={onDownload}
                variant="primary"
                icon={<Download size={18} />}
              >
                Download
              </Button>
            </div>
            <div className="absolute bottom-1 left-1 right-1 p-3 bg-red-950/70 backdrop-blur-md border-t border-red-900/50 rounded-b-xl">
              <p className="text-xs text-center font-mono text-red-200">
                DAMAGED OUTPUT
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="h-full min-h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center text-slate-500 p-8 text-center">
          {isGenerating ? (
            <div className="space-y-4">
              <LoadingSpinner />
              <p className="animate-pulse text-indigo-400 font-medium">
                Processing pixels...
              </p>
              <p className="text-xs text-slate-600">
                Maintaining product geometry
              </p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="text-slate-600" size={32} />
              </div>
              <p className="font-medium text-lg text-slate-400">
                Ready to Generate
              </p>
              <p className="text-sm text-slate-600 mt-2 max-w-xs">
                Upload an image and configure damage settings to see the
                results here.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
