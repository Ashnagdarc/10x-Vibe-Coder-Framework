import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface StepInsightsProps {
  insights: string[];
}

export const StepInsights = ({ insights }: StepInsightsProps) => {
  if (!insights || insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 mb-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 md:p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-black dark:text-white" />
        <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Critical Architecture Insights</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="mt-1 w-1 h-1 rounded-full bg-black dark:bg-white shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
