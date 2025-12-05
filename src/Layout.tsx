import { Zap } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
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
            Upload a pristine product image. Our AI will generate a damaged
            version while preserving the product's identity and geometry.
          </p>
        </div>

        {/* Main Workspace */}
        {children}
      </main>
    </div>
  );
};
