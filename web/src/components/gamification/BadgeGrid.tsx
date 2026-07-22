'use client';

import React from 'react';
import { BADGE_DEFINITIONS } from '@geoatlas/core';
import { MapPin, Camera, ShieldCheck, Award, Lock } from 'lucide-react';

interface BadgeGridProps {
  userXP: number;
}

const ICON_MAP: Record<string, any> = {
  MapPin,
  Camera,
  ShieldCheck,
  Award,
};

export const BadgeGrid: React.FC<BadgeGridProps> = ({ userXP }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="text-amber-400 w-5 h-5" />
          <h3 className="font-bold text-base text-slate-100">Achievement Badges</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {BADGE_DEFINITIONS.filter((b) => userXP >= b.requiredXP).length} / {BADGE_DEFINITIONS.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BADGE_DEFINITIONS.map((badge) => {
          const isUnlocked = userXP >= badge.requiredXP;
          const IconComponent = ICON_MAP[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                isUnlocked
                  ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/30 border-slate-800/40 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                  isUnlocked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isUnlocked ? <IconComponent className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{badge.name}</span>
                  {isUnlocked && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{badge.description}</p>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Requires: {badge.requiredXP.toLocaleString()} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
