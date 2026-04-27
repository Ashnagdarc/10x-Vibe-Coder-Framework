import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Cpu,
  Globe,
  Sparkles,
  Lock
} from 'lucide-react';
import { API_KEYS_STORAGE_KEY } from '../types';

interface OnboardingProps {
  onComplete: () => void;
  currentStep: 'WELCOME' | 'KEYS' | 'SECURITY' | 'VIBE' | 'COMPLETED';
  onNext: () => void;
}

export const Onboarding = ({ onComplete, currentStep: step, onNext }: OnboardingProps) => {
  const [keys, setKeys] = useState({
    openai: '',
    perplexity: '',
    google: '',
    groq: ''
  });

  const [activeTheory, setActiveTheory] = useState<number>(0);

  const THEORIES = [
    { title: "The 7-Step Sequence", desc: "A linear architecture protocol designed to eliminate technical entropy." },
    { title: "Neural Vibration", desc: "Every input is analyzed for frequency. High intensity thoughts generate superior logic." },
    { title: "Manifesto Output", desc: "The final artifact is a high-density PDF-ready architecture specification." }
  ];

  const handleNext = () => {
    onNext();
  };

  const saveKeys = () => {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
    handleNext();
  };

  const hasAtLeastOneKey = Object.values(keys).some(key => key.trim().length > 0);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex items-center justify-center font-sans overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-blue-500/10 via-transparent to-transparent blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-gradient-to-l from-purple-500/10 via-transparent to-transparent blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl px-12"
          >
            <div className="flex flex-col items-start">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="h-[1px] bg-white mb-12"
              />
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-8 md:mb-12 uppercase italic">
                The <br/>
                Signal <br/>
                <span className="text-zinc-800">Manifesto.</span>
              </h1>

              <div className="space-y-6 md:space-y-10 mb-12 md:mb-16 max-w-2xl">
                <p className="text-zinc-400 text-lg md:text-2xl font-medium leading-[1.6] italic">
                  "In an industry of noise, we choose vibration. We don't just write code; we engineering the speed of thought."
                </p>
                
                <div className="flex flex-col gap-1 pt-6 md:pt-10 border-t border-white/5">
                  <p className="text-white font-serif italic text-2xl md:text-3xl tracking-tight leading-none mb-1">Daniel Nonso</p>
                  <p className="text-zinc-600 text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black">Founder & Lead Manifestor</p>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="group relative px-12 py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-zinc-200 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Step Into The Void</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'KEYS' && (
          <motion.div
            key="keys"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-xl w-full px-12"
          >
            <div className="mb-10 md:mb-16">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 mb-4 md:mb-6 block">Neural Integration Nodes</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 md:mb-6 italic">NODES.</h1>
              <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed">Establish your neural gateways. At least one required.</p>
            </div>
            
            <div className="space-y-8 md:space-y-12 mb-12 md:mb-20">
                {[
                  { id: 'openai', label: 'OpenAI Core', icon: <Sparkles className="w-4 h-4" />, placeholder: 'MASTER_SYNK_NODE_KEY' },
                  { id: 'perplexity', label: 'Perplexity Search', icon: <Globe className="w-4 h-4" />, placeholder: 'LATENT_RESEARCH_NODE' },
                  { id: 'google', label: 'Google GenAI', icon: <Cpu className="w-4 h-4" />, placeholder: 'CLUSTER_ACCESS_TOKEN' },
                  { id: 'groq', label: 'Groq Inference', icon: <Zap className="w-4 h-4" />, placeholder: 'HIGH_VELOCITY_ENGINE' }
                ].map((node) => (
                  <div key={node.id} className="group flex flex-col gap-3 md:gap-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="flex items-center gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-focus-within:text-white transition-colors">
                        {node.icon} {node.label}
                      </label>
                      <span className="text-[7px] md:text-[8px] text-zinc-800 font-bold uppercase tracking-widest hidden sm:block">Secure Sync</span>
                    </div>
                    <input 
                      type="password"
                      autoComplete="off"
                      className="w-full bg-transparent border-l border-zinc-900 py-3 md:py-4 pl-4 md:pl-6 text-lg md:text-xl font-mono focus:outline-none focus:border-white transition-all placeholder:text-zinc-900"
                      placeholder={node.placeholder}
                      value={(keys as any)[node.id]}
                      onChange={e => setKeys(prev => ({ ...prev, [node.id]: e.target.value }))}
                    />
                  </div>
                ))}
            </div>

            <button 
              onClick={saveKeys}
              disabled={!hasAtLeastOneKey}
              className="w-full py-8 md:py-10 bg-white text-black font-black uppercase tracking-[0.6em] text-[9px] md:text-[10px] transition-all hover:bg-zinc-200 disabled:opacity-5 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify Connectivity
            </button>
          </motion.div>
        )}

        {step === 'SECURITY' && (
          <motion.div
            key="security"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-12 max-w-2xl"
          >
            <div className="relative w-24 h-24 mx-auto mb-16 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-full"
              />
              <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] italic">PRIVATE<br/>MEMBRANE.</h1>
            <p className="text-zinc-500 text-lg md:text-xl mb-12 md:mb-16 font-medium leading-relaxed max-w-lg mx-auto">
              Sovereign data principles applied. Your keys are stored strictly in your local neural cache. <span className="text-white italic">Zero cloud footprint.</span>
            </p>
            <button 
              onClick={handleNext}
              className="px-12 md:px-20 py-6 md:py-8 border border-white/20 text-white font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px] hover:border-white hover:bg-white hover:text-black transition-all cursor-pointer rounded-sm"
            >
              Verify Secure State
            </button>
          </motion.div>
        )}

        {step === 'VIBE' && (
          <motion.div
            key="vibe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl px-12 grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 mb-6 block">The Vibe Coder Framework</span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 italic">CORE_LOGIC.</h1>
              
              <div className="space-y-8">
                {THEORIES.map((theory, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTheory(idx)}
                    className={`block w-full text-left p-6 border-l-2 transition-all ${activeTheory === idx ? 'border-white bg-white/5' : 'border-zinc-800 hover:border-zinc-600 text-zinc-500'}`}
                  >
                    <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${activeTheory === idx ? 'text-white' : 'text-zinc-600'}`}>{theory.title}</h3>
                    <p className="text-sm font-medium leading-relaxed italic">{theory.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-square bg-zinc-950 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
               {/* Visualizer Mockup */}
               <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-end gap-1 px-10 opacity-20">
                 {Array.from({ length: 40 }).map((_, i) => (
                   <motion.div
                    key={i}
                    animate={{ height: [20, Math.random() * 100 + 40, 20] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                    className="flex-1 bg-white"
                   />
                 ))}
               </div>

               <div className="relative z-10 text-center">
                 <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-6 mx-auto">
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Vibe_Protocol_Active</span>
               </div>
               
               <button 
                onClick={handleNext}
                className="absolute bottom-10 right-10 p-6 bg-white text-black rounded-full hover:scale-110 transition-transform cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'COMPLETED' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-5xl px-8"
          >
            <div className="mb-20 md:mb-32">
              <h1 className="text-[18vw] md:text-[12vw] font-black tracking-tighter mb-4 leading-none italic">FOUNDERS</h1>
              <p className="text-zinc-600 font-black uppercase tracking-[1em] md:tracking-[1.5em] text-sm md:text-lg md:pl-[1.5em]">EXCLUSIVE RELEASE ONE</p>
            </div>
            
            <button 
              onClick={onComplete}
              className="px-20 md:px-32 py-8 md:py-10 bg-white text-black font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-[10px] md:text-xs hover:scale-105 transition-all cursor-pointer shadow-[0_0_100px_rgba(255,255,255,0.15)] rounded-sm"
            >
              Initialize Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
