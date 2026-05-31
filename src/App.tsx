/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ReviewInput from './components/ReviewInput';
import Dashboard from './components/Dashboard';
import { SentimentReport, AnalysisResponse } from './types';
import { BarChart3, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (reviews: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews }),
      });

      const data: AnalysisResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.report) {
        setReport(data.report);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">SentiGraph</h1>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Customer Sentiment Intelligence</p>
            </div>
          </div>
          
          {report && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="px-6 py-12 md:px-10">
        <div className="max-w-7xl mx-auto">
          {!report && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 mb-16 pt-10"
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                Turn your <span className="text-indigo-600">raw feedback</span> into <br /> actionable business strategy.
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Paste batch customer reviews. Our AI analyzes sentiment trends, identifies pain points, and delivers a strategic report in seconds.
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!report ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ReviewInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                
                {error && (
                  <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm text-center max-w-lg mx-auto">
                    {error}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dashboard report={report} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">
            Powered by Gemini AI 3.5 & D3 Visualization
          </p>
        </div>
      </footer>
    </div>
  );
}

