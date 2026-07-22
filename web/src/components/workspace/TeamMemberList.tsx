'use client';

import React from 'react';
import { SAMPLE_WORKSPACE, WorkspaceMember } from '@geoatlas/core';
import { Users, UserCheck, Shield, Key } from 'lucide-react';

export const TeamMemberList: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Users className="text-cyan-400 w-5 h-5" />
          <h3 className="font-bold text-base text-slate-100">Team Members & Role Access</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {SAMPLE_WORKSPACE.members.length} Active Members
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {SAMPLE_WORKSPACE.members.map((member) => (
          <div
            key={member.userId}
            className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                {member.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">{member.displayName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{member.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded font-mono font-semibold uppercase text-cyan-400">
                Role: {member.role}
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Joined {member.joinedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
