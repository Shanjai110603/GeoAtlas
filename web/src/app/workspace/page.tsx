'use client';

import React from 'react';
import { AuditLogTable } from '@/components/workspace/AuditLogTable';
import { TeamMemberList } from '@/components/workspace/TeamMemberList';
import { Building2, Shield, Lock, Globe } from 'lucide-react';

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Workspace Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Global Geographic Analytics Corp</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Enterprise Organization Workspace • Slug: geo-corp</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold border border-emerald-500/40 uppercase">
                  SAML 2.0 SSO Active
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-semibold border border-cyan-500/40 uppercase">
                  Enterprise Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members & Audit Trail Grid */}
        <TeamMemberList />
        <AuditLogTable />
      </div>
    </div>
  );
}
