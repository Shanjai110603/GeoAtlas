'use client';

import React from 'react';
import { calculateLevelFromXP } from '@geoatlas/core';
import { Zap, Shield, Award } from 'lucide-react';

interface LevelProgressBarProps {
  xp: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ xp }) => {
  const info = calculateLevelFromXP(xp);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg">
            {info.level}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Contributor Level</div>
            <div className="text-base font-bold text-slate-100 flex items-center gap-2">
              Level {info.level} Explorer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-mono capitalize">
                {info.trustTier} tier
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            {xp.toLocaleString()} XP
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Next Level: {info.nextLevelXP.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${info.progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Progress to Level {info.level + 1}</span>
          <span className="font-bold text-slate-300">{info.progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
