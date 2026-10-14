"use client";

import React from 'react';
import { WorkflowNode, HttpMethod } from '@/types';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import {
  Play,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Link2,
} from 'lucide-react';

interface ApiNodeCardProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onStartConnect: (nodeId: string) => void;
}

const METHOD_STYLES: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  POST: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  PUT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  PATCH: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  DELETE: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
};

export const ApiNodeCard: React.FC<ApiNodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onStartConnect,
}) => {
  const { runSingleNode, deleteNode, duplicateNode, isExecuting } = useWorkflowStore();

  const methodStyle = METHOD_STYLES[node.method] || METHOD_STYLES.GET;

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    runSingleNode(node.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(node.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(node.id);
  };

  return (
    <div
      onClick={onSelect}
      style={{
        transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
      }}
      className={`absolute w-80 rounded-lg bg-[#0c0d0e]/95 border transition-all duration-150 select-none cursor-pointer group shadow-2xl ${
        isSelected
          ? 'border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
          : 'border-zinc-800/80 hover:border-zinc-700/80 hover:bg-[#111114]'
      }`}
    >
      {/* Input Port (Left Handle) */}
      <div
        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 hover:border-indigo-400 hover:scale-125 transition-all cursor-crosshair z-10"
        title="Input Connection Port"
      />

      {/* Output Port (Right Handle) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect(node.id);
        }}
        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 hover:border-indigo-400 hover:scale-125 transition-all cursor-crosshair z-10"
        title="Click to Connect Cable to Another Node"
      />

      {/* Node Header */}
      <div className="px-3.5 py-2.5 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/* Status Indicator */}
          <span className="relative flex h-2 w-2">
            {node.status === 'running' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                node.status === 'success'
                  ? 'bg-emerald-400'
                  : node.status === 'error'
                  ? 'bg-rose-500'
                  : node.status === 'running'
                  ? 'bg-amber-400'
                  : 'bg-zinc-600'
              }`}
            />
          </span>

          <span className="font-mono text-xs font-medium text-zinc-300 truncate">
            {node.name}
          </span>
        </div>

        {/* Quick Node Actions */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
            title="Execute this single node"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Duplicate node"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Node Content Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Method & URL */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${methodStyle.bg} ${methodStyle.text} ${methodStyle.border}`}
          >
            {node.method}
          </span>
          <div className="font-mono text-xs text-zinc-400 truncate flex-1 tracking-tight" title={node.url}>
            {node.url.replace(/\{\{([\w_]+)\}\}/g, '$1')}
          </div>
        </div>

        {/* Metadata badges (Headers, Extractors, Assertions) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
          {node.extractors.length > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Link2 className="w-2.5 h-2.5" />
              <span>{node.extractors.length} var</span>
            </span>
          )}

          {node.assertions.length > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              <span>{node.assertions.length} asserts</span>
            </span>
          )}

          {node.authType !== 'none' && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              auth: {node.authType}
            </span>
          )}
        </div>

        {/* Last Response Telemetry */}
        {node.lastResponse && (
          <div className="mt-2 pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold ${
                  node.lastResponse.status >= 200 && node.lastResponse.status < 300
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {node.lastResponse.status} {node.lastResponse.statusText}
              </span>
            </div>

            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>{node.lastResponse.latencyMs}ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
