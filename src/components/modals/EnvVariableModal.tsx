"use client";

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { X, Plus, Trash2, Sliders, Check } from 'lucide-react';

interface EnvVariableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvVariableModal: React.FC<EnvVariableModalProps> = ({ isOpen, onClose }) => {
  const { environment, environments, updateEnvironmentVar } = useWorkflowStore();

  const currentVars = environments[environment] || [];
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newKey.trim()) return;
    updateEnvironmentVar(environment, newKey.trim(), newVal.trim());
    setNewKey('');
    setNewVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0c0d0e] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Environment Variables: {environment}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Variables configured here can be referenced anywhere in URLs, Headers, and JSON bodies using &#123;&#123;VARIABLE_NAME&#125;&#125;.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentVars.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={v.key}
                  disabled
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-mono text-xs"
                />
                <input
                  type="text"
                  value={v.value}
                  onChange={(e) => updateEnvironmentVar(environment, v.key, e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-emerald-400 font-mono text-xs outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>

          {/* Add new variable */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="VARIABLE_NAME"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.toUpperCase())}
              className="w-1/2 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 outline-none text-xs"
            />
            <input
              type="text"
              placeholder="Value"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 outline-none text-xs"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
