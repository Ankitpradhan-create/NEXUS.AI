import React from "react";
import { MainView } from "../types";
import { History, Brain, LayoutGrid, Settings, HelpCircle, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: MainView;
  onViewChange: (view: MainView) => void;
  profileName: string;
  profileTier: string;
  avatarUrl: string;
}

export default function Sidebar({
  currentView,
  onViewChange,
  profileName,
  profileTier,
  avatarUrl
}: SidebarProps) {
  const menuItems = [
    { view: MainView.History, label: "History", icon: History },
    { view: MainView.Models, label: "Models", icon: Brain },
    { view: MainView.Workspace, label: "Workspace", icon: LayoutGrid },
    { view: MainView.Settings, label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container-low border-r border-white/10 backdrop-blur-xl py-6 select-none z-40 shrink-0">
      <div className="px-6 mb-8">
        <h1 className="font-display text-2xl font-extrabold text-on-surface tracking-tight bg-gradient-to-r from-on-surface to-tertiary bg-clip-text text-transparent">
          Nexus AI
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 mt-1 font-mono">
          Command Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "text-tertiary bg-tertiary/5 border-r-2 border-tertiary"
                  : "text-on-surface-variant/70 hover:bg-surface-variant/40 hover:text-on-surface"
              }`}
            >
              <IconComponent size={18} className={isActive ? "stroke-tertiary" : "stroke-current"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Elements */}
      <div className="px-3 py-4 space-y-1 border-t border-white/5">
        <button
          onClick={() => onViewChange(MainView.Help)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
            currentView === MainView.Help
              ? "text-tertiary bg-tertiary/5 border-r-2 border-tertiary"
              : "text-on-surface-variant/70 hover:bg-surface-variant/40 hover:text-on-surface"
          }`}
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>

        <button
          onClick={() => alert("Session logout simulation. Click OK to refresh.")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        {/* User Card */}
        <div className="mt-4 px-4 py-2 flex items-center gap-3 border-t border-white/5 pt-4">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-tertiary/30 shrink-0">
            <img
              src={avatarUrl}
              alt={profileName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">{profileName}</span>
            <span className="text-[10px] text-on-surface-variant/70 font-mono">{profileTier}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
