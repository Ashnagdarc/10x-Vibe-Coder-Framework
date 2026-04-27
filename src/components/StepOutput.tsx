import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { 
  Zap, 
  Copy,
  Eye,
  Type,
} from 'lucide-react';
import { StepType, StepData } from '../types';

interface StepOutputProps {
  currentStepData: StepData;
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  updateStepData: (type: StepType, data: Partial<StepData>) => void;
  copyToClipboard: (text: string) => void;
  currentStepType: StepType;
}

export const StepOutput = ({
  currentStepData,
  isPreviewMode,
  setIsPreviewMode,
  updateStepData,
  copyToClipboard,
  currentStepType
}: StepOutputProps) => {
  if (!currentStepData.aiOutput) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-sm mt-12"
    >
      <div className="px-4 md:px-8 py-5 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <Zap className="w-3.5 h-3.5 text-black dark:text-white" />
           <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Architecture Spec Output</span>
        </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-300 dark:border-zinc-700">
            <button 
              onClick={() => setIsPreviewMode(true)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
            <button 
              onClick={() => setIsPreviewMode(false)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${!isPreviewMode ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
            >
              <Type className="w-3 h-3" />
              Edit
            </button>
          </div>
          <button 
            onClick={() => copyToClipboard(currentStepData.aiOutput)}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-4 md:p-8">
        {isPreviewMode ? (
          <div className="prose dark:prose-invert prose-sm max-w-none text-black dark:text-zinc-300 leading-relaxed font-sans min-h-[400px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !bg-black !border !border-zinc-800 my-6"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={`${className} bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-black dark:text-white font-bold`} {...props}>
                      {children}
                    </code>
                  );
                },
                p({children}) {
                  return <p className="mb-4 last:mb-0 text-zinc-800 dark:text-zinc-400">{children}</p>;
                },
                h1({children}) { return <h1 className="text-2xl font-black text-black dark:text-white mt-8 mb-4 tracking-tighter">{children}</h1> },
                h2({children}) { return <h2 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">{children}</h2> },
                h3({children}) { return <h3 className="text-lg font-bold text-black dark:text-white mt-6 mb-3">{children}</h3> },
                ul({children}) { return <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-800 dark:text-zinc-400">{children}</ul> },
                ol({children}) { return <ol className="list-decimal pl-6 mb-4 space-y-2 text-zinc-800 dark:text-zinc-400">{children}</ol> },
                li({children}) { return <li className="leading-relaxed">{children}</li> },
                blockquote({children}) { return <blockquote className="border-l-4 border-black dark:border-white bg-zinc-50 dark:bg-zinc-800 px-6 py-4 rounded-r-xl italic my-6 text-black dark:text-white">{children}</blockquote> }
              }}
            >
               {currentStepData.aiOutput}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="ai-output"
            aria-label="AI Generated Output"
            value={currentStepData.aiOutput}
            onChange={(e) => updateStepData(currentStepType, { aiOutput: e.target.value })}
            className="w-full bg-transparent border-none focus:outline-none min-h-[400px] text-black dark:text-white leading-relaxed font-mono text-xs resize-y placeholder-zinc-400 dark:placeholder-zinc-600"
            placeholder="Waiting for AI synthesis..."
          />
        )}
      </div>
    </motion.div>
  );
};
