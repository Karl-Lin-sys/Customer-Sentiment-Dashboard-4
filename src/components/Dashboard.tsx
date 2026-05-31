/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Markdown from 'react-markdown';
import { SentimentReport } from '../types';
import SentimentChart from './SentimentChart';
import WordCloud from './WordCloud';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  report: SentimentReport;
}

export default function Dashboard({ report }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 opacity-80" />
            <h4 className="text-sm font-medium uppercase tracking-wider opacity-80">AI Analysis</h4>
          </div>
          <p className="text-lg font-semibold leading-snug">
            Sentiment is trending {report.trend[report.trend.length - 1]?.sentiment > report.trend[0]?.sentiment ? 'Upward' : 'Downward'} based on recent feedback.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <h4 className="text-sm font-medium uppercase tracking-wider text-slate-500">Top Praise</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {report.wordCloud.praises[0]?.text || 'No significant praise'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Found in {report.wordCloud.praises[0]?.value || 0} reviews</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-rose-500">
            <AlertCircle className="w-5 h-5" />
            <h4 className="text-sm font-medium uppercase tracking-wider text-slate-500">Key Complaint</h4>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {report.wordCloud.complaints[0]?.text || 'No significant complaints'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Found in {report.wordCloud.complaints[0]?.value || 0} reviews</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SentimentChart data={report.trend} />
        
        <div className="flex flex-col gap-4">
          <WordCloud data={report.wordCloud.praises} title="Top Praises" color="success" />
          <WordCloud data={report.wordCloud.complaints} title="Pain Points" color="danger" />
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-900 rounded-3xl p-10 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-slate-700"></div>
            <h2 className="text-indigo-400 font-mono text-sm tracking-[0.2em] px-4 uppercase">Executive Summary</h2>
            <div className="h-px flex-1 bg-slate-700"></div>
          </div>
          
          <div className="prose prose-invert prose-indigo max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-indigo-300">
            <Markdown>{report.executiveSummary}</Markdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
