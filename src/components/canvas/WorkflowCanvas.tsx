"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { ApiNodeCard } from './ApiNodeCard';
import { ZoomIn, ZoomOut, Maximize2, MousePointer, Plus } from 'lucide-react';

export const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectNode,
    updateNodePosition,
    addEdge,
    deleteEdge,
    addNode,
    isExecuting,
    activeExecutionNodeId,
  } = useWorkflowStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport pan & zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging a node
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Connecting cable between nodes
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Canvas Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or space+click or clicking empty canvas initiates pan
    if (e.button === 1 || e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-grid')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      selectNode(null);
    }
  };

  // Canvas Mouse Move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Panning canvas
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      // Dragging node
      if (draggedNodeId) {
        const newX = Math.round((e.clientX - pan.x) / zoom - dragOffset.x);
        const newY = Math.round((e.clientY - pan.y) / zoom - dragOffset.y);
        updateNodePosition(draggedNodeId, newX, newY);
      }

      // Connecting cable preview
      if (connectingFromId && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - pan.x) / zoom,
          y: (e.clientY - rect.top - pan.y) / zoom,
        });
      }
    },
    [isPanning, panStart, draggedNodeId, pan, zoom, dragOffset, updateNodePosition, connectingFromId]
  );

  // Canvas Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  // Start connecting from output port
  const handleStartConnect = (nodeId: string) => {
    setConnectingFromId(nodeId);
  };

  // Click on a node while connecting completes the edge
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingFromId && connectingFromId !== nodeId) {
      addEdge(connectingFromId, nodeId);
      setConnectingFromId(null);
    } else {
      selectNode(nodeId);
    }
  };

  // Start dragging a node from its header
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggedNodeId(nodeId);
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - node.position.x,
      y: (e.clientY - pan.y) / zoom - node.position.y,
    });
  };

  // Zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 2.0);
    setZoom(newZoom);
  };

  // Calculate Bezier Curve between two points
  const calculateBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden canvas-grid cursor-grab active:cursor-grabbing select-none"
    >
      {/* Transformable Canvas Content Layer */}
      <div
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* SVG Cable Connection Layer */}
        <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Render Existing Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.fromNodeId);
            const toNode = nodes.find((n) => n.id === edge.toNodeId);
            if (!fromNode || !toNode) return null;

            // Port coordinates: fromNode right-center (w=320), toNode left-center
            const x1 = fromNode.position.x + 320;
            const y1 = fromNode.position.y + 60;
            const x2 = toNode.position.x;
            const y2 = toNode.position.y + 60;

            const path = calculateBezier(x1, y1, x2, y2);
            const isActive = isExecuting && activeExecutionNodeId === edge.toNodeId;

            return (
              <g key={edge.id} className="pointer-events-auto group">
                {/* Background thicker hit-area */}
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  className="cursor-pointer"
                  onClick={() => deleteEdge(edge.id)}
                />
                {/* Visual cable */}
                <path
                  d={path}
                  fill="none"
                  stroke={isActive ? 'url(#activeGradient)' : '#3f3f46'}
                  strokeWidth={2}
                  className={`transition-colors group-hover:stroke-rose-400 ${
                    isActive ? 'animate-cable stroke-indigo-400 stroke-[3]' : ''
                  }`}
                />
              </g>
            );
          })}

          {/* In-progress connecting cable */}
          {connectingFromId && (
            (() => {
              const fromNode = nodes.find((n) => n.id === connectingFromId);
              if (!fromNode) return null;
              const x1 = fromNode.position.x + 320;
              const y1 = fromNode.position.y + 60;
              const path = calculateBezier(x1, y1, mousePos.x, mousePos.y);

              return (
                <path
                  d={path}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              );
            })()
          )}
        </svg>

        {/* Node Cards Layer */}
        <div className="absolute inset-0 pointer-events-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onClick={(e) => handleNodeClick(node.id, e)}
            >
              <ApiNodeCard
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={() => selectNode(node.id)}
                onStartConnect={handleStartConnect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Canvas Controls (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-40 flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-md text-zinc-400 text-xs font-mono">
        <button
          onClick={() => setZoom(Math.min(zoom + 0.15, 2.0))}
          className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 0.15, 0.4))}
          className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div className="h-3 w-px bg-zinc-800 mx-1" />
        <span className="px-1 text-[11px] text-zinc-500">
          {Math.round(zoom * 100)}%
        </span>
        <div className="h-3 w-px bg-zinc-800 mx-1" />
        <span className="px-1 text-[11px] text-zinc-500">
          {nodes.length} nodes · {edges.length} cables
        </span>
      </div>

      {/* Connection Help Toast */}
      {connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600/90 text-white text-xs font-mono px-3 py-1.5 rounded-full shadow-lg border border-indigo-400/40 animate-pulse flex items-center gap-2">
          <span>Click target node to connect cable</span>
          <button
            onClick={() => setConnectingFromId(null)}
            className="hover:underline text-indigo-200"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
