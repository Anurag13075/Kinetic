"use client";

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { X, Terminal, ArrowRight, Sparkles } from 'lucide-react';

interface CurlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_CURL = `curl -X POST https://api.stripe.com/v1/payment_intents \\
  -H "Authorization: Bearer sk_test_51Mz..." \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data "amount=2000&currency=usd"`;

export const CurlImportModal: React.FC<CurlImportModalProps> = ({ isOpen, onClose }) => {
  const { importCurl, setActiveTab } = useWorkflowStore();
  const [curlText, setCurlText] = useState(SAMPLE_CURL);

  if (!isOpen) return null;

  const handleImport = () => {
    if (!curlText.trim()) return;
    importCurl(curlText);
    setActiveTab('canvas');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#0c0d0e] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Import cURL Command</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3">
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Paste a cURL command copied from Chrome DevTools, Postman, or API documentation. It will be automatically parsed into an executable node on your visual canvas.
          </p>

          <textarea
            value={curlText}
            onChange={(e) => setCurlText(e.target.value)}
            rows={7}
            placeholder="curl -X POST https://api.example.com/v1/data ..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-xs resize-none code-editor"
          />

          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Supports headers, query parameters, auth tokens, and JSON payloads.</span>
            <button
              onClick={() => setCurlText(SAMPLE_CURL)}
              className="text-indigo-400 hover:underline"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
          >
            <span>Generate Canvas Node</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
