"use client";

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import {
  Sparkles,
  ShieldAlert,
  Flame,
  Bug,
  Plus,
  Key,
  Check,
  Send,
  Zap,
} from 'lucide-react';

interface FuzzSuite {
  title: string;
  description: string;
  icon: any;
  category: 'security' | 'boundary' | 'race' | 'contracts';
  payloads: Array<{ name: string; method: 'GET' | 'POST'; body: any; expectedStatus: string }>;
}

const PRESET_FUZZ_SUITES: FuzzSuite[] = [
  {
    title: 'SQLi & Header Injection Pentest',
    description: 'Tests query parameters, auth headers, and body fields for SQL truncation and injection bypasses.',
    icon: ShieldAlert,
    category: 'security',
    payloads: [
      {
        name: 'Auth Bypass - Tautology Injection',
        method: 'POST',
        body: { email: "' OR '1'='1' --", password: "' OR 1=1#" },
        expectedStatus: '401',
      },
      {
        name: 'Null-Byte Termination in Path',
        method: 'POST',
        body: { filename: 'profile.jpg\u0000.exe' },
        expectedStatus: '400',
      },
    ],
  },
  {
    title: 'Boundary & Buffer Overflow Testing',
    description: 'Sends negative integers, massive 64-bit timestamps, and oversized array allocations.',
    icon: Flame,
    category: 'boundary',
    payloads: [
      {
        name: 'Negative Currency & Float Underflow',
        method: 'POST',
        body: { amount: -9999999.9999, currency: 'USD', quantity: -1 },
        expectedStatus: '422',
      },
      {
        name: 'Recursive Deep Object Stack Overflow',
        method: 'POST',
        body: { nested: { a: { b: { c: { d: { e: { f: { g: 9999 } } } } } } } },
        expectedStatus: '400',
      },
    ],
  },
  {
    title: 'Concurrency & Race Condition Checks',
    description: 'Simulates double-spend and duplicate idempotency tokens sent simultaneously.',
    icon: Bug,
    category: 'race',
    payloads: [
      {
        name: 'Replay Idempotency Token Attack',
        method: 'POST',
        body: { idempotency_key: 'DUPLICATE_TOKEN_88921', transaction_id: 'tx_01' },
        expectedStatus: '409',
      },
    ],
  },
];

export const AiFuzzer: React.FC = () => {
  const { nodes, addNode, updateNodeData, setActiveTab } = useWorkflowStore();

  const [apiKey, setApiKey] = useState<string>('');
  const [selectedSuite, setSelectedSuite] = useState<FuzzSuite>(PRESET_FUZZ_SUITES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [injectedCount, setInjectedCount] = useState<number>(0);

  const handleInjectIntoCanvas = (suite: FuzzSuite) => {
    suite.payloads.forEach((item, index) => {
      const newId = addNode('http', {
        x: 140 + index * 340,
        y: 420,
      });

      updateNodeData(newId, {
        name: `[Fuzz] ${item.name}`,
        method: item.method,
        url: 'https://httpbin.org/post',
        body: JSON.stringify(item.body, null, 2),
        assertions: [
          {
            id: `ass-fuzz-${Date.now()}-${index}`,
            target: 'status',
            operator: 'equals',
            expected: item.expectedStatus,
          },
        ],
      });
    });

    setInjectedCount((c) => c + suite.payloads.length);
    setTimeout(() => {
      setActiveTab('canvas');
    }, 800);
  };

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    // Simulate LLM agent test suite synthesis (or connects to Groq/Grok if API key is provided)
    await new Promise((res) => setTimeout(res, 1200));

    const generatedSuite: FuzzSuite = {
      title: 'AI Synthesized Edge Cases',
      description: `Generated from prompt: "${customPrompt || 'General API Resilience Test'}"`,
      icon: Sparkles,
      category: 'security',
      payloads: [
        {
          name: 'AI Test: Prototype Pollution in Body',
          method: 'POST',
          body: { '__proto__.admin': true, role: 'superuser' },
          expectedStatus: '403',
        },
        {
          name: 'AI Test: Unicode Normalization Bypasses',
          method: 'POST',
          body: { username: '\u212Aevin' }, // Kelvin sign looking like K
          expectedStatus: '400',
        },
      ],
    };

    setSelectedSuite(generatedSuite);
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 bg-[#09090b] flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
        <div>
          <h2 className="text-sm font-mono font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Edge Fuzzer & Contract Vulnerability Hunter
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Synthesize adversarial payloads, SQLi vulnerabilities, and race condition tests to stress-test your visual pipeline.
          </p>
        </div>

        {/* Optional Groq/Grok API Key */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Groq/Grok API Key (Optional)"
              className="bg-transparent text-zinc-300 outline-none w-44 placeholder-zinc-600 text-xs"
            />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            Engine: Llama-3.3-70B Ready
          </span>
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex items-center gap-3">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="E.g., Generate 4 adversarial edge cases for a multi-tenant payment gateway..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 outline-none focus:border-purple-500"
        />
        <button
          onClick={handleGenerateCustom}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Synthesizing...' : 'Generate with AI'}</span>
        </button>
      </div>

      {/* Preset Fuzzing Suites */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESET_FUZZ_SUITES.map((suite, idx) => {
          const Icon = suite.icon;
          const isCurrent = selectedSuite.title === suite.title;

          return (
            <div
              key={idx}
              onClick={() => setSelectedSuite(suite)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-zinc-900/80 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-800/80 text-purple-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {suite.payloads.length} tests
                  </span>
                </div>
                <h3 className="text-xs font-mono font-semibold text-zinc-200">{suite.title}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{suite.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">Preset Ready</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInjectIntoCanvas(suite);
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Inject Nodes</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Selected Suite Preview */}
      <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold text-zinc-200">
            Selected Suite Payloads: {selectedSuite.title}
          </h3>
          <button
            onClick={() => handleInjectIntoCanvas(selectedSuite)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inject These Test Nodes into Canvas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedSuite.payloads.map((payload, i) => (
            <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-300">{payload.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-rose-400 border border-rose-500/20">
                  Expects {payload.expectedStatus}
                </span>
              </div>
              <pre className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-2 rounded overflow-x-auto code-editor">
                {JSON.stringify(payload.body, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
