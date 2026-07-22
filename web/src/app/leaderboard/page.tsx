'use client';

import React from 'react';
import { LeaderboardTable } from '@/components/gamification/LeaderboardTable';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <LeaderboardTable />
      </div>
    </div>
  );
}
