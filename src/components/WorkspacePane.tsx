import React, { useState } from "react";
import { RefreshCw, Settings, Trash2, Paperclip, Send, Loader2, Code } from "lucide-react";

interface PaneMessage {
  sender: "user" | "ai";
  text: string;
  isCode?: boolean;
}

interface WorkspacePaneProps {
  isLoading: boolean;
  onExecuteMultiPane: (prompt: string, panes: string[]) => Promise<{ [key: string]: string }>;
}

export default function WorkspacePane({
  isLoading,
  onExecuteMultiPane
}: WorkspacePaneProps) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"models" | "workspaces" | "analysis">("workspaces");

  // Maintain histories for all three panes
  const [gptMessages, setGptMessages] = useState<PaneMessage[]>([
    {
      sender: "ai",
      text: "Welcome back. I am ready to process your request across all platforms."
    }
  ]);

  const [claudeMessages, setClaudeMessages] = useState<PaneMessage[]>([
    {
      sender: "ai",
      text: "Analyzing architectural context. Claude is synced and standing by."
    },
    {
      sender: "ai",
      text: `const nexus = () => {\n  // Neural bridge active\n  return "Synchronized";\n}`,
      isCode: true
    }
  ]);

  const [geminiMessages, setGeminiMessages] = useState<PaneMessage[]>([
    {
      sender: "ai",
      text: "Multimodal context window updated. Ready for high-volume prompting."
    }
  ]);

  const handleSendAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userPrompt = prompt;
    setPrompt("");

    // Append user message to all streams
    setGptMessages((prev) => [...prev, { sender: "user", text: userPrompt }]);
    setClaudeMessages((prev) => [...prev, { sender: "user", text: userPrompt }]);
    setGeminiMessages((prev) => [...prev, { sender: "user", text: userPrompt }]);

    try {
      const results = await onExecuteMultiPane(userPrompt, ["GPT-4o", "Claude 3.5", "Gemini Pro"]);
      
      if (results["GPT-4o"]) {
        setGptMessages((prev) => [...prev, { sender: "ai", text: results["GPT-4o"] }]);
      }
      if (results["Claude 3.5"]) {
        setClaudeMessages((prev) => [...prev, { sender: "ai", text: results["Claude 3.5"] }]);
      }
      if (results["Gemini Pro"]) {
        setGeminiMessages((prev) => [...prev, { sender: "ai", text: results["Gemini Pro"] }]);
      }
    } catch (err) {
      console.error(err);
      const errMsg = "Execution failed. Check backend endpoint or API key.";
      setGptMessages((prev) => [...prev, { sender: "ai", text: errMsg }]);
      setClaudeMessages((prev) => [...prev, { sender: "ai", text: errMsg }]);
      setGeminiMessages((prev) => [...prev, { sender: "ai", text: errMsg }]);
    }
  };

  const clearPane = (pane: "gpt" | "claude" | "gemini") => {
    if (pane === "gpt") setGptMessages([]);
    if (pane === "claude") setClaudeMessages([]);
    if (pane === "gemini") setGeminiMessages([]);
  };

  const refreshPane = async (pane: "gpt" | "claude" | "gemini") => {
    const messages = pane === "gpt" ? gptMessages : pane === "claude" ? claudeMessages : geminiMessages;
    const lastUserMsg = [...messages].reverse().find(m => m.sender === "user");
    if (!lastUserMsg) {
      alert("No prompt to refresh!");
      return;
    }

    try {
      const pName = pane === "gpt" ? "GPT-4o" : pane === "claude" ? "Claude 3.5" : "Gemini Pro";
      const results = await onExecuteMultiPane(lastUserMsg.text, [pName]);
      if (results[pName]) {
        if (pane === "gpt") setGptMessages(prev => [...prev, { sender: "ai", text: results[pName] }]);
        if (pane === "claude") setClaudeMessages(prev => [...prev, { sender: "ai", text: results[pName] }]);
        if (pane === "gemini") setGeminiMessages(prev => [...prev, { sender: "ai", text: results[pName] }]);
      }
    } catch (e) {
      alert("Refresh error!");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full min-w-0">
      
      {/* Top Header Controls */}
      <header className="flex justify-between items-center bg-surface-container/30 px-6 py-2 border-b border-white/5 rounded-xl shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-tertiary tracking-wider uppercase">
              System Status: Optimal
            </span>
          </div>
          <div className="flex gap-4">
            {(["models", "workspaces", "analysis"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-mono font-semibold uppercase tracking-wider border-b-2 cursor-pointer pb-1 transition-all ${
                  activeTab === tab
                    ? "text-on-surface border-tertiary"
                    : "text-on-surface-variant/40 hover:text-tertiary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-on-surface-variant/40 uppercase">ACTIVE CORES: 3/3</span>
        </div>
      </header>

      {/* Pane Columns Section */}
      <div className="flex-1 flex gap-3 p-3 overflow-hidden mb-20 select-none">
        
        {/* ChatGPT GPT-4o Column */}
        <section className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden group border border-white/5 hover:border-white/10 transition-colors">
          <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-white/2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#64FFDA] status-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-on-surface tracking-wider uppercase">GPT-4o</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
              <button onClick={() => refreshPane("gpt")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => alert("GPT Node settings configuration panel.")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <Settings size={12} />
              </button>
              <button onClick={() => clearPane("gpt")} className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {gptMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[85%] border text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-tertiary/10 border-tertiary/20 text-tertiary ml-auto"
                    : "bg-surface-container-high/40 border-white/5 text-on-surface"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Claude 3.5 Column */}
        <section className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden group border border-white/5 hover:border-white/10 transition-colors">
          <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-white/2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#D97757] status-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-on-surface tracking-wider uppercase">Claude 3.5</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
              <button onClick={() => refreshPane("claude")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => alert("Claude Node parameter mapping panel.")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <Settings size={12} />
              </button>
              <button onClick={() => clearPane("claude")} className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {claudeMessages.map((msg, idx) => {
              if (msg.isCode) {
                return (
                  <div
                    key={idx}
                    className="bg-black/60 rounded-lg p-3 border border-white/10 font-mono text-[11px] text-tertiary overflow-x-auto"
                  >
                    <span className="text-secondary">const</span> nexus = <span className="text-white">() =&gt; &#123;</span><br />
                    &nbsp;&nbsp;<span className="text-on-primary-container">// Neural bridge active</span><br />
                    &nbsp;&nbsp;<span className="text-secondary">return</span> <span className="text-white">"Synchronized";</span><br />
                    <span className="text-white">&#125;</span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-[85%] border text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-tertiary/10 border-tertiary/20 text-tertiary ml-auto"
                      : "bg-surface-container-high/40 border-white/5 text-on-surface"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gemini Pro Column */}
        <section className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden group border border-white/5 hover:border-white/10 transition-colors">
          <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-white/2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary status-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-on-surface tracking-wider uppercase">Gemini Pro</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
              <button onClick={() => refreshPane("gemini")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => alert("Gemini Node native integration settings.")} className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">
                <Settings size={12} />
              </button>
              <button onClick={() => clearPane("gemini")} className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {geminiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[85%] border text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-tertiary/10 border-tertiary/20 text-tertiary ml-auto"
                    : "bg-surface-container-high/40 border-white/5 text-on-surface"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Universal Bottom Input Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-4xl z-30 select-none">
        <form onSubmit={handleSendAll} className="glass-panel p-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 focus-within:ring-2 focus-within:ring-tertiary/20 transition-all">
          
          {/* Node Badge Stack */}
          <div className="flex -space-x-1.5 pl-3 shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#64FFDA] border border-surface flex items-center justify-center text-[8px] font-mono font-extrabold text-surface">
              G
            </div>
            <div className="w-5 h-5 rounded-full bg-[#D97757] border border-surface flex items-center justify-center text-[8px] font-mono font-extrabold text-surface">
              C
            </div>
            <div className="w-5 h-5 rounded-full bg-tertiary border border-surface flex items-center justify-center text-[8px] font-mono font-extrabold text-surface">
              G
            </div>
          </div>

          {/* Unified Input */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Distribute prompt to all active nodes..."
            className="flex-1 bg-transparent border-none text-xs text-on-surface focus:outline-none focus:ring-0 placeholder-on-surface-variant/40 outline-none px-1"
          />

          <div className="flex items-center gap-1 pr-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Attach full system files mapping...")}
              className="p-1.5 text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip size={14} />
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-tertiary text-on-tertiary p-2 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:scale-100"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </form>

        {/* Sync Statuses Sub-row */}
        <div className="flex justify-center gap-4 mt-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant/60 uppercase tracking-wider">Sync Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant/60 uppercase tracking-wider">Analysis Mode</span>
          </div>
        </div>
      </div>

    </div>
  );
}
