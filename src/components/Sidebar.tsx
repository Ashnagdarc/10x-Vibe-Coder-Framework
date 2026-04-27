import { StepType, StepData, Project, STEPS } from '../types';
import { ThemeSwitch } from './ThemeSwitch';
import { 
  Rocket, 
  RefreshCcw,
  Edit2,
  Download,
  Key,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  project: Project;
  manifest: string | null;
  progress: number;
  isEditingName: boolean;
  isAllCompleted: boolean;
  handleStepChange: (type: StepType) => void;
  setManifest: (manifest: string | null) => void;
  setIsEditingName: (isEditing: boolean) => void;
  updateProjectName: (name: string) => void;
  handleExport: () => void;
  handleReset: () => void;
  startOnboarding: () => void;
}

export const Sidebar = ({
  project,
  manifest,
  progress,
  isEditingName,
  isAllCompleted,
  handleStepChange,
  setManifest,
  setIsEditingName,
  updateProjectName,
  handleExport,
  handleReset,
  startOnboarding
}: SidebarProps) => {
  return (
    <aside className="w-72 border-r border-[var(--border)] bg-[var(--aside)] flex flex-col shrink-0">
      <div className="p-8 pb-12">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full shadow-[0_0_8px_var(--text)]"></div>
            <h1 className="text-xs font-black uppercase tracking-[0.2em] dark:text-white text-black">10x Vibe Coder</h1>
          </div>
          <ThemeSwitch iconSize={14} />
        </div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Studio Edition v1.0</p>
      </div>

      <nav className="px-3 flex-1 space-y-1 overflow-y-auto">
        {STEPS.map((step, idx) => (
          <button
            key={step.type}
            onClick={() => {
              handleStepChange(step.type);
              setManifest(null);
            }}
            className={`w-full group flex items-center px-4 py-3.5 transition-all cursor-pointer rounded-lg border border-transparent ${
              project.currentStep === step.type && !manifest
                ? 'text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700 shadow-sm dark:shadow-xl shadow-black/5 dark:shadow-black/20' 
                : 'text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <span className={`w-8 text-[10px] font-mono shrink-0 font-black ${project.currentStep === step.type && !manifest ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}>
              0{idx + 1}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-left flex-1 truncate">
              {step.label}
            </span>
            {project.steps[step.type].isCompleted && (
              <div className="ml-2 w-1.5 h-1.5 bg-zinc-800 dark:bg-zinc-200 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"></div>
            )}
            {project.currentStep === step.type && !manifest && (
              <div className="ml-auto w-1 h-3 bg-black dark:bg-white rounded-full animate-in fade-in zoom-in duration-300"></div>
            )}
          </button>
        ))}
        {isAllCompleted && (
          <button
            onClick={() => setManifest("")}
            className={`w-full group flex items-center px-4 py-4 mt-6 transition-all cursor-pointer rounded-lg border ${
              manifest !== null
                ? 'text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 shadow-xl' 
                : 'text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors'
            }`}
          >
            <span className="w-8 shrink-0">
              <Rocket className={`w-4 h-4`} />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-left flex-1 truncate">
              Launch Manifest
            </span>
            {manifest !== null && (
              <div className="ml-auto w-1 h-3 bg-black dark:bg-white rounded-full"></div>
            )}
          </button>
        )}
      </nav>

      <div className="p-8 mt-auto border-t border-[var(--border)] bg-zinc-100 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-black dark:bg-white flex items-center justify-center text-[10px] font-black text-white dark:text-black">
            VC
          </div>
          <div className="overflow-hidden group relative flex-1">
            {isEditingName ? (
              <input 
                 autoFocus
                className="bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold w-full rounded border border-zinc-900 px-2 py-1 outline-none"
                value={project.name}
                onChange={(e) => updateProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              />
            ) : (
              <div className="flex items-center gap-2 max-w-full">
                <p className="text-xs font-bold truncate text-black dark:text-white">{project.name}</p>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3 text-zinc-400 hover:text-black dark:hover:text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-black dark:bg-white"
                />
              </div>
              <span className="text-[9px] text-zinc-500 font-mono shrink-0 font-bold">{progress}%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleExport}
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 text-[9px] font-black uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-zinc-900 dark:border-zinc-100 rounded-lg active:scale-[0.98] shadow-sm"
          >
            <Download className="w-3 h-3" />
            Export Logic
          </button>
          <button 
            onClick={startOnboarding}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[9px] font-black uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-zinc-900 dark:border-zinc-100 rounded-lg active:scale-[0.98] shadow-sm"
          >
            <Key className="w-3 h-3" />
            Neural Keys
          </button>
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-all border border-transparent rounded-lg active:scale-[0.98]"
          >
            <RefreshCcw className="w-3 h-3" />
            New Framework
          </button>
        </div>
      </div>
    </aside>
  );
};
