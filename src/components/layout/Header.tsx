"use client";

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import {
  Play,
  RotateCcw,
  Plus,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  FileCode2,
  ChevronDown,
  Globe,
  Sliders,
} from 'lucide-react';

interface HeaderProps {
  onOpenCurlModal: () => void;
  onOpenEnvModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCurlModal, onOpenEnvModal }) => {
  const {
    activeTab,
    setActiveTab,
    isExecuting,
    runEntirePipeline,
    resetPipelineStatus,
    addNode,
    environment,
    setEnvironment,
    environments,
  } = useWorkflowStore();

  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-50 relative">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white font-mono">
            KINETIC
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
            v1.0.4
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* Environment Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setEnvDropdownOpen(!envDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-zinc-800 transition-colors"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{environment}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {envDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1 z-50">
              {Object.keys(environments).map((env) => (
                <button
                  key={env}
                  onClick={() => {
                    setEnvironment(env);
                    setEnvDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                    env === environment
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {env}
                </button>
              ))}
              <div className="h-px bg-zinc-800 my-1" />
              <button
                onClick={() => {
                  setEnvDropdownOpen(false);
                  onOpenEnvModal();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5"
              >
                <Sliders className="w-3 h-3" />
                Manage Variables...
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Navigation Tabs (Linear Grade) */}
      <nav className="flex items-center p-1 rounded-lg bg-zinc-900/80 border border-white/[0.06]">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'canvas'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Workflow Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('load-test')}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'load-test'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Load Test Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-fuzzer')}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'ai-fuzzer'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Edge Fuzzer</span>
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCurlModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/80 border border-zinc-800 transition-colors"
          title="Import from cURL command"
        >
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span>Import cURL</span>
        </button>

        <button
          onClick={() => addNode('http')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/80 border border-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-400" />
          <span>Add Node</span>
        </button>

        <div className="h-4 w-px bg-zinc-800 mx-1" />

        <button
          onClick={resetPipelineStatus}
          disabled={isExecuting}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent hover:border-zinc-800 transition-colors disabled:opacity-50"
          title="Reset Pipeline Status"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Primary Run Button */}
        <button
          onClick={runEntirePipeline}
          disabled={isExecuting}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all shadow-sm ${
            isExecuting
              ? 'bg-indigo-600/40 text-indigo-200 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-pulse' : ''}`} />
          <span>{isExecuting ? 'Executing...' : 'Run Flow'}</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-indigo-700/60 px-1 rounded text-indigo-200">
            ⌘↵
          </kbd>
        </button>
      </div>
    </header>
  );
};
