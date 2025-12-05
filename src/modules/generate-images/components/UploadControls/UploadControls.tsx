import { Wand2 } from "lucide-react";
import { ImageUploader } from "@/modules/generate-images/components/ImageUploader";
import { Button } from "@/modules/generate-images/components/Button";
import { DamageType } from "@/types";

interface UploadControlsProps {
	originalImage: string | null;
	selectedDamage: DamageType | null;
	customPrompt: string;
	isGenerating: boolean;
	onImageSelect: (base64: string) => void;
	onClear: () => void;
	onDamageSelect: (damage: DamageType) => void;
	onCustomPromptChange: (prompt: string) => void;
	onGenerate: () => void;
}

export function UploadControls({
	originalImage,
	selectedDamage,
	customPrompt,
	isGenerating,
	onImageSelect,
	onClear,
	onDamageSelect,
	onCustomPromptChange,
	onGenerate,
}: UploadControlsProps) {
	return (
		<div className="space-y-6">
			<div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-800 shadow-2xl shadow-black/50">
				<ImageUploader
					onImageSelect={onImageSelect}
					currentImage={originalImage}
					onClear={onClear}
				/>
			</div>

			<div
				className={`bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6 transition-opacity duration-300 ${
					!originalImage
						? "opacity-50 pointer-events-none"
						: "opacity-100"
				}`}
			>
				<div>
					<label
						htmlFor="damage-type"
						className="block text-sm font-medium text-slate-300 mb-2"
					>
						Type of Damage
					</label>
					<div id="damage-type" className="grid grid-cols-2 gap-2">
						{Object.entries(DamageType).map(([key, value]) => (
							<button
								key={key}
								type="button"
								onClick={() => onDamageSelect(value)}
								className={`
                  text-left text-xs sm:text-sm px-3 py-2 rounded-lg border transition-all duration-200
                  ${
										selectedDamage === value
											? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
											: "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
									}
                `}
							>
								{value}
							</button>
						))}
					</div>
				</div>

				<div>
					<label
						htmlFor="custom-prompt"
						className="block text-sm font-medium text-slate-300 mb-2"
					>
						Specific Details (Optional)
					</label>
					<textarea
						id="custom-prompt"
						value={customPrompt}
						onChange={(e) => onCustomPromptChange(e.target.value)}
						placeholder="e.g., The screen is shattered in the top right corner..."
						className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-600 resize-none h-24"
					/>
				</div>

				<Button
					onClick={onGenerate}
					isLoading={isGenerating}
					className="w-full py-4 text-lg shadow-indigo-500/20"
					icon={<Wand2 size={20} />}
				>
					{isGenerating ? "Simulating Damage..." : "Generate Damage"}
				</Button>
			</div>
		</div>
	);
}

