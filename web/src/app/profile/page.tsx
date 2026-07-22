'use client';

import React from 'react';
import { LevelProgressBar } from '@/components/gamification/LevelProgressBar';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { User, MapPin, CheckCircle, ShieldCheck, History, Award } from 'lucide-react';

export default function ProfilePage() {
  const userXP = 750; // User profile sample XP

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Profile Header Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg">
              JS
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Shanjai (Local Explorer)</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Member since 2026 • Region: India / Tamil Nadu
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/40 font-mono font-semibold">
                  Trusted Contributor
                </span>
                <span className="text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono font-semibold">
                  Level 3 Explorer
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center">
            <div>
              <div className="text-base font-bold text-cyan-400 font-mono">18</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Accepted Edits</div>
            </div>
            <div>
              <div className="text-base font-bold text-amber-400 font-mono">3</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Badges</div>
            </div>
            <div>
              <div className="text-base font-bold text-emerald-400 font-mono">750</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total XP</div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <LevelProgressBar xp={userXP} />

        {/* Achievement Badges */}
        <BadgeGrid userXP={userXP} />

        {/* Recent Contribution History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="text-cyan-400 w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">Contribution History</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Updated Building Footprint for Apollo Hospital
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Approved • +50 XP</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Yesterday</span>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Uploaded Storefront Photo for Tech Park Cafe
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Approved • +30 XP</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
