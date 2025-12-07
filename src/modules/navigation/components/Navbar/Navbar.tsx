import { LogoBrand } from "@/modules/common/Ilustrations/LogoBrand";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoBrand size={20} color="white" backgroundColor="indigo-600" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            DamageAI
          </h1>
        </div>
        <div className="text-sm text-slate-400 hidden sm:block">
          Product Damage Simulator v1.1.0
        </div>
      </div>
    </header>
  );
}
