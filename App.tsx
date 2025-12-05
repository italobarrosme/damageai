import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateDamagedProduct } from './services/geminiService';
import { AppState, DamageType } from './types';
import { Zap, Download, AlertTriangle, RefreshCw, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    error: null,
    selectedDamage: DamageType.GENERAL,
    customPrompt: '',
  });

  const handleImageSelect = (base64: string) => {
    setState(prev => ({ 
      ...prev, 
      originalImage: base64, 
      generatedImage: null, 
      error: null 
    }));
  };

  const handleClear = () => {
    setState({
      originalImage: null,
      generatedImage: null,
      isGenerating: false,
      error: null,
      selectedDamage: DamageType.GENERAL,
      customPrompt: '',
    });
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generateDamagedProduct(
        state.originalImage,
        state.selectedDamage,
        state.customPrompt
      );
      setState(prev => ({ ...prev, generatedImage: result, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || "Failed to generate image. Please try again." 
      }));
    }
  };

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `damaged-product-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              DamageAI
            </h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            Product Fidelity Simulator
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simulate realistic wear & tear
          </h2>
          <p className="text-slate-400 text-lg">
            Upload a pristine product image. Our AI will generate a damaged version while preserving the product's identity and geometry.
          </p>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload & Controls */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-800 shadow-2xl shadow-black/50">
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                currentImage={state.originalImage}
                onClear={handleClear}
              />
            </div>

            <div className={`bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6 transition-opacity duration-300 ${!state.originalImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type of Damage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DamageType).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setState(prev => ({ ...prev, selectedDamage: value }))}
                      className={`
                        text-left text-xs sm:text-sm px-3 py-2 rounded-lg border transition-all duration-200
                        ${state.selectedDamage === value 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                        }
                      `}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Specific Details (Optional)
                </label>
                <textarea
                  value={state.customPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="e.g., The screen is shattered in the top right corner..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-600 resize-none h-24"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                isLoading={state.isGenerating}
                className="w-full py-4 text-lg shadow-indigo-500/20"
                icon={<Wand2 size={20} />}
              >
                {state.isGenerating ? 'Simulating Damage...' : 'Generate Damage'}
              </Button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="h-full">
            <div className="h-full min-h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/50">
              
              {state.error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 p-8 text-center">
                  <AlertTriangle className="text-red-500 mb-4" size={48} />
                  <p className="text-red-400 font-medium mb-4">{state.error}</p>
                  <Button variant="secondary" onClick={() => setState(prev => ({...prev, error: null}))}>
                    Try Again
                  </Button>
                </div>
              )}

              {state.generatedImage ? (
                <>
                  <div className="relative w-full h-full p-1">
                    <img 
                      src={state.generatedImage} 
                      alt="Damaged Product" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <Button onClick={handleDownload} variant="primary" icon={<Download size={18} />}>
                         Download
                       </Button>
                    </div>
                     <div className="absolute bottom-1 left-1 right-1 p-3 bg-red-950/70 backdrop-blur-md border-t border-red-900/50 rounded-b-xl">
                      <p className="text-xs text-center font-mono text-red-200">DAMAGED OUTPUT</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500 p-8 text-center">
                   {state.isGenerating ? (
                     <div className="space-y-4">
                        <div className="relative w-24 h-24 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                          <Zap className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={32} />
                        </div>
                        <p className="animate-pulse text-indigo-400 font-medium">Processing pixels...</p>
                        <p className="text-xs text-slate-600">Maintaining product geometry</p>
                     </div>
                   ) : (
                     <>
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <RefreshCw className="text-slate-600" size={32} />
                        </div>
                        <p className="font-medium text-lg text-slate-400">Ready to Generate</p>
                        <p className="text-sm text-slate-600 mt-2 max-w-xs">
                          Upload an image and configure damage settings to see the results here.
                        </p>
                     </>
                   )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;