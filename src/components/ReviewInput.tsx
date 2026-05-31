/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, Loader2, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export default function ReviewInput({ onAnalyze, isLoading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onAnalyze(text.trim());
    }
  };

  const handleExample = () => {
    setText(`[2024-05-01] The checkout process was remarkably smooth, but I wish there were more color options for the primary widget.
[2024-05-05] Love the new update! The speed is incredible. Best purchase this year.
[2024-05-10] Had some trouble with the mobile app. It crashes when I try to upload photos. Support was helpful though.
[2024-05-15] Interface is a bit cluttered. Hard to find the settings menu.
[2024-05-20] Excellent customer service. They resolved my issue in under an hour.
[2024-05-25] Disappointed with the shipping time. Took 2 weeks to arrive. Product is okay.
[2024-05-28] This is exactly what I needed. Simple and effective.`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your raw customer reviews here... (e.g. [Date] Review text)"
          className="w-full h-48 p-6 bg-white rounded-2xl border-2 border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none text-slate-700 leading-relaxed shadow-sm group-hover:shadow-md"
        />
        <button
          onClick={handleExample}
          className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Load Example Data
        </button>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isLoading ? 'Analyzing Sentiment...' : 'Generate Report'}
        </motion.button>
      </div>
    </div>
  );
}
