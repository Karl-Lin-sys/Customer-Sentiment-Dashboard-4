/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { WordCloudItem } from '../types';

interface Props {
  data: WordCloudItem[];
  title: string;
  color: 'success' | 'danger';
}

export default function WordCloud({ data, title, color }: Props) {
  const max = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  
  const colors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[280px]">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-2 items-center justify-center min-h-[120px]">
        {data.map((item, i) => {
          const size = Math.max(0.75, (item.value / max) * 1.5 + 0.5);
          return (
            <span
              key={i}
              className={`px-3 py-1 rounded-full border transition-all hover:scale-110 cursor-default ${colors[color]}`}
              style={{ fontSize: `${size}rem`, opacity: Math.max(0.6, item.value / max) }}
            >
              {item.text}
            </span>
          );
        })}
        {data.length === 0 && (
          <p className="text-slate-400 text-sm italic">No data identified</p>
        )}
      </div>
    </div>
  );
}
