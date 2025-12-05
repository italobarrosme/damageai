import { LogoBrand } from "../Ilustrations";

export const LoadingSpinner = () => {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-slate-800" />

      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

      <LogoBrand
        size={32}
        color="white"
        className="
            absolute 
            top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2
            text-indigo-500 
            animate-pulse
          "
      />
    </div>
  );
};
