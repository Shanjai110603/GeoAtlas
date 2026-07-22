'use client';

import React from 'react';
import { PluginCard } from '@/components/plugins/PluginCard';

export default function PluginsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <PluginCard />
      </div>
    </div>
  );
}
