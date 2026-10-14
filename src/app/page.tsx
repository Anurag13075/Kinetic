"use client";

import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { LandingPage } from '@/components/landing/LandingPage';
import { Header } from '@/components/layout/Header';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { LoadTestLab } from '@/components/loadtest/LoadTestLab';
import { AiFuzzer } from '@/components/aifuzzer/AiFuzzer';
import { CurlImportModal } from '@/components/modals/CurlImportModal';
import { EnvVariableModal } from '@/components/modals/EnvVariableModal';

export default function KineticHome() {
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');

  const {
    activeTab,
    selectedNodeId,
    selectNode,
    runEntirePipeline,
  } = useWorkflowStore();

  const [isCurlModalOpen, setIsCurlModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter -> Run Pipeline
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (viewMode === 'studio') {
          runEntirePipeline();
        } else {
          setViewMode('studio');
        }
      }

      // Escape -> Deselect node or close modals
      if (e.key === 'Escape') {
        selectNode(null);
        setIsCurlModalOpen(false);
        setIsEnvModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runEntirePipeline, selectNode, viewMode]);

  // If in landing page mode, render the high-impact conversion landing page
  if (viewMode === 'landing') {
    return <LandingPage onLaunchStudio={() => setViewMode('studio')} />;
  }

  // Otherwise, render the active Studio Workspace
  return (
    <main className="w-screen h-screen flex flex-col bg-[#09090b] overflow-hidden select-none">
      {/* Top Header Bar with Back-to-Landing */}
      <Header
        onOpenCurlModal={() => setIsCurlModalOpen(true)}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
        onBackToLanding={() => setViewMode('landing')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'canvas' && (
          <>
            {/* Visual Node Workflow Canvas */}
            <div className="flex-1 h-full relative">
              <WorkflowCanvas />
            </div>

            {/* Sliding Right Node Inspector */}
            {selectedNodeId && <NodeInspector />}
          </>
        )}

        {activeTab === 'load-test' && <LoadTestLab />}

        {activeTab === 'ai-fuzzer' && <AiFuzzer />}
      </div>

      {/* Modals */}
      <CurlImportModal
        isOpen={isCurlModalOpen}
        onClose={() => setIsCurlModalOpen(false)}
      />

      <EnvVariableModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
      />
    </main>
  );
}
