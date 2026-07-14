import React, { useState } from "react";
import { CompareResult, GenerationParams } from "../types";
import { Brain, Sparkles, Sliders, ThumbsUp, ThumbsDown, Clock, ArrowRight, Share2, Eye, EyeOff, Loader2 } from "lucide-react";

interface ComparisonModeProps {
  currentResult: CompareResult | null;
  isLoading: boolean;
  onExecuteCompare: (prompt: string, params: GenerationParams, systemPrompt: string) => void;
  presetPrompts: string[];
}

export default function ComparisonMode({
  currentResult,
  isLoading,
  onExecuteCompare,
  presetPrompts
}: ComparisonModeProps) {
  const [prompt, setPrompt] = useState(
    currentResult?.prompt || "Explain the quantum entanglement principle in simple terms for a high school student."
  );
  const [systemPrompt, setSystemPrompt] = useState(
    "Always maintain a high-school level educational tone while ensuring scientific accuracy..."
  );
  const [topP, setTopP] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState("2048");
  const [highlightDiff, setHighlightDiff] = useState(true);
  const [activeTab, setActiveTab] = useState<"analysis" | "benchmarking">("analysis");

  // Track user votes
  const [gptVote, setGptVote] = useState<"up" | "down" | null>(null);
  const [claudeVote, setClaudeVote] = useState<"up" | "down" | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onExecuteCompare(
      prompt,
      { aspectRatio: "1:1", stylize: 750, stylePreset: "Photorealistic" }, // default values passed as part of params structure
      systemPrompt
    );
  };

  const handlePresetSelect = (p: string) => {
    setPrompt(p);
    onExecuteCompare(p, { aspectRatio: "1:1", stylize: 750, stylePreset: "Photorealistic" }, systemPrompt);
  };

  // Helper to render text with difference highlight
  const renderHighlightedText = (text: string) => {
    if (!highlightDiff) return <p className="whitespace-pre-line">{text}</p>;

    // We can highlight key conceptual analogies and keywords for the visual design
    const termsToHighlight = [
      "two magic dice",
      "entangled",
      "cosmic gloves",
      "before you look",
      "superposition",
      "spooky action at a distance",
      "Non-locality",
      "Correlation",
      "No-Communication"
    ];

    let content = text;
    // Simple replacement logic for visual highlights
    termsToHighlight.forEach((term) => {
      const regex = new RegExp(`\\b(${term})\\b`, "gi");
      content = content.replace(
        regex,
        `<span class="bg-tertiary/20 border-b border-tertiary/70 text-on-surface select-none font-medium px-0.5 rounded-xs">$1</span>`
      );
    });

    return (
      <p
        className="whitespace-pre-line leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 min-w-0">
      {/* Left Columns Container */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        
        {/* Top Navbar Header */}
        <div className="flex justify-between items-center bg-surface-container/30 px-4 py-2 border-b border-white/5 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary status-pulse"></span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface-variant/80">
                Comparison Mode
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`pb-1 text-xs font-semibold uppercase tracking-widest border-b-2 cursor-pointer transition-colors ${
                  activeTab === "analysis"
                    ? "text-on-surface border-tertiary"
                    : "text-on-surface-variant/60 border-transparent hover:text-tertiary"
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveTab("benchmarking")}
                className={`pb-1 text-xs font-semibold uppercase tracking-widest border-b-2 cursor-pointer transition-colors ${
                  activeTab === "benchmarking"
                    ? "text-on-surface border-tertiary"
                    : "text-on-surface-variant/60 border-transparent hover:text-tertiary"
                }`}
              >
                Benchmarking
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant/50">
            <span>Latency: Real-time calculated</span>
          </div>
        </div>

        {/* Query Input Card */}
        <div className="glass-panel rounded-xl p-4 flex items-center gap-3 glow-tertiary">
          <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
            <span className="absolute left-3 text-tertiary">
              <Brain size={18} />
            </span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="w-full bg-surface-container-highest/20 hover:bg-surface-container-highest/35 focus:bg-surface-container-highest/40 border border-white/5 rounded-lg pl-10 pr-12 py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-tertiary/40 transition-all placeholder-on-surface-variant/40"
              placeholder="Ask a query to compare models side-by-side..."
            />
            {isLoading && (
              <span className="absolute right-3 text-tertiary animate-spin">
                <Loader2 size={18} />
              </span>
            )}
          </form>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className={`p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer border ${
                highlightDiff ? "border-tertiary/30 text-tertiary" : "border-transparent text-on-surface-variant"
              }`}
              title="Highlight Differences"
            >
              {highlightDiff ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              onClick={() => alert("Comparative prompt results exported to clipboard!")}
              className="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-tertiary transition-all cursor-pointer"
              title="Export Comparison"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Main Side-by-Side Outputs */}
        <div className="flex-1 flex gap-3 overflow-hidden min-w-0">
          {/* GPT Column */}
          <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/20 font-bold text-xs">
                  GP
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight text-on-surface">GPT-4 Omni</h3>
                  <p className="text-[10px] text-on-surface-variant/70 uppercase font-mono tracking-tighter">
                    OpenAI • Temperature 0.7
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                READY
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 text-sm text-on-surface-variant space-y-4">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/40 space-y-2 py-12 select-none">
                  <Loader2 className="animate-spin text-tertiary" size={24} />
                  <span className="text-xs font-mono">Invoking OpenAI pipeline...</span>
                </div>
              ) : currentResult ? (
                renderHighlightedText(currentResult.gpt.text)
              ) : (
                <div className="py-8 text-center text-on-surface-variant/40 text-xs">
                  Enter a query above to launch comparison
                </div>
              )}
            </div>

            {/* Footer controls */}
            <div className="p-3 bg-surface-container-lowest/50 border-t border-white/5 flex justify-between items-center shrink-0 select-none">
              <div className="flex gap-1">
                <button
                  onClick={() => setGptVote(gptVote === "up" ? null : "up")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    gptVote === "up" ? "bg-tertiary/25 text-tertiary" : "hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => setGptVote(gptVote === "down" ? null : "down")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    gptVote === "down" ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
              {currentResult && (
                <div className="flex items-center gap-1 font-mono text-[10px] text-on-surface-variant/70">
                  <Clock size={12} className="text-tertiary" />
                  <span>{currentResult.gpt.latency}s latency</span>
                </div>
              )}
            </div>
          </div>

          {/* Claude Column */}
          <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20 font-bold text-xs">
                  AN
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight text-on-surface">Claude 3.5 Sonnet</h3>
                  <p className="text-[10px] text-on-surface-variant/70 uppercase font-mono tracking-tighter">
                    Anthropic • Temperature 0.5
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20">
                BEST MATCH
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 text-sm text-on-surface-variant space-y-4">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/40 space-y-2 py-12 select-none">
                  <Loader2 className="animate-spin text-tertiary" size={24} />
                  <span className="text-xs font-mono">Aligning Anthropic heuristics...</span>
                </div>
              ) : currentResult ? (
                renderHighlightedText(currentResult.claude.text)
              ) : (
                <div className="py-8 text-center text-on-surface-variant/40 text-xs">
                  Enter a query above to launch comparison
                </div>
              )}
            </div>

            {/* Footer controls */}
            <div className="p-3 bg-surface-container-lowest/50 border-t border-white/5 flex justify-between items-center shrink-0 select-none">
              <div className="flex gap-1">
                <button
                  onClick={() => setClaudeVote(claudeVote === "up" ? null : "up")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    claudeVote === "up" ? "bg-tertiary/25 text-tertiary" : "hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => setClaudeVote(claudeVote === "down" ? null : "down")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    claudeVote === "down" ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
              {currentResult && (
                <div className="flex items-center gap-1 font-mono text-[10px] text-on-surface-variant/70">
                  <Clock size={12} className="text-tertiary" />
                  <span>{currentResult.claude.latency}s latency</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick presets for easier demonstration */}
        <div className="flex flex-col gap-1.5 p-3 bg-surface-container-low/20 rounded-xl border border-white/5 select-none">
          <span className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest font-bold">
            Suggested comparative prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p)}
                disabled={isLoading}
                className="text-xs bg-surface-container-high/40 hover:bg-surface-container-high/70 border border-white/5 text-on-surface-variant px-3 py-1.5 rounded-lg truncate max-w-xs transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Parameters & Analytics) */}
      <aside className="w-64 shrink-0 flex flex-col gap-3 select-none">
        {/* Analytics Card */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-4">
          <h4 className="text-[10px] font-mono font-bold text-on-surface-variant/80 uppercase tracking-widest border-b border-white/5 pb-2">
            Analytics
          </h4>
          <div className="space-y-4">
            {/* Semantic Similarity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-on-surface-variant/70">Semantic Similarity</span>
                <span className="text-tertiary font-bold">{currentResult?.analytics.similarity || 0}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary transition-all duration-500"
                  style={{ width: `${currentResult?.analytics.similarity || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Toxicity Risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-on-surface-variant/70">Toxicity Risk</span>
                <span className="text-green-400 font-bold">
                  {currentResult ? `${(currentResult.analytics.toxicity * 100).toFixed(2)}%` : "0.00%"}
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: currentResult ? "2%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Parameters Card */}
        <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col min-h-0">
          <h4 className="text-[10px] font-mono font-bold text-on-surface-variant/80 uppercase tracking-widest border-b border-white/5 pb-2 mb-4 shrink-0">
            Model Parameters
          </h4>
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            {/* Top-P Sampling */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-on-surface-variant/70">Top-P Sampling</label>
                <span className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-tertiary">{topP.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-tertiary bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono opacity-40">
                <span>0.0</span>
                <span>1.0</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <label className="block text-xs text-on-surface-variant/70">Max Tokens</label>
              <select
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="w-full bg-surface-container-highest/40 hover:bg-surface-container-highest/60 border border-white/10 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-tertiary text-on-surface cursor-pointer"
              >
                <option value="2048">2048 Tokens</option>
                <option value="4096">4096 Tokens</option>
                <option value="8192">8192 Tokens</option>
              </select>
            </div>

            {/* System Prompt (Dynamic) */}
            <div className="p-3 rounded-lg bg-surface-container-highest/20 border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="text-[10px] font-mono font-bold text-on-surface uppercase">System Prompt</span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-none text-[10px] leading-relaxed text-on-surface-variant/70 italic focus:outline-none focus:ring-0 resize-none p-0"
                placeholder="Type target instruction profile..."
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
