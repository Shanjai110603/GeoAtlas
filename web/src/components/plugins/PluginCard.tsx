'use client';

import React, { useState } from 'react';
import { SAMPLE_PLUGINS, SAMPLE_ETL_PIPELINES, PluginManifest, EtlPipelineJob } from '@geoatlas/core';
import { Puzzle, Database, CheckCircle, Play, RefreshCw, Power } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PluginCard: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginManifest[]>(SAMPLE_PLUGINS);
  const [pipelines, setPipelines] = useState<EtlPipelineJob[]>(SAMPLE_ETL_PIPELINES);

  const togglePlugin = (id: string) => {
    setPlugins(
      plugins.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Plugin Marketplace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Puzzle className="text-cyan-400 w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">Installed Geographic Extensions</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {plugins.filter((p) => p.enabled).length} Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{plugin.name}</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono text-cyan-400">
                    v{plugin.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">{plugin.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1">
                <span className="text-[10px] text-slate-500 font-mono">By {plugin.author}</span>
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                    plugin.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {plugin.enabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ETL Data Ingestion Pipelines */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="text-amber-400 w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">ETL Pipeline Scheduler</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Automated Data Sync Jobs</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {pipelines.map((job) => (
            <div
              key={job.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-200">{job.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Source: {job.sourceDataset} • Schedule: {job.frequency}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-[10px]">
                  <div className="text-emerald-400 font-bold">{job.recordsProcessed.toLocaleString()} records</div>
                  <div className="text-slate-500">Ran {job.lastRunTime}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  {job.lastRunStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
