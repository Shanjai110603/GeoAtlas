'use client';

import React from 'react';
import { AiAssistantDrawer } from '@/components/ai/AiAssistantDrawer';

export default function AiAssistantPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <AiAssistantDrawer />
      </div>
    </div>
  );
}
