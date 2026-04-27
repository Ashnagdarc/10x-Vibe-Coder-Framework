import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StepType, STEPS, Project } from '../types';

interface FooterProps {
  project: Project;
  saveStatus: 'idle' | 'saving' | 'saved';
  handleStepChange: (type: StepType) => void;
  setManifest: (manifest: string | null) => void;
  className?: string;
}

export const Footer = ({
  project,
  saveStatus,
  handleStepChange,
  setManifest,
  className = ""
}: FooterProps) => {
  return (
    <footer className={`mt-auto p-8 flex items-center justify-between text-[10px] font-black tracking-widest text-zinc-500 dark:text-zinc-600 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md ${className}`}>
      <div className="flex gap-8 items-center uppercase font-bold">
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-black dark:bg-white'}`}></span>
          <span className="text-zinc-900 dark:text-zinc-400">
            {saveStatus === 'saving' ? 'SYNCING...' : saveStatus === 'saved' ? 'SYNCED' : 'STUDIO READY'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-500">
          <span>Vibration: High</span>
          <span>Latency: 18ms</span>
        </div>
      </div>
      <button 
        onClick={() => {
          const nextIdx = STEPS.findIndex(s => s.type === project.currentStep) + 1;
          if (nextIdx < STEPS.length) handleStepChange(STEPS[nextIdx].type);
          setManifest(null);
        }}
        className="group flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
      >
        NEXT PHASE: {STEPS[Math.min(STEPS.length - 1, STEPS.findIndex(s => s.type === project.currentStep) + 1)].label.toUpperCase()}
        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </footer>
  );
};
