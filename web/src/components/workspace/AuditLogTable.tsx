'use client';

import React from 'react';
import { SAMPLE_AUDIT_LOGS, AuditLogEvent } from '@geoatlas/core';
import { ShieldCheck, CheckCircle, AlertTriangle, History } from 'lucide-react';

export const AuditLogTable: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <History className="text-cyan-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Organization Audit Trail</h3>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Resource Target</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {SAMPLE_AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/50 transition">
                <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                <td className="py-3 px-4 font-sans font-bold text-slate-200">{log.actorName}</td>
                <td className="py-3 px-4 text-cyan-400">{log.action}</td>
                <td className="py-3 px-4 text-slate-400 font-sans">{log.resource}</td>
                <td className="py-3 px-4 text-right font-bold">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
