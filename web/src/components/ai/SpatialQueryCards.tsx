'use client';

import React from 'react';
import { SpatialAiResponse } from '@geoatlas/core';
import { Sparkles, ArrowRight, CheckCircle, Database } from 'lucide-react';
import Link from 'next/link';

interface SpatialQueryCardProps {
  response: SpatialAiResponse;
}

export const SpatialQueryCards: React.FC<SpatialQueryCardProps> = ({ response }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sparkles className="text-cyan-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">{response.answerTitle}</h3>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{response.markdownSummary}</p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        {response.metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{metric.label}</span>
            <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Deep-link Action Button */}
      {response.suggestedAction && (
        <div className="flex justify-end pt-1">
          <Link
            href={response.suggestedAction.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
          >
            <span>{response.suggestedAction.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
