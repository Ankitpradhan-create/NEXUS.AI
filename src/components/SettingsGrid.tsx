import React, { useState } from "react";
import { ApiProvider, FineTuneJob } from "../types";
import { Sliders, Key, Settings as SettingsIcon, ShieldAlert, Plus, MoreHorizontal, FlaskConical, Play, CheckCircle, Info, RefreshCw, X, Check, Trash2 } from "lucide-react";

interface SettingsGridProps {
  profileName: string;
  onProfileNameChange: (name: string) => void;
  providers: ApiProvider[];
  onAddProvider: (p: ApiProvider) => void;
  onDeleteProvider: (id: string) => void;
  fineTuneJobs: FineTuneJob[];
  onCreateFineTune: (job: FineTuneJob) => void;
}

export default function SettingsGrid({
  profileName,
  onProfileNameChange,
  providers,
  onAddProvider,
  onDeleteProvider,
  fineTuneJobs,
  onCreateFineTune
}: SettingsGridProps) {
  const [activeTab, setActiveTab] = useState<"general" | "billing" | "api">("general");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [email, setEmail] = useState("alex.r@nexus.ai");
  const [timezone, setTimezone] = useState("UTC -05:00");

  // State for Add Provider Form
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvName, setNewProvName] = useState("");
  const [newProvKey, setNewProvKey] = useState("");
  const [newProvLimit, setNewProvLimit] = useState("500");

  // State for Create FineTune Job Form
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobBase, setJobBase] = useState("Claude 3.5 Sonnet");
  const [jobDataset, setJobDataset] = useState("1.5k clean chat arrays");

  const saveProfile = () => {
    onProfileNameChange(tempName);
    setIsEditingProfile(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim()) return;

    onCreateFineTune({
      id: Math.random().toString(),
      name: jobName,
      baseModel: jobBase,
      status: "Processing",
      trainingSet: jobDataset,
      progress: 0,
      estimated: "15m remaining"
    });

    setJobName("");
    setShowCreateJob(false);
  };

  const handleAddProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim() || !newProvKey.trim()) return;

    onAddProvider({
      id: Math.random().toString(),
      name: newProvName,
      code: newProvName.substring(0, 2).toUpperCase(),
      status: "Active",
      keyIdentifier: `${newProvName.toLowerCase().substring(0, 3)}-api-••••••••${newProvKey.substring(newProvKey.length - 4)}`,
      limitTotal: parseFloat(newProvLimit) || 1000,
      limitUsed: 0
    });

    setNewProvName("");
    setNewProvKey("");
    setNewProvLimit("500");
    setShowAddProvider(false);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full min-w-0">
      
      {/* Settings Top Header Nav */}
      <header className="flex justify-between items-center bg-surface-container/30 px-6 py-2 border-b border-white/5 rounded-xl shrink-0 select-none">
        <div className="flex items-center gap-8">
          <span className="text-sm font-bold text-on-surface font-display">Settings</span>
          <div className="flex gap-6">
            {(["general", "billing", "api"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-mono font-semibold uppercase tracking-wider border-b-2 cursor-pointer pb-1 transition-all ${
                  activeTab === tab ? "text-on-surface border-tertiary" : "text-on-surface-variant/45 hover:text-tertiary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div>
          <button
            onClick={() => alert("All system configuration parameters saved to secure storage!")}
            className="bg-tertiary hover:brightness-110 active:scale-95 text-on-tertiary text-xs font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer select-none"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-none">
        <div className="grid grid-cols-12 gap-3">
          
          {/* USER PROFILE CARD */}
          <div className="col-span-12 lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-tertiary">
                <img
                  src="https://picsum.photos/seed/rivera/300/300"
                  alt="Alex Rivera"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="absolute bottom-0 right-0 bg-surface-container-highest p-1.5 rounded-full border border-white/10 hover:border-tertiary/40 transition-colors cursor-pointer text-on-surface"
              >
                <Sliders size={12} />
              </button>
            </div>

            {isEditingProfile ? (
              <div className="w-full space-y-2 mb-4 text-left">
                <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Full Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-surface-container-highest/50 border border-white/10 rounded px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
                <div className="flex gap-1.5 justify-end mt-1.5">
                  <button onClick={() => setIsEditingProfile(false)} className="px-2 py-1 border border-white/10 text-[10px] rounded text-on-surface hover:bg-white/5 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={saveProfile} className="px-2.5 py-1 bg-tertiary text-on-tertiary text-[10px] rounded font-bold hover:brightness-110 cursor-pointer">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-on-surface font-display">{profileName}</h2>
                <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest mt-0.5">
                  Master Orchestrator
                </p>
              </>
            )}

            <div className="w-full space-y-3.5 text-left border-t border-white/5 pt-6 mt-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70 font-medium">Email</span>
                <span className="text-on-surface">{email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70 font-medium">Account Type</span>
                <span className="text-tertiary font-mono text-[9px] font-bold border border-tertiary/20 px-2 py-0.5 rounded uppercase tracking-wider bg-tertiary/5">
                  Enterprise
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70 font-medium">Timezone</span>
                <span className="text-on-surface">{timezone}</span>
              </div>
            </div>
          </div>

          {/* USAGE TRACKING MODULE */}
          <div className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface font-display">
                <span className="text-tertiary">
                  <Sliders size={16} />
                </span>
                Usage Analytics
              </h3>
              <select className="bg-surface-container-highest/40 border border-white/5 text-on-surface text-[10px] font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-tertiary cursor-pointer">
                <option>Current Month</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>

            {/* Metric widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-surface-container-low/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider">Total Spent</p>
                  <p className="text-lg font-bold text-on-surface mt-1 font-display">$1,240.42</p>
                </div>
                <div className="mt-2 text-[9px] text-tertiary flex items-center gap-1 font-mono">
                  <span>▲ 12% vs last month</span>
                </div>
              </div>

              <div className="bg-surface-container-low/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider">Tokens Used</p>
                  <p className="text-lg font-bold text-on-surface mt-1 font-display">14.2M</p>
                </div>
                <div className="mt-2 h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-3/4"></div>
                </div>
              </div>

              <div className="bg-surface-container-low/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider">Active Fine-tunes</p>
                  <p className="text-lg font-bold text-on-surface mt-1 font-display">04</p>
                </div>
                <p className="mt-2 text-[9px] text-on-surface-variant/60 font-mono">Capacity: 10 models</p>
              </div>
            </div>

            {/* Custom chart placeholder with CSS */}
            <div className="h-24 w-full flex items-end gap-1 px-1 pt-2 select-none border-t border-white/5">
              {[40, 60, 30, 80, 95, 55, 45, 70, 65, 40, 90, 100].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-tertiary/15 hover:bg-tertiary/45 hover:glow-tertiary border-t border-tertiary/30 hover:border-tertiary rounded-t-xs transition-all duration-150 cursor-pointer"
                ></div>
              ))}
            </div>
          </div>

          {/* API KEY MANAGEMENT (ORCHESTRATION) */}
          <div className="col-span-12 glass-panel rounded-xl overflow-hidden">
            <div className="border-b border-white/5 px-6 py-4 flex justify-between items-center bg-surface-container-highest/25">
              <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface font-display">
                <Key size={14} className="text-tertiary" />
                API Orchestration
              </h3>
              <button
                onClick={() => setShowAddProvider(!showAddProvider)}
                className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-tertiary hover:opacity-85 transition-all cursor-pointer"
              >
                <Plus size={12} /> Add New Provider
              </button>
            </div>

            {/* Add Provider form overlay/inline */}
            {showAddProvider && (
              <form onSubmit={handleAddProviderSubmit} className="p-4 bg-surface-container-low/60 border-b border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Provider Name</label>
                  <input
                    type="text"
                    required
                    value={newProvName}
                    onChange={(e) => setNewProvName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface"
                    placeholder="e.g. OpenAI"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-on-surface-variant uppercase">API Secret Key</label>
                  <input
                    type="password"
                    required
                    value={newProvKey}
                    onChange={(e) => setNewProvKey(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface"
                    placeholder="sk-proj-..."
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="space-y-1 flex-1">
                    <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Monthly Limit ($)</label>
                    <input
                      type="number"
                      value={newProvLimit}
                      onChange={(e) => setNewProvLimit(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface"
                    />
                  </div>
                  <button type="submit" className="bg-tertiary text-on-tertiary px-3.5 py-1.5 rounded font-bold text-xs cursor-pointer">
                    <Check size={14} />
                  </button>
                  <button type="button" onClick={() => setShowAddProvider(false)} className="bg-white/5 text-on-surface px-3.5 py-1.5 rounded text-xs cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-on-surface-variant/70 font-mono text-[9px] uppercase tracking-wider bg-white/2 border-b border-white/5">
                    <th className="px-6 py-3 font-semibold">Provider</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Key Identifier</th>
                    <th className="px-6 py-3 font-semibold">Monthly Limit</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold text-[10px] border border-white/5 font-mono">
                          {p.code}
                        </div>
                        <span className="font-semibold text-on-surface">{p.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === "Active"
                                ? "bg-tertiary animate-pulse"
                                : p.status === "Quota Exceeded"
                                ? "bg-red-400"
                                : "bg-white/30"
                            }`}
                          ></span>
                          <span className="text-[11px] font-mono">{p.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-on-surface-variant/70 select-text">
                        {p.keyIdentifier}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-[11px] ${p.status === "Quota Exceeded" ? "text-red-400 font-bold" : "text-on-surface-variant"}`}>
                          ${p.limitUsed.toFixed(2)} / ${p.limitTotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove provider ${p.name}?`)) onDeleteProvider(p.id);
                          }}
                          className="text-on-surface-variant hover:text-red-400 p-1.5 rounded transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODEL FORGE (FINE-TUNING) */}
          <div className="col-span-12 glass-panel p-6 rounded-xl shimmer relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface font-display">
                  <FlaskConical size={16} className="text-tertiary" />
                  Model Forge (Fine-tuning)
                </h3>
                <p className="text-on-surface-variant/70 text-xs mt-0.5">
                  Manage and train custom parameters for specific domain expertise.
                </p>
              </div>
              <button
                onClick={() => setShowCreateJob(!showCreateJob)}
                className="bg-surface-container-highest/60 hover:bg-surface-container-highest border border-tertiary/30 text-tertiary hover:border-tertiary px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer"
              >
                Create New Forge Job
              </button>
            </div>

            {/* Create Job Form Dialog */}
            {showCreateJob && (
              <form onSubmit={handleCreateJob} className="p-4 bg-surface-container-low border border-white/5 rounded-xl mb-4 space-y-4">
                <h4 className="text-xs font-bold text-on-surface font-display">Spin up training parameter loop</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Job Identifier</label>
                    <input
                      type="text"
                      required
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface"
                      placeholder="e.g. Legal_Advisor_V3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Base Model Core</label>
                    <select
                      value={jobBase}
                      onChange={(e) => setJobBase(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface cursor-pointer"
                    >
                      <option>Claude 3.5 Sonnet</option>
                      <option>GPT-4o</option>
                      <option>Gemini Pro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-on-surface-variant uppercase">Dataset Package</label>
                    <input
                      type="text"
                      value={jobDataset}
                      onChange={(e) => setJobDataset(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/10 rounded p-1.5 text-xs text-on-surface"
                      placeholder="e.g. 4.2k clean arrays"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowCreateJob(false)} className="px-3 py-1.5 border border-white/10 text-xs rounded text-on-surface hover:bg-white/5 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-tertiary text-on-tertiary text-xs rounded font-bold hover:brightness-110 cursor-pointer">
                    Launch Loop
                  </button>
                </div>
              </form>
            )}

            {/* Job Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fineTuneJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-container-low/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-tertiary/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">{job.name}</h4>
                      <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-wider">
                        Base: {job.baseModel}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                        job.status === "Completed"
                          ? "bg-tertiary/10 text-tertiary border border-tertiary/20"
                          : "bg-secondary-container/30 text-secondary border border-secondary-container/50"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/70">
                      <span>Training Set: {job.trainingSet}</span>
                      {job.status === "Completed" ? (
                        <span>Loss: {job.loss}</span>
                      ) : (
                        <span>Progress: {job.progress}%</span>
                      )}
                    </div>

                    {job.status === "Processing" && (
                      <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary animate-pulse"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {job.status === "Completed" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert(`Launching visual comparative analysis with ${job.name}`)}
                          className="flex-1 py-1.5 bg-surface-container-high/40 hover:bg-surface-container-high border border-white/5 rounded text-[10px] font-mono uppercase font-semibold text-on-surface transition-colors cursor-pointer"
                        >
                          Test
                        </button>
                        <button
                          onClick={() => alert(`Deploying fine-tuned weight parameters of ${job.name}`)}
                          className="flex-1 py-1.5 bg-surface-container-high/40 hover:bg-surface-container-high border border-white/5 rounded text-[10px] font-mono uppercase font-semibold text-on-surface transition-colors cursor-pointer"
                        >
                          Deploy
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant/60">
                        <span>{job.estimated}</span>
                        <button
                          type="button"
                          onClick={() => alert("Training job cancelled.")}
                          className="text-red-400 hover:underline cursor-pointer"
                        >
                          Cancel Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
