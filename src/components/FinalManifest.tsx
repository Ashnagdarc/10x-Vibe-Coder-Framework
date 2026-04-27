import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { 
  Rocket, 
  FileText,
  Printer,
  Share2,
} from 'lucide-react';

interface FinalManifestProps {
  manifest: string | null;
  isGeneratingManifest: boolean;
  projectName: string;
  handleGenerateManifest: () => void;
}

export const FinalManifest = ({
  manifest,
  isGeneratingManifest,
  projectName,
  handleGenerateManifest
}: FinalManifestProps) => {
  const [isShared, setIsShared] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <motion.div
      key="manifest"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <header className="mb-14 relative print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-black dark:text-white text-[10px] font-black uppercase tracking-[0.3em]">
            <Rocket className="w-4 h-4" />
            Project Completion
          </div>
          {manifest && (
            <div className="flex gap-4">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <Printer className="w-3 h-3" />
                Print Spec
              </button>
              <button 
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isShared ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
              >
                <Share2 className="w-3 h-3" />
                {isShared ? 'Protocol Synced' : 'Share protocol'}
              </button>
            </div>
          )}
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white mb-6 leading-tight">
          Software Manifest
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-xl font-medium leading-relaxed">
          The final synthesis of your 10x workflow.
        </p>
      </header>

      {!manifest ? (
        <button 
          onClick={handleGenerateManifest}
          disabled={isGeneratingManifest}
          className="w-full py-12 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group flex flex-col items-center justify-center gap-4"
        >
          {isGeneratingManifest ? (
            <>
              <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Synthesizing full project logic...</span>
            </>
          ) : (
            <>
              <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">Generate Final Manifest</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-12 prose dark:prose-invert prose-sm max-w-none shadow-2xl backdrop-blur-md relative overflow-hidden print:p-0 print:shadow-none print:border-none print:bg-white print:text-black">
          {/* Print Only Header */}
          <div className="hidden print:block mb-10 border-b-2 border-black pb-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-sm font-black uppercase tracking-[0.5em] mb-4">10x Vibe Coder Architecture Manifest</h1>
                <p className="text-5xl font-black italic tracking-tighter uppercase">{projectName}</p>
              </div>
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

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
                    className="rounded-xl !bg-black !border !border-zinc-800 my-6 print:!bg-zinc-100 print:!text-black print:!border-zinc-200"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={`${className} bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-black dark:text-white font-bold print:bg-zinc-200`} {...props}>
                    {children}
                    </code>
                );
              },
              h1({children}) { return <h1 className="text-4xl font-black text-black dark:text-white mt-12 mb-6 tracking-tighter border-b border-zinc-200 dark:border-zinc-800 pb-4 print:text-black print:border-black">{children}</h1> },
              h2({children}) { return <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-5 tracking-tight flex items-center gap-3 print:text-black"><span className="w-2 h-2 bg-black dark:bg-white rounded-full shadow-sm print:bg-black"></span>{children}</h2> },
              p({children}) { return <p className="print:text-zinc-800">{children}</p> },
              li({children}) { return <li className="print:text-zinc-800">{children}</li> }
            }}
          >
            {manifest}
          </ReactMarkdown>

          {/* Print only footer */}
          <div className="hidden print:block mt-20 pt-8 border-t border-zinc-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-zinc-400">Generated via Neural Integration Logic // Studio_Protocol_v1.0</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
