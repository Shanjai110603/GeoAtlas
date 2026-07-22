'use client';

import React, { useState } from 'react';
import { SAMPLE_LEADERBOARD_ENTRIES } from '@geoatlas/core';
import { Trophy, Globe, Filter, Zap, Award } from 'lucide-react';

export const LeaderboardTable: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredEntries = SAMPLE_LEADERBOARD_ENTRIES.filter((e) =>
    selectedRegion === 'All' ? true : e.region.includes(selectedRegion)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Trophy className="text-amber-400 w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg text-slate-100">Global Geographic Contributor Rankings</h3>
            <p className="text-xs text-slate-400">Monthly leaderboard based on accepted edits, reviews, and verified data.</p>
          </div>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none font-medium"
          >
            <option value="All">All Regions (Global)</option>
            <option value="India">India</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Contributor</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-4 text-center">Accepted Edits</th>
              <th className="py-3 px-4 text-center">Badges</th>
              <th className="py-3 px-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEntries.map((entry) => (
              <tr key={entry.userId} className="hover:bg-slate-900/50 transition">
                <td className="py-3.5 px-4 font-bold text-sm">
                  {entry.rank === 1 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">1</span>
                  ) : entry.rank === 2 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40">2</span>
                  ) : entry.rank === 3 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40">3</span>
                  ) : (
                    <span className="text-slate-500 font-mono pl-1.5">{entry.rank}</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-100">{entry.displayName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Level {entry.level}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{entry.region}</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-400">{entry.acceptedEdits}</td>
                <td className="py-3.5 px-4 text-center font-mono text-amber-400 font-semibold">{entry.badgesCount}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {entry.xp.toLocaleString()}
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
