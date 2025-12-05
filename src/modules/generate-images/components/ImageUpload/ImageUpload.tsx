import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/modules/generate-images/components/Button';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (currentImage) {
    return (
      <div className="relative group w-full h-full min-h-[300px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
        <img 
          src={currentImage} 
          alt="Original Product" 
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute top-2 right-2">
           <Button variant="secondary" onClick={onClear} className="p-2! rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800">
             <X size={20} />
           </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/70 backdrop-blur-md border-t border-slate-800">
          <p className="text-xs text-center font-mono text-slate-300">ORIGINAL STATE</p>
        </div>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        w-full h-full min-h-[300px] flex flex-col items-center justify-center 
        border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/50'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
      <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Upload className="text-indigo-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Upload Product Image</h3>
      <p className="text-sm text-slate-400 text-center max-w-xs">
        Drag & drop or click to upload a pristine product photo
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <ImageIcon size={14} />
        <span>Supports JPG, PNG, WEBP</span>
      </div>
    </label>
  );
};