import React, { useState } from "react";
import { MainView, ModelsSubView, CompareResult, ImageGenerationItem, ApiProvider, FineTuneJob, GenerationParams, HistorySession } from "./types";
import Sidebar from "./components/Sidebar";
import ComparisonMode from "./components/ComparisonMode";
import GenerationStudio from "./components/GenerationStudio";
import WorkspacePane from "./components/WorkspacePane";
import SettingsGrid from "./components/SettingsGrid";
import { Brain, LayoutGrid, Clock, ShieldCheck, Cpu, ExternalLink, Menu, Bell, Search, Info, X, Sliders } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>(MainView.Models);
  const [currentSubView, setCurrentSubView] = useState<ModelsSubView>(ModelsSubView.Comparison);
  const [profileName, setProfileName] = useState("Alex Rivera");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hydrate initial active providers
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      id: "1",
      code: "OA",
      name: "OpenAI",
      status: "Active",
      keyIdentifier: "sk-proj-••••••••K4f2",
      limitTotal: 1000,
      limitUsed: 500
    },
    {
      id: "2",
      code: "AN",
      name: "Anthropic",
      status: "Active",
      keyIdentifier: "ant-api-••••••••L9x1",
      limitTotal: 2500,
      limitUsed: 242.15
    },
    {
      id: "3",
      code: "GV",
      name: "Google Vertex",
      status: "Quota Exceeded",
      keyIdentifier: "vtx-sa-••••••••8P0w",
      limitTotal: 200,
      limitUsed: 200
    }
  ]);

  // Hydrate fine-tune forge sessions
  const [fineTuneJobs, setFineTuneJobs] = useState<FineTuneJob[]>([
    {
      id: "ft-1",
      name: "Legal_Advisor_V2",
      baseModel: "Claude 3.5 Sonnet",
      status: "Completed",
      trainingSet: "4.2k clean legal briefs",
      loss: 0.042
    },
    {
      id: "ft-2",
      name: "Creative_Writer_Pro",
      baseModel: "GPT-4o",
      status: "Processing",
      trainingSet: "1.5k clean novel chapters",
      progress: 64,
      estimated: "12m remaining"
    }
  ]);

  // Initial comparative answers (Screen 1 hydrate)
  const [comparisonResult, setComparisonResult] = useState<CompareResult | null>({
    prompt: "Explain the quantum entanglement principle in simple terms for a high school student.",
    gpt: {
      text: `Imagine you have two magic dice. Normally, if you roll two dice in different cities, the results have nothing to do with each other. But if these dice were "entangled," something incredible happens.

Whenever you roll your die and get a 6, your friend's die—thousands of miles away—instantly turns into a 6 too. They are linked across space in a way that defies our usual understanding of distance.

\`\`\`javascript
// Simple Logic Check
if (particleA.spin === 'up') {
  particleB.spin = 'down'; // Instantaneous
}
\`\`\`

In physics, we say their properties are shared. Measuring one particle immediately determines the state of the other, no matter the gap between them. Einstein called this "spooky action at a distance."`,
      latency: 1.2,
      model: "GPT-4 Omni",
      provider: "OpenAI",
      temperature: 0.7
    },
    claude: {
      text: `Think of quantum entanglement as a pair of cosmic gloves. If you buy a pair of gloves and send one box to the Moon and keep one on Earth, the moment you open your box and see a "Right" glove, you instantly know the one on the Moon is a "Left" glove.

However, quantum particles are even weirder because before you look, they are actually both Left AND Right at the same time (this is called superposition). Opening the box "forces" both gloves to pick a side simultaneously.

Key takeaways for your exam:
• Non-locality: Distance doesn't matter.
• Correlation: One state dictates the other.
• No-Communication: You can't actually send "messages" faster than light.`,
      latency: 0.8,
      model: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      temperature: 0.5
    },
    analytics: {
      similarity: 64,
      toxicity: 0.02
    }
  });

  // Initial generated images (Screen 3 hydrate)
  const [historyItems, setHistoryItems] = useState<ImageGenerationItem[]>([
    {
      id: "gen-1",
      prompt: "Bioluminescent botanical garden inside a cybernetic dome, deep neon accents, hyper-realistic --ar 1:1",
      imageUrl: "https://picsum.photos/seed/biolum/800/800",
      variations: [
        "https://picsum.photos/seed/biolum-v1/500/500",
        "https://picsum.photos/seed/biolum-v2/500/500",
        "https://picsum.photos/seed/biolum-v3/500/500"
      ],
      timestamp: "10:42 AM",
      params: { aspectRatio: "1:1", stylize: 750, stylePreset: "Photorealistic" }
    },
    {
      id: "gen-2",
      prompt: "Retro-futuristic monolith standing in an obsidian sand desert under a cosmic nebula --ar 1:1",
      imageUrl: "https://picsum.photos/seed/obsidian-monolith/800/800",
      variations: [
        "https://picsum.photos/seed/obsidian-monolith-v1/500/500",
        "https://picsum.photos/seed/obsidian-monolith-v2/500/500",
        "https://picsum.photos/seed/obsidian-monolith-v3/500/500"
      ],
      timestamp: "09:15 AM",
      params: { aspectRatio: "1:1", stylize: 500, stylePreset: "3DRender" }
    }
  ]);

  // Combined historic logger (History View hydration)
  const [historySessions, setHistorySessions] = useState<HistorySession[]>([
    {
      id: "sess-1",
      prompt: "Explain quantum entanglement principle...",
      timestamp: "10:42 AM",
      view: MainView.Models,
      subView: ModelsSubView.Comparison,
      data: comparisonResult
    },
    {
      id: "sess-2",
      prompt: "Bioluminescent botanical garden...",
      timestamp: "10:42 AM",
      view: MainView.Models,
      subView: ModelsSubView.Generation,
      data: historyItems[0]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Trigger server compare endpoint
  const handleExecuteCompare = async (promptText: string, params: GenerationParams, systemPrompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          systemPrompt,
          temperature: currentSubView === ModelsSubView.Comparison ? 0.7 : 0.5,
          topP: 1.0,
          maxTokens: 2048
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const payload: CompareResult = {
          prompt: promptText,
          gpt: resData.gpt,
          claude: resData.claude,
          analytics: resData.analytics,
          isSimulated: resData.isSimulated
        };
        setComparisonResult(payload);
        
        // Append to history sessions
        const newSession: HistorySession = {
          id: `sess-${Date.now()}`,
          prompt: promptText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          view: MainView.Models,
          subView: ModelsSubView.Comparison,
          data: payload
        };
        setHistorySessions((prev) => [newSession, ...prev]);
      } else {
        alert(`Comparison invocation failed: ${resData.error}`);
      }
    } catch (err: any) {
      alert(`Network error invoking comparison: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger server generate-image endpoint
  const handleGenerateImage = async (promptText: string, params: GenerationParams) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: params.aspectRatio,
          stylize: params.stylize,
          stylePreset: params.stylePreset
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const newItem: ImageGenerationItem = {
          id: `gen-${Date.now()}`,
          prompt: promptText,
          imageUrl: resData.url,
          variations: resData.variations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          params
        };
        setHistoryItems((prev) => [newItem, ...prev]);

        // Append to history sessions
        const newSession: HistorySession = {
          id: `sess-${Date.now()}`,
          prompt: promptText,
          timestamp: newItem.timestamp,
          view: MainView.Models,
          subView: ModelsSubView.Generation,
          data: newItem
        };
        setHistorySessions((prev) => [newSession, ...prev]);
      } else {
        alert("Image generation failed. Try another prompt.");
      }
    } catch (e: any) {
      alert(`Network error in generating image: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger multi-pane query dispatcher
  const handleExecuteMultiPane = async (promptText: string, panes: string[]) => {
    setIsLoading(true);
    const results: { [key: string]: string } = {};

    try {
      const promises = panes.map(async (model) => {
        const response = await fetch("/api/multi-pane", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, modelName: model })
        });
        const resData = await response.json();
        if (resData.success) {
          results[model] = resData.text;
        } else {
          results[model] = "Failed to synchronize node response.";
        }
      });

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    return results;
  };

  // Actions on History view selections
  const handleSelectHistoryItem = (item: ImageGenerationItem) => {
    // Bring user to generation tab and hydrate active
    setCurrentView(MainView.Models);
    setCurrentSubView(ModelsSubView.Generation);
    setHistoryItems((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      return [item, ...filtered];
    });
  };

  const handleSelectHistorySession = (sess: HistorySession) => {
    if (sess.subView === ModelsSubView.Comparison) {
      setComparisonResult(sess.data);
      setCurrentView(MainView.Models);
      setCurrentSubView(ModelsSubView.Comparison);
    } else if (sess.subView === ModelsSubView.Generation) {
      handleSelectHistoryItem(sess.data);
    }
  };

  // Render main core workspace view panels
  const renderMainContent = () => {
    switch (currentView) {
      case MainView.History:
        return (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6 select-none">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-on-surface font-display">System Historic Audit Logs</h2>
              <p className="text-xs text-on-surface-variant/70 mt-1">Review historic model comparisons and generation sessions</p>
            </div>
            
            {historySessions.length === 0 ? (
              <div className="py-20 text-center text-on-surface-variant/40 text-sm">
                No historic sessions stored in workspace yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historySessions.map((sess) => {
                  const isImage = sess.subView === ModelsSubView.Generation;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleSelectHistorySession(sess)}
                      className="glass-panel p-5 rounded-xl border border-white/5 hover:border-tertiary/30 cursor-pointer hover:bg-surface-container-low/20 transition-all flex flex-col justify-between h-40"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider mb-2">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-tertiary" />
                            {sess.timestamp}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 font-bold">
                            {sess.subView === ModelsSubView.Comparison ? "Comparison" : "Generation"}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-on-surface truncate pr-6">{sess.prompt}</h4>
                      </div>

                      {isImage ? (
                        <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-3">
                          <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-white/10">
                            <img src={sess.data.imageUrl} alt="Historical Thumbnail" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-on-surface-variant/70 italic truncate">
                            Generated using {sess.data.params.stylePreset} preset
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-on-surface-variant/70 border-t border-white/5 pt-3 mt-3">
                          <span>Comparison: GPT-4 Omni vs Claude 3.5 Sonnet</span>
                          <span className="font-mono text-[10px] text-tertiary font-bold">{sess.data.analytics.similarity}% Match</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case MainView.Models:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top models selection tabs sub-navigation */}
            <div className="flex justify-between items-center bg-surface border-b border-white/5 px-6 py-2 select-none">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setCurrentSubView(ModelsSubView.Comparison)}
                  className={`text-xs font-mono font-bold uppercase tracking-widest border-b-2 cursor-pointer pb-1 transition-all ${
                    currentSubView === ModelsSubView.Comparison
                      ? "text-on-surface border-tertiary"
                      : "text-on-surface-variant/50 hover:text-tertiary"
                  }`}
                >
                  Comparison Mode
                </button>
                <button
                  onClick={() => setCurrentSubView(ModelsSubView.Generation)}
                  className={`text-xs font-mono font-bold uppercase tracking-widest border-b-2 cursor-pointer pb-1 transition-all ${
                    currentSubView === ModelsSubView.Generation
                      ? "text-on-surface border-tertiary"
                      : "text-on-surface-variant/50 hover:text-tertiary"
                  }`}
                >
                  Generation Studio
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant/50">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-tertiary" />
                  Secured
                </span>
              </div>
            </div>

            {/* Sub-view core renderer */}
            {currentSubView === ModelsSubView.Comparison ? (
              <ComparisonMode
                currentResult={comparisonResult}
                isLoading={isLoading}
                onExecuteCompare={handleExecuteCompare}
                presetPrompts={[
                  "Explain the quantum entanglement principle in simple terms for a high school student.",
                  "Analyze economic game theory and Nash Equilibrium principles with a corporate analogy.",
                  "Synthesize standard computer science MVC architectural pattern in Rust vs Go languages."
                ]}
              />
            ) : (
              <GenerationStudio
                historyItems={historyItems}
                isLoading={isLoading}
                onGenerateImage={handleGenerateImage}
                onSelectHistoryItem={handleSelectHistoryItem}
              />
            )}
          </div>
        );

      case MainView.Workspace:
        return (
          <WorkspacePane
            isLoading={isLoading}
            onExecuteMultiPane={handleExecuteMultiPane}
          />
        );

      case MainView.Settings:
        return (
          <SettingsGrid
            profileName={profileName}
            onProfileNameChange={(name) => setProfileName(name)}
            providers={providers}
            onAddProvider={(p) => setProviders((prev) => [...prev, p])}
            onDeleteProvider={(id) => setProviders((prev) => prev.filter((p) => p.id !== id))}
            fineTuneJobs={fineTuneJobs}
            onCreateFineTune={(job) => setFineTuneJobs((prev) => [job, ...prev])}
          />
        );

      case MainView.Help:
        return (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-6 select-none max-w-4xl mx-auto">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-on-surface font-display">Command Center Diagnostics & Support</h2>
              <p className="text-xs text-on-surface-variant/70 mt-1">Understanding capabilities, endpoints, and billing pipelines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                <h4 className="font-bold text-xs text-tertiary font-mono uppercase">API Integrations</h4>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Nexus AI utilizes secure server-side API request proxies to securely call models from OpenAI, Anthropic, and Google. Custom keys can be entered directly in the Settings dashboard.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                <h4 className="font-bold text-xs text-tertiary font-mono uppercase">Fine-tuning (Forge)</h4>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Train custom parameters via Model Forge by supplying dataset URLs or plain texts. Forge jobs execute inside cloud containers to bundle custom weights seamlessly.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                <h4 className="font-bold text-xs text-tertiary font-mono uppercase">Dual-pane Sync</h4>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  The multi-pane Workspace synchronizes prompt distribution to up to three discrete model structures. Clear, retry, and re-tune nodes independently from any sidebar command blocks.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                <h4 className="font-bold text-xs text-tertiary font-mono uppercase">Visual Heuristics</h4>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Image synthesis maps aspects (1:1, 16:9, 9:16) with Midjourney stylize strength controllers. Variations are rendered inside high-performance responsive grid containers.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-3 mt-4">
              <Info size={18} className="text-tertiary shrink-0" />
              <p className="text-xs text-on-surface-variant/70">
                Need extra custom nodes or high-priority enterprise GPUs? Reach out to support at <span className="text-on-surface font-bold">ops@nexus.ai</span>.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-surface-dim text-on-surface overflow-hidden font-sans select-none antialiased">
      
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setIsMobileMenuOpen(false);
        }}
        profileName={profileName}
        profileTier="Master Orchestrator"
        avatarUrl="https://picsum.photos/seed/rivera/300/300"
      />

      {/* Main Core View Area Container */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-surface to-surface-container-low/30 relative">
        
        {/* Top Navbar Header */}
        <header className="h-16 flex justify-between items-center px-6 border-b border-white/5 bg-surface shrink-0 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-white/10 text-on-surface hover:text-tertiary transition-colors cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Cpu className="text-tertiary status-pulse" size={18} />
              <span className="font-display font-black tracking-tight text-on-surface text-lg">NEXUS COMMAND</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => alert("All workspace pipelines running in optimal bounds.")}
              className="p-1.5 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <Bell size={18} />
            </button>
            <button
              onClick={() => alert("Deploying Workspace to Cloud Run. Build and deploy complete!")}
              className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-widest border border-tertiary text-tertiary rounded hover:bg-tertiary hover:text-on-tertiary transition-all cursor-pointer hidden sm:block"
            >
              DEPLOY CORE
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-tertiary/20 shrink-0">
              <img
                src="https://picsum.photos/seed/rivera/300/300"
                alt="Alex Rivera"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Core Panel Renderer */}
        {renderMainContent()}

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            {/* Drawer */}
            <div className="relative flex flex-col w-64 max-w-xs bg-surface-container-low border-r border-white/10 p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl font-extrabold text-on-surface">Nexus AI</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded border border-white/15 text-on-surface hover:text-tertiary cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { view: MainView.History, label: "History", icon: Clock },
                  { view: MainView.Models, label: "Models", icon: Brain },
                  { view: MainView.Workspace, label: "Workspace", icon: LayoutGrid },
                  { view: MainView.Settings, label: "Settings", icon: Sliders },
                  { view: MainView.Help, label: "Help & Support", icon: Info },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setCurrentView(item.view);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive ? "text-tertiary bg-tertiary/10 border-r-2 border-tertiary" : "text-on-surface-variant/70 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-tertiary/30">
                    <img src="https://picsum.photos/seed/rivera/300/300" alt="Alex Rivera" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate">{profileName}</span>
                    <span className="text-[10px] text-on-surface-variant/70 font-mono">Master Orchestrator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
