/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Edit2,
  Key,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { StepType, StepData, Project, ProjectCollection, STEPS, STORAGE_KEY, PROJECTS_STORAGE_KEY } from './types';
import { generateStepOutputStreaming, generateFinalManifest, generateInsights, generateSummaryForNextStep, performVibeCheck } from './services/geminiService';
import { Vault } from './components/Vault';

// Components
import { Sidebar } from './components/Sidebar';
import { StepEditor } from './components/StepEditor';
import { StepOutput } from './components/StepOutput';
import { StepInsights } from './components/StepInsights';
import { FinalManifest } from './components/FinalManifest';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { ThemeSwitch } from './components/ThemeSwitch';

const INITIAL_PROJECT: Project = {
  id: 'default',
  name: 'New Vibe Project',
  description: 'Building something legendary.',
  currentStep: StepType.BRAINSTORM,
  onboardingStep: 'WELCOME',
  steps: STEPS.reduce((acc, step) => ({
    ...acc,
    [step.type]: { userInput: '', aiOutput: '', isCompleted: false, lastSaved: '' }
  }), {} as Record<StepType, StepData>),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  const [vault, setVault] = useState<ProjectCollection>({
    projects: [INITIAL_PROJECT],
    activeProjectId: INITIAL_PROJECT.id
  });
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingManifest, setIsGeneratingManifest] = useState(false);
  const [manifest, setManifest] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout|null>(null);

  // Load from local storage
  useEffect(() => {
    const savedVault = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (savedVault) {
      try {
        const parsedVault: ProjectCollection = JSON.parse(savedVault);
        const activeProject = parsedVault.projects.find(p => p.id === parsedVault.activeProjectId) || parsedVault.projects[0];
        setVault(parsedVault);
        setProject(activeProject);
      } catch (e) {
        console.error("Failed to parse saved vault", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      setSaveStatus('saving');
      
      const updatedVault = {
        ...vault,
        projects: vault.projects.map(p => p.id === project.id ? project : p)
      };
      
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedVault));
      
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    }
  }, [project, isLoaded]);

  const switchProject = (id: string) => {
    const nextProject = vault.projects.find(p => p.id === id);
    if (nextProject) {
      setVault(prev => ({ ...prev, activeProjectId: id }));
      setProject(nextProject);
      setManifest(null);
      setIsVaultOpen(false);
    }
  };

  const createNewProject = () => {
    const newProject: Project = {
      ...INITIAL_PROJECT,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVault(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      activeProjectId: newProject.id
    }));
    setProject(newProject);
    setManifest(null);
    setIsVaultOpen(false);
  };

  const deleteProject = (id: string) => {
    if (vault.projects.length <= 1) return;
    const newProjects = vault.projects.filter(p => p.id !== id);
    const nextActive = newProjects[0].id;
    setVault({
      projects: newProjects,
      activeProjectId: nextActive
    });
    if (project.id === id) {
      setProject(newProjects[0]);
    }
  };

  const handleStepChange = (type: StepType) => {
    setProject(prev => ({ ...prev, currentStep: type }));
    setIsMobileMenuOpen(false);
  };

  const updateStepData = (type: StepType, data: Partial<StepData>) => {
    setProject(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [type]: { ...prev.steps[type], ...data, lastSaved: new Date().toISOString() }
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const updateProjectName = (name: string) => {
    setProject(prev => ({ ...prev, name, updatedAt: new Date().toISOString() }));
  };

  const handleGenerate = async () => {
    const currentStepConfig = STEPS.find(s => s.type === project.currentStep);
    if (!currentStepConfig) return;

    setIsGenerating(true);
    updateStepData(project.currentStep, { aiOutput: "", isStreaming: true });
    
    // Perform Vibe Check first
    const vibe = await performVibeCheck(project.steps[project.currentStep].userInput, currentStepConfig.label);
    updateStepData(project.currentStep, { vibeCheck: vibe });

    const stepIndex = STEPS.findIndex(s => s.type === project.currentStep);
    const previousStepOutput = stepIndex > 0 ? project.steps[STEPS[stepIndex - 1].type].aiOutput : "";

    const stream = generateStepOutputStreaming(
      currentStepConfig.prompt,
      project.steps[project.currentStep].userInput,
      previousStepOutput
    );

    let fullOutput = "";
    for await (const chunk of stream) {
      fullOutput += chunk;
      updateStepData(project.currentStep, { aiOutput: fullOutput });
    }

    const insights = await generateInsights(fullOutput);

    updateStepData(project.currentStep, { 
      aiOutput: fullOutput,
      insights: insights,
      isStreaming: false
    });
    
    // Auto-populate next step input if empty
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) {
      const nextStepType = STEPS[nextIdx].type;
      const nextStepLabel = STEPS[nextIdx].label;
      if (!project.steps[nextStepType].userInput) {
        const nextStepContext = await generateSummaryForNextStep(fullOutput, nextStepLabel);
        updateStepData(nextStepType, { userInput: `[PREVIOUS PHASE CONTEXT]: ${nextStepContext}\n\n[OBJECTIVE]: ` });
      }
    }

    setIsGenerating(false);
    setIsPreviewMode(true);
  };

  const handleGenerateManifest = async () => {
    setIsGeneratingManifest(true);
    const result = await generateFinalManifest(project);
    setManifest(result);
    setIsGeneratingManifest(false);
  };

  const toggleComplete = (type: StepType) => {
    updateStepData(type, { isCompleted: !project.steps[type].isCompleted });
  };

  const handleReset = () => {
    if (confirm('Start a new project? This will clear all current progress.')) {
      setProject(INITIAL_PROJECT);
      setManifest(null);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_vibe_project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const currentStep = STEPS.find(s => s.type === project.currentStep)!;
  const currentStepData = project.steps[project.currentStep];
  const progress = Math.round((STEPS.filter(s => project.steps[s.type].isCompleted).length / STEPS.length) * 100);
  const isAllCompleted = STEPS.every(s => project.steps[s.type].isCompleted);

  const nextOnboardingStep = () => {
    const sequence: Project['onboardingStep'][] = ['WELCOME', 'KEYS', 'SECURITY', 'VIBE', 'COMPLETED'];
    const currentIdx = sequence.indexOf(project.onboardingStep || 'WELCOME');
    if (currentIdx < sequence.length - 1) {
      setProject(prev => ({ ...prev, onboardingStep: sequence[currentIdx + 1] }));
    }
  };

  const completeOnboarding = () => {
    setProject(prev => ({ ...prev, onboardingStep: 'COMPLETED' }));
    // Actually set it to a state that hides onboarding
    setTimeout(() => {
        setProject(prev => ({ ...prev, onboardingStep: undefined }));
    }, 100);
  };

  const startOnboarding = () => {
    setProject(prev => ({ ...prev, onboardingStep: 'WELCOME' }));
  };

  if (!isLoaded) return null;

  return (
    <div className="h-screen w-full bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row overflow-hidden font-sans">
      <AnimatePresence>
        {project.onboardingStep && (
          <Onboarding 
            currentStep={project.onboardingStep} 
            onNext={nextOnboardingStep}
            onComplete={completeOnboarding}
          />
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--aside)] z-40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{project.name}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-black dark:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col md:hidden"
          >
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            </div>

            <header className="px-8 py-10 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-[10px] font-black italic">VC</div>
                  <ThemeSwitch />
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 -mr-4">
                 <X className="w-10 h-10 text-white" />
               </button>
            </header>

            <div className="flex-1 px-8 flex flex-col justify-center gap-2 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 px-4">Navigation_Protocol</span>
              <nav className="space-y-4">
                {STEPS.map((step, idx) => (
                  <motion.button
                    key={step.type}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                    onClick={() => {
                      handleStepChange(step.type);
                      setManifest(null);
                    }}
                    className={`w-full text-left p-6 group transition-all ${
                      project.currentStep === step.type && !manifest
                        ? 'bg-white text-black'
                        : 'text-white/40 hover:text-white border-l border-white/5'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-[10px] font-black italic opacity-40">0{idx + 1}</span>
                      <span className="text-4xl font-black uppercase tracking-tighter italic">
                        {step.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
                
                {isAllCompleted && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                      setManifest("");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-8 bg-zinc-900 border border-white/10 mt-12 flex items-center justify-between group"
                  >
                    <span className="text-3xl font-black uppercase tracking-tighter italic">Launch Manifest</span>
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                )}
              </nav>
            </div>

            <div className="p-8 pb-12 grid grid-cols-2 gap-4 relative z-10">
               <button onClick={handleExport} className="py-5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">Export</button>
               <button onClick={() => { startOnboarding(); setIsMobileMenuOpen(false); }} className="py-5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">Nodes</button>
               <button onClick={() => { setIsVaultOpen(true); setIsMobileMenuOpen(false); }} className="col-span-2 py-5 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] transition-all">Open Project Vault</button>
               <button onClick={() => { handleReset(); setIsMobileMenuOpen(false); }} className="col-span-2 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">Terminate Framework Session</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex shrink-0">
        <Sidebar 
          project={project}
          manifest={manifest}
          progress={progress}
          isEditingName={isEditingName}
          isAllCompleted={isAllCompleted}
          handleStepChange={handleStepChange}
          setManifest={setManifest}
          setIsEditingName={setIsEditingName}
          updateProjectName={updateProjectName}
          handleExport={handleExport}
          handleReset={handleReset}
          startOnboarding={startOnboarding}
          onOpenVault={() => setIsVaultOpen(true)}
        />
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--bg)]">
        {/* Background Large Text */}
        <div className="absolute top-0 right-0 p-12 pointer-events-none select-none overflow-hidden h-full hidden lg:flex flex-col justify-start">
          <motion.div 
            key={project.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[180px] font-black text-black/[0.03] dark:text-white/[0.03] leading-none tracking-tighter"
          >
            {currentStep.label.toUpperCase()}
          </motion.div>
        </div>

        <section className="flex-1 p-6 md:p-16 max-w-4xl w-full z-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {manifest === null ? (
              <motion.div
                key={project.currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <header className="mb-8 md:mb-14 relative">
                  <div className="flex items-center gap-2 text-black dark:text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    <span className="w-6 h-[1px] bg-black dark:bg-white"></span>
                    Step 0{STEPS.findIndex(s => s.type === project.currentStep) + 1} of 07
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white mb-6 leading-tight">
                    {currentStep.label}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-xl font-medium leading-relaxed">
                    {currentStep.description}
                  </p>
                </header>

                <StepEditor 
                  currentStep={currentStep}
                  currentStepData={currentStepData}
                  isGenerating={isGenerating}
                  updateStepData={updateStepData}
                  toggleComplete={toggleComplete}
                  handleGenerate={handleGenerate}
                />

                <StepInsights insights={currentStepData.insights || []} />

                <StepOutput 
                  currentStepData={currentStepData}
                  isPreviewMode={isPreviewMode}
                  setIsPreviewMode={setIsPreviewMode}
                  updateStepData={updateStepData}
                  copyToClipboard={copyToClipboard}
                  currentStepType={project.currentStep}
                />
              </motion.div>
            ) : (
              <FinalManifest 
                manifest={manifest}
                isGeneratingManifest={isGeneratingManifest}
                projectName={project.name}
                handleGenerateManifest={handleGenerateManifest}
              />
            )}
          </AnimatePresence>
        </section>

        <Footer 
          project={project}
          saveStatus={saveStatus}
          handleStepChange={handleStepChange}
          setManifest={setManifest}
          className="hidden md:flex"
        />
      </main>

      <Vault 
        vault={vault}
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onSwitch={switchProject}
        onCreate={createNewProject}
        onDelete={deleteProject}
      />
    </div>
  );
}
