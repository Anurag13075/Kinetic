"use client";

import React from 'react';
import { X, Play, Terminal, Flame, Cpu, ArrowRight, Layers, Key } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#0c0d0e] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>KINETIC · Developer Quickstart & Real API Testing Guide</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-zinc-300">
          {/* Step 1 */}
          <div className="space-y-1.5">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px]">
                1
              </span>
              How to Test Real APIs Right Now
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              The 3 nodes on your canvas are connected to real live endpoints on{' '}
              <span className="text-indigo-300">dummyjson.com</span>:
            </p>
            <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-1 pl-2">
              <li>
                <strong className="text-zinc-200">Node 1:</strong> Sends real POST login credentials, returns a real JWT token.
              </li>
              <li>
                <strong className="text-zinc-200">Node 2:</strong> Reads <code className="text-indigo-300">&#123;&#123;auth_token&#125;&#125;</code> and fetches the real user profile.
              </li>
              <li>
                <strong className="text-zinc-200">Node 3:</strong> Fetches the real cart items.
              </li>
            </ul>
            <p className="text-[11px] text-emerald-400">
              ➔ Hit <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white">Run Flow</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white">⌘ ↵</kbd>) to watch the real data flow!
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px]">
                2
              </span>
              Testing Your Own Custom API
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Click <strong className="text-zinc-200">"Add Node"</strong> or click any node to edit its URL in the inspector:
            </p>
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] space-y-1 text-zinc-400">
              <div>Try: <code className="text-emerald-400">GET https://api.github.com/users/octocat</code></div>
              <div>Try: <code className="text-emerald-400">GET https://pokeapi.co/api/v2/pokemon/ditto</code></div>
              <div>Or enter your own backend URL (FastAPI, Express, Supabase, etc.)</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-purple-600/30 text-purple-400 flex items-center justify-center text-[10px]">
                3
              </span>
              Import Any cURL in 1 Second
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Open Chrome DevTools on any website ➔ Network tab ➔ Right click any request ➔ <strong className="text-zinc-200">Copy as cURL</strong>. Then click <strong className="text-indigo-400">Import cURL</strong> in KINETIC to convert it into a visual node immediately.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-amber-600/30 text-amber-400 flex items-center justify-center text-[10px]">
                4
              </span>
              High-Concurrency Load Testing
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Switch to <strong className="text-zinc-200">Load Test Lab</strong> in the top bar. Pick your endpoint, set the virtual users (up to 250 VUs), and launch. Live Recharts curves plot real network p50/p95/p99 latency.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Keyboard shortcut: <kbd className="text-zinc-300">Esc</kbd> to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Start Testing
          </button>
        </div>
      </div>
    </div>
  );
};
