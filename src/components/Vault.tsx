import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, X, Archive, Clock, ChevronRight } from 'lucide-react';
import { Project, ProjectCollection } from '../types';

interface VaultProps {
  vault: ProjectCollection;
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export const Vault = ({ vault, isOpen, onClose, onSwitch, onCreate, onDelete }: VaultProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-zinc-950 border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <Archive className="w-5 h-5 text-white" />
                   <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">The Vault</h2>
                </div>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest pl-8">Active Archives: {vault.projects.length}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-4 hover:bg-white/5 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
              {vault.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSwitch(project.id)}
                  className={`relative group text-left p-8 rounded-2xl border transition-all duration-300 ${
                    vault.activeProjectId === project.id 
                      ? 'bg-white border-white' 
                      : 'bg-zinc-900 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${vault.activeProjectId === project.id ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {project.id === 'default' ? 'ROOT_CORE' : `MANIFEST_${project.id.slice(0, 4).toUpperCase()}`}
                    </div>
                    {vault.projects.length > 1 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(project.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${vault.activeProjectId === project.id ? 'hover:bg-zinc-100 text-zinc-300' : 'hover:bg-white/10 text-zinc-600 hover:text-red-400'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className={`text-2xl font-black tracking-tight mb-2 italic uppercase ${vault.activeProjectId === project.id ? 'text-black' : 'text-white'}`}>
                    {project.name}
                  </h3>
                  
                  <div className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-widest ${vault.activeProjectId === project.id ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    <div className="flex items-center gap-1.5">
                       <Clock className="w-3 h-3" />
                       {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${vault.activeProjectId === project.id ? 'bg-black' : 'bg-white'}`} />
                       Level 0{Object.values(project.steps).filter(s => s.isCompleted).length}
                    </div>
                  </div>

                  {vault.activeProjectId === project.id && (
                    <div className="absolute top-4 right-4 animate-pulse">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  )}
                </button>
              ))}

              <button
                onClick={onCreate}
                className="group p-8 rounded-2xl border border-dashed border-white/10 hover:border-white/30 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/5"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white">Initialize New Protocol</span>
              </button>
            </div>

            {/* Footer */}
            <div className="p-8 bg-zinc-900/50 border-t border-white/5 flex justify-end">
               <button 
                onClick={onClose}
                className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
               >
                 Close Vault
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
