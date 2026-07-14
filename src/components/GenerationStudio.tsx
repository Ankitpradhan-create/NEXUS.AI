import React, { useState } from "react";
import { ImageGenerationItem, GenerationParams } from "../types";
import { Wand2, Image as ImageIcon, RefreshCw, Download, CheckCircle2, Circle, HelpCircle, Loader2, Maximize } from "lucide-react";

interface GenerationStudioProps {
  historyItems: ImageGenerationItem[];
  isLoading: boolean;
  onGenerateImage: (prompt: string, params: GenerationParams) => void;
  onSelectHistoryItem: (item: ImageGenerationItem) => void;
}

export default function GenerationStudio({
  historyItems,
  isLoading,
  onGenerateImage,
  onSelectHistoryItem
}: GenerationStudioProps) {
  const [prompt, setPrompt] = useState("Describe your vision... --ar 16:9 --v 6.0");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [stylize, setStylize] = useState(750);
  const [stylePreset, setStylePreset] = useState("Photorealistic");
  const [activeModel, setActiveModel] = useState<"midjourney" | "dalle" | "stable">("midjourney");
  const [viewMode, setViewMode] = useState<"grid" | "split" | "inspector">("grid");

  // Local master selection state
  const activeItem = historyItems[0] || null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerateImage(prompt, {
      aspectRatio,
      stylize,
      stylePreset
    });
  };

  const handleReroll = () => {
    if (activeItem) {
      onGenerateImage(activeItem.prompt, {
        aspectRatio,
        stylize,
        stylePreset
      });
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 min-w-0">
      
      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        
        {/* Model Tabs Header */}
        <div className="flex justify-between items-center bg-surface-container/30 px-4 py-2 border-b border-white/5 rounded-xl shrink-0 select-none">
          <div className="flex items-center gap-8">
            <h2 className="text-sm font-semibold tracking-wide text-on-surface">Generation Studio</h2>
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveModel("midjourney")}
                className={`text-xs font-mono font-semibold uppercase tracking-wider border-b-2 cursor-pointer pb-1 transition-all ${
                  activeModel === "midjourney" ? "text-on-surface border-tertiary" : "text-on-surface-variant/50 hover:text-tertiary"
                }`}
              >
                Midjourney v6
              </button>
              <button
                onClick={() => setActiveModel("dalle")}
                className={`text-xs font-mono font-semibold uppercase tracking-wider border-b-2 cursor-pointer pb-1 transition-all ${
                  activeModel === "dalle" ? "text-on-surface border-tertiary" : "text-on-surface-variant/50 hover:text-tertiary"
                }`}
              >
                DALL-E 3
              </button>
              <button
                onClick={() => setActiveModel("stable")}
                className={`text-xs font-mono font-semibold uppercase tracking-wider border-b-2 cursor-pointer pb-1 transition-all ${
                  activeModel === "stable" ? "text-on-surface border-tertiary" : "text-on-surface-variant/50 hover:text-tertiary"
                }`}
              >
                Stable Diffusion
              </button>
            </nav>
          </div>
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search assets..."
              className="bg-surface-container-highest/30 border border-white/5 rounded-full pl-4 pr-4 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-tertiary/40 w-48 text-on-surface"
            />
          </div>
        </div>

        {/* Current Workflow Details */}
        <div className="flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-on-surface font-display">Current Workflow</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-tertiary/10 rounded-full border border-tertiary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary status-pulse"></span>
              <span className="text-[9px] font-mono font-bold text-tertiary tracking-wider">GEN V6.1 ACTIVE</span>
            </div>
          </div>
          <div className="flex bg-surface-container-high/40 p-0.5 rounded-lg border border-white/5">
            {(["grid", "split", "inspector"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-[10px] font-mono font-semibold uppercase rounded cursor-pointer transition-all ${
                  viewMode === mode
                    ? "bg-surface-container-highest text-on-surface shadow-sm"
                    : "text-on-surface-variant/50 hover:text-on-surface"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Image Generator Area */}
        <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
          {isLoading ? (
            <div className="flex-1 glass-panel rounded-xl flex flex-col items-center justify-center p-8 select-none">
              <Loader2 className="animate-spin text-tertiary mb-3" size={32} />
              <p className="text-sm font-bold text-on-surface">Synthesizing Creative Grids...</p>
              <p className="text-xs text-on-surface-variant/60 font-mono mt-1">Est. Generation: 12 seconds</p>
            </div>
          ) : activeItem ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
              {/* MASTER IMAGE */}
              <div className="group relative aspect-square glass-panel rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-tertiary/40 transition-all">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Simulating high-res upscale...")}
                      className="flex-1 py-1.5 bg-white/10 backdrop-blur-md text-white font-mono text-[10px] uppercase font-bold rounded border border-white/10 hover:bg-white/20 transition-colors"
                    >
                      Upscale (4x)
                    </button>
                    <button
                      onClick={handleReroll}
                      className="flex-1 py-1.5 bg-white/10 backdrop-blur-md text-white font-mono text-[10px] uppercase font-bold rounded border border-white/10 hover:bg-white/20 transition-colors"
                    >
                      Variations
                    </button>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-tertiary border border-tertiary/30">
                  V1 MASTER
                </div>
              </div>

              {/* VARIATIONS 2x2 (3 variations + 1 reroll) */}
              <div className="grid grid-cols-2 grid-rows-2 gap-3 select-none">
                {activeItem.variations.map((v, idx) => (
                  <div key={idx} className="relative glass-panel rounded-lg overflow-hidden group aspect-square border border-white/5">
                    <img
                      src={v}
                      alt={`Variation ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button
                        onClick={() => alert("Zooming variation in modal")}
                        className="p-1.5 bg-black/60 rounded-full text-white hover:text-tertiary border border-white/10"
                      >
                        <Maximize size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {/* REROLL BATCH BUTTON */}
                <button
                  onClick={handleReroll}
                  className="relative glass-panel rounded-lg overflow-hidden border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-tertiary/30 transition-all group aspect-square cursor-pointer bg-surface-container/10"
                >
                  <RefreshCw size={20} className="text-on-surface-variant group-hover:text-tertiary group-hover:rotate-45 transition-all" />
                  <span className="text-[10px] font-mono uppercase font-bold text-on-surface-variant/70 group-hover:text-on-surface">
                    Reroll Batch
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 glass-panel rounded-xl flex flex-col items-center justify-center p-8 select-none border-2 border-dashed border-white/10">
              <ImageIcon size={40} className="text-on-surface-variant/30 mb-2" />
              <p className="text-sm font-bold text-on-surface">No Generated Images Yet</p>
              <p className="text-xs text-on-surface-variant/50 max-w-xs text-center mt-1">
                Type a creative description below to generate high-performance visual arrays.
              </p>
            </div>
          )}
        </div>

        {/* History Carousel */}
        <div className="pt-2 shrink-0 select-none">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/70 font-bold">
              Session History
            </h4>
            <button
              onClick={() => alert("Full archive gallery open")}
              className="text-[10px] text-tertiary font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {historyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="w-36 shrink-0 aspect-[4/3] glass-panel rounded-lg overflow-hidden border border-white/5 grayscale hover:grayscale-0 active:scale-95 transition-all cursor-pointer hover:border-tertiary/30"
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Prompts Dock */}
        <form onSubmit={handleSubmit} className="relative z-10 select-none">
          <div className="relative glass-panel rounded-2xl p-1 shadow-2xl">
            <div className="bg-surface-container-low/80 rounded-xl p-2.5 flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-container-highest/40 flex items-center justify-center text-tertiary">
                <Wand2 size={18} />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-none text-sm text-on-surface focus:outline-none focus:ring-0 resize-none py-2 placeholder-on-surface-variant/40 outline-none"
                placeholder="Describe your vision... --ar 16:9 --v 6.0"
              />
              <div className="flex items-center gap-2 pr-1">
                <button
                  type="button"
                  onClick={() => alert("Upload source image for reference")}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Source Reference Image"
                >
                  <ImageIcon size={18} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-tertiary text-on-tertiary px-5 py-2 rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </form>

      </div>

      {/* Right Parameters Panel */}
      <aside className="w-64 shrink-0 flex flex-col gap-3 border-l border-white/5 pl-3 select-none">
        <div className="p-1 border-b border-white/5 shrink-0">
          <h3 className="text-sm font-bold text-on-surface font-display">Parameters</h3>
          <p className="text-[10px] font-mono text-on-surface-variant/60 mt-0.5">Fine-tune generation engine</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Aspect Ratio Selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "16:9", ratio: "16:9", style: "w-5 h-3" },
                { label: "1:1", ratio: "1:1", style: "w-4 h-4" },
                { label: "9:16", ratio: "9:16", style: "w-3 h-5" }
              ].map((item) => (
                <button
                  key={item.ratio}
                  type="button"
                  onClick={() => setAspectRatio(item.ratio)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                    aspectRatio === item.ratio
                      ? "border-tertiary bg-tertiary/5 text-tertiary"
                      : "border-white/10 hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <div className={`border-2 border-current rounded-xs mb-1.5 ${item.style}`}></div>
                  <span className="text-[9px] font-mono">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stylize Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70">
                Stylize
              </label>
              <span className="font-mono text-[10px] text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">
                {stylize}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={stylize}
              onChange={(e) => setStylize(parseInt(e.target.value))}
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
            />
            <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/40">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70">
              Style Presets
            </label>
            <div className="space-y-2">
              {[
                { name: "Photorealistic", label: "Photorealistic" },
                { name: "Anime", label: "Anime / Manga" },
                { name: "3DRender", label: "3D Render" }
              ].map((preset) => {
                const isActive = stylePreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setStylePreset(preset.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-high/40 border transition-colors cursor-pointer ${
                      isActive ? "border-tertiary/50 text-on-surface" : "border-white/5 hover:border-white/10 text-on-surface-variant"
                    }`}
                  >
                    <span className="text-xs">{preset.label}</span>
                    {isActive ? (
                      <CheckCircle2 size={14} className="text-tertiary" />
                    ) : (
                      <Circle size={14} className="text-on-surface-variant/40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Insights Card */}
          <div className="p-3.5 rounded-xl bg-tertiary/5 border border-tertiary/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-tertiary">
                <HelpCircle size={14} />
              </span>
              <span className="font-mono text-[10px] font-bold text-tertiary tracking-wider uppercase">MODEL INSIGHTS</span>
            </div>
            <p className="text-[10px] leading-relaxed text-on-surface-variant/80">
              Midjourney v6.1 currently utilizes your high-priority compute. Est. generation time:{" "}
              <span className="text-on-surface font-semibold">12s</span>.
            </p>
          </div>
        </div>

        {/* Bottom Download Button */}
        <div className="pt-2 border-t border-white/5 shrink-0">
          <button
            onClick={() => alert("Preparing full workflow assets archive download...")}
            className="w-full py-2.5 bg-surface-container-highest/60 text-on-surface font-bold text-xs rounded-lg hover:bg-surface-bright transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/5 hover:border-white/10"
          >
            <Download size={14} />
            <span>Export Session</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
