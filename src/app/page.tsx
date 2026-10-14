"use client";

import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Header } from '@/components/layout/Header';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { LoadTestLab } from '@/components/loadtest/LoadTestLab';
import { AiFuzzer } from '@/components/aifuzzer/AiFuzzer';
import { CurlImportModal } from '@/components/modals/CurlImportModal';
import { EnvVariableModal } from '@/components/modals/EnvVariableModal';
import { GuideModal } from '@/components/modals/GuideModal';

export default function KineticHome() {
  const {
    activeTab,
    selectedNodeId,
    selectNode,
    runEntirePipeline,
  } = useWorkflowStore();

  const [isCurlModalOpen, setIsCurlModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter -> Run Pipeline
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runEntirePipeline();
      }

      // Escape -> Deselect node or close modals
      if (e.key === 'Escape') {
        selectNode(null);
        setIsCurlModalOpen(false);
        setIsEnvModalOpen(false);
        setIsGuideModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runEntirePipeline, selectNode]);

  return (
    <main className="w-screen h-screen flex flex-col bg-[#09090b] overflow-hidden select-none font-sans">
      {/* Top Header Bar */}
      <Header
        onOpenCurlModal={() => setIsCurlModalOpen(true)}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
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

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </main>
  );
}
