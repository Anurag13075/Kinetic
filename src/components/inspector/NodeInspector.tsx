"use client";

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { HttpMethod, HeaderPair } from '@/types';
import {
  X,
  Play,
  Copy,
  Check,
  Plus,
  Trash2,
  Code2,
  ListFilter,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  FileJson,
} from 'lucide-react';

export const NodeInspector: React.FC = () => {
  const {
    selectedNodeId,
    selectNode,
    nodes,
    updateNodeData,
    runSingleNode,
    isExecuting,
  } = useWorkflowStore();

  const node = nodes.find((n) => n.id === selectedNodeId);

  const [activeSubTab, setActiveSubTab] = useState<'params' | 'body' | 'vars' | 'asserts' | 'response'>('params');
  const [copiedResponse, setCopiedResponse] = useState(false);

  if (!node) return null;

  const handleCopyResponse = () => {
    if (!node.lastResponse?.body) return;
    navigator.clipboard.writeText(node.lastResponse.body);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const addHeader = () => {
    const updated = [...node.headers, { key: '', value: '', enabled: true }];
    updateNodeData(node.id, { headers: updated });
  };

  const updateHeader = (index: number, field: keyof HeaderPair, val: any) => {
    const updated = [...node.headers];
    updated[index] = { ...updated[index], [field]: val };
    updateNodeData(node.id, { headers: updated });
  };

  const deleteHeader = (index: number) => {
    const updated = node.headers.filter((_, i) => i !== index);
    updateNodeData(node.id, { headers: updated });
  };

  const addExtractor = () => {
    const updated = [
      ...node.extractors,
      { id: `ext-${Date.now()}`, variableName: 'new_var', path: 'body.id' },
    ];
    updateNodeData(node.id, { extractors: updated });
  };

  const deleteExtractor = (id: string) => {
    const updated = node.extractors.filter((e) => e.id !== id);
    updateNodeData(node.id, { extractors: updated });
  };

  const addAssertion = () => {
    const updated = [
      ...node.assertions,
      {
        id: `ass-${Date.now()}`,
        target: 'status' as const,
        operator: 'equals' as const,
        expected: '200',
      },
    ];
    updateNodeData(node.id, { assertions: updated });
  };

  const deleteAssertion = (id: string) => {
    const updated = node.assertions.filter((a) => a.id !== id);
    updateNodeData(node.id, { assertions: updated });
  };

  return (
    <aside className="w-96 border-l border-white/[0.08] bg-[#0c0d0e] flex flex-col h-full z-40 select-none shadow-2xl">
      {/* Inspector Top Bar */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNodeData(node.id, { name: e.target.value })}
            className="bg-transparent text-xs font-mono font-semibold text-white border-b border-transparent hover:border-zinc-700 focus:border-indigo-500 outline-none truncate"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => runSingleNode(node.id)}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Send</span>
          </button>
          <button
            onClick={() => selectNode(null)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Method & URL Input Bar */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-1.5">
          <select
            value={node.method}
            onChange={(e) =>
              updateNodeData(node.id, { method: e.target.value as HttpMethod })
            }
            className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs font-mono font-bold text-indigo-400 outline-none cursor-pointer"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={node.url}
            onChange={(e) => updateNodeData(node.id, { url: e.target.value })}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-zinc-200 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Inspector Sub-Tabs (Linear style) */}
      <div className="flex items-center border-b border-zinc-800/80 px-2 bg-zinc-950/40 text-[11px] font-mono">
        <button
          onClick={() => setActiveSubTab('params')}
          className={`px-2.5 py-2 border-b-2 transition-colors ${
            activeSubTab === 'params'
              ? 'border-indigo-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Headers ({node.headers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('body')}
          className={`px-2.5 py-2 border-b-2 transition-colors ${
            activeSubTab === 'body'
              ? 'border-indigo-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Body
        </button>

        <button
          onClick={() => setActiveSubTab('vars')}
          className={`px-2.5 py-2 border-b-2 transition-colors ${
            activeSubTab === 'vars'
              ? 'border-indigo-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Extract ({node.extractors.length})
        </button>

        <button
          onClick={() => setActiveSubTab('asserts')}
          className={`px-2.5 py-2 border-b-2 transition-colors ${
            activeSubTab === 'asserts'
              ? 'border-indigo-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Tests ({node.assertions.length})
        </button>

        <button
          onClick={() => setActiveSubTab('response')}
          className={`px-2.5 py-2 border-b-2 transition-colors ${
            activeSubTab === 'response'
              ? 'border-indigo-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Response
        </button>
      </div>

      {/* Inspector Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Headers Sub-Tab */}
        {activeSubTab === 'params' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-400">Request Headers</span>
              <button
                onClick={addHeader}
                className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3 h-3" />
                Add Header
              </button>
            </div>

            <div className="space-y-1.5">
              {node.headers.map((h, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                    className="accent-indigo-500 rounded"
                  />
                  <input
                    type="text"
                    value={h.key}
                    placeholder="Header Key"
                    onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                    className="w-1/2 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200 outline-none"
                  />
                  <input
                    type="text"
                    value={h.value}
                    placeholder="Value (or {{var}})"
                    onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200 outline-none"
                  />
                  <button
                    onClick={() => deleteHeader(idx)}
                    className="p-1 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Body Sub-Tab */}
        {activeSubTab === 'body' && (
          <div className="space-y-2 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-400">JSON Payload</span>
              <span className="text-[10px] font-mono text-zinc-500">Supports variables &#123;&#123;var&#125;&#125;</span>
            </div>
            <textarea
              value={node.body}
              onChange={(e) => updateNodeData(node.id, { body: e.target.value })}
              placeholder='{\n  "key": "value"\n}'
              rows={12}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-xs font-mono text-zinc-200 outline-none focus:border-indigo-500 resize-none font-mono code-editor"
            />
          </div>
        )}

        {/* Variable Extractors Sub-Tab */}
        {activeSubTab === 'vars' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-400">Save to Pipeline Variables</span>
              <button
                onClick={addExtractor}
                className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3 h-3" />
                Add Variable
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Extract fields from this response to inject into downstream request nodes via &#123;&#123;var_name&#125;&#125;.
            </p>

            <div className="space-y-2">
              {node.extractors.map((ext) => (
                <div key={ext.id} className="p-2 rounded border border-zinc-800/80 bg-zinc-900/60 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">Var Name:</span>
                    <input
                      type="text"
                      value={ext.variableName}
                      onChange={(e) => {
                        const updated = node.extractors.map((item) =>
                          item.id === ext.id ? { ...item, variableName: e.target.value } : item
                        );
                        updateNodeData(node.id, { extractors: updated });
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs font-mono text-indigo-300 outline-none"
                    />
                    <button
                      onClick={() => deleteExtractor(ext.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">JSON Path:</span>
                    <input
                      type="text"
                      value={ext.path}
                      placeholder="body.token or origin"
                      onChange={(e) => {
                        const updated = node.extractors.map((item) =>
                          item.id === ext.id ? { ...item, path: e.target.value } : item
                        );
                        updateNodeData(node.id, { extractors: updated });
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs font-mono text-zinc-300 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assertions / Tests Sub-Tab */}
        {activeSubTab === 'asserts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-400">Response Assertions</span>
              <button
                onClick={addAssertion}
                className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3 h-3" />
                Add Test
              </button>
            </div>

            <div className="space-y-2">
              {node.assertions.map((a) => (
                <div
                  key={a.id}
                  className={`p-2 rounded border text-xs font-mono flex items-center gap-2 ${
                    a.passed === true
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : a.passed === false
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {a.passed === true ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : a.passed === false ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 shrink-0" />
                  )}

                  <span className="font-semibold">{a.target}</span>
                  <span className="text-zinc-500">{a.operator}</span>
                  <input
                    type="text"
                    value={a.expected}
                    onChange={(e) => {
                      const updated = node.assertions.map((item) =>
                        item.id === a.id ? { ...item, expected: e.target.value } : item
                      );
                      updateNodeData(node.id, { assertions: updated });
                    }}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-center outline-none"
                  />
                  <button
                    onClick={() => deleteAssertion(a.id)}
                    className="ml-auto text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Sub-Tab */}
        {activeSubTab === 'response' && (
          <div className="space-y-3">
            {node.lastResponse ? (
              <>
                {/* Status Bar */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono">
                  <span
                    className={`font-bold ${
                      node.lastResponse.status >= 200 && node.lastResponse.status < 300
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {node.lastResponse.status} {node.lastResponse.statusText}
                  </span>

                  <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {node.lastResponse.latencyMs}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {node.lastResponse.sizeBytes} B
                    </span>
                  </div>
                </div>

                {/* Response Body with Copy */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">Body</span>
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
                    >
                      {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-300 overflow-x-auto max-h-80 code-editor">
                    {node.lastResponse.body}
                  </pre>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-xs font-mono">
                No response yet. Click "Send" or "Run Flow".
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
