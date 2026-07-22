'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export interface StatisticChartProps {
  data: Array<{ entity_type: string; count: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

export const StatisticChart: React.FC<StatisticChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
        No entity distribution metrics recorded for this administrative region yet.
      </div>
    );
  }

  return (
    <div className="w-full h-72 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis
            dataKey="entity_type"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
