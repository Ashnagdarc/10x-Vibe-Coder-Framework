import React from 'react';
import { StepType, StepData, Project, STEPS } from '../types';
import { 
  BrainCircuit, 
  Map, 
  Code2, 
  ShieldCheck, 
  Zap, 
  Rocket, 
  CheckCircle2,
  Wand2,
} from 'lucide-react';

interface StepEditorProps {
  currentStep: typeof STEPS[number];
  currentStepData: StepData;
  isGenerating: boolean;
  updateStepData: (type: StepType, data: Partial<StepData>) => void;
  toggleComplete: (type: StepType) => void;
  handleGenerate: () => void;
}

const getIcon = (type: StepType) => {
  switch (type) {
    case StepType.BRAINSTORM: return <BrainCircuit className="w-4 h-4" />;
    case StepType.PLAN: return <Map className="w-4 h-4" />;
    case StepType.BUILD: return <Code2 className="w-4 h-4" />;
    case StepType.AUDIT: return <ShieldCheck className="w-4 h-4" />;
    case StepType.KAIZEN: return <Zap className="w-4 h-4" />;
    case StepType.SPRINT: return <Rocket className="w-4 h-4" />;
    case StepType.CLOSEOUT: return <CheckCircle2 className="w-4 h-4" />;
  }
};

export const StepEditor = ({
  currentStep,
  currentStepData,
  isGenerating,
  updateStepData,
  toggleComplete,
  handleGenerate
}: StepEditorProps) => {
  const getLoadingMessage = (type: StepType) => {
    switch (type) {
      case StepType.BRAINSTORM: return 'Synthesizing vision...';
      case StepType.PLAN: return 'Mapping architecture...';
      case StepType.BUILD: return 'Drafting checklists...';
      case StepType.AUDIT: return 'Analyzing security...';
      case StepType.KAIZEN: return 'Identifying optimizations...';
      case StepType.SPRINT: return 'Finalizing tactics...';
      case StepType.CLOSEOUT: return 'Validating integrity...';
      default: return 'Processing...';
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex flex-col sm:justify-between sm:items-center gap-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white flex items-center gap-2">
             {getIcon(currentStep.type)}
             Input Parameters
          </label>
          <button 
            onClick={() => toggleComplete(currentStep.type)}
            className={`w-fit text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
              currentStepData.isCompleted 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent' 
                : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            }`}
          >
            {currentStepData.isCompleted ? '✓ Completed' : 'Mark Phase Finish'}
          </button>
        </div>
        
          <textarea
            spellCheck="false"
            id="step-input"
            aria-label={`Input for ${currentStep.label}`}
            value={currentStepData.userInput}
            onChange={(e) => updateStepData(currentStep.type, { userInput: e.target.value })}
            placeholder={currentStep.placeholder}
            className="w-full h-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-8 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all leading-relaxed font-mono text-sm shadow-sm"
          />

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !currentStepData.userInput}
            className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.97] shadow-xl disabled:opacity-40 disabled:scale-100 flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                <span>{getLoadingMessage(currentStep.type)}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Execute Logic Engine</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
