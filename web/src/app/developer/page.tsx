'use client';

import React from 'react';
import { ApiKeyManager } from '@/components/developer/ApiKeyManager';
import { Code2, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Developer Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">GeoAtlas Developer API Portal</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">REST v1 & GraphQL Endpoints • OpenAPI 3.0 Specs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000/documentation"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" /> Interactive OpenAPI Docs
            </a>
          </div>
        </div>

        {/* API Key Management */}
        <ApiKeyManager />
      </div>
    </div>
  );
}
