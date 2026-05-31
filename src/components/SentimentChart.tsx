/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SentimentDataPoint } from '../types';

interface Props {
  data: SentimentDataPoint[];
}

export default function SentimentChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(str) => {
              const d = new Date(str);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis 
            domain={[-1, 1]} 
            tick={{ fontSize: 10 }} 
            axisLine={false} 
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
