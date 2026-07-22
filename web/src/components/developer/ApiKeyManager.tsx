'use client';

import React, { useState } from 'react';
import { SAMPLE_API_KEYS, SAMPLE_USAGE_QUOTA, generateNewApiKey, ApiKeyRecord } from '@geoatlas/core';
import { Key, Plus, Copy, Check, Eye, EyeOff, ShieldCheck, Zap, Server } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(SAMPLE_API_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey = generateNewApiKey(newKeyName, 'production');
    setKeys([newKey, ...keys]);
    setNewKeyName('');
  };

  const handleCopy = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskSecret = (secret: string, isVisible: boolean) => {
    if (isVisible) return secret;
    return `${secret.slice(0, 12)}************************`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* API Usage Quota Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="text-cyan-400 w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">API Usage & Rate Limit Quota</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Monthly Quota</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Requests This Month</div>
            <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
              {SAMPLE_USAGE_QUOTA.totalRequestsThisMonth.toLocaleString()} / {SAMPLE_USAGE_QUOTA.monthlyLimit.toLocaleString()}
            </div>
          </div>
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Rate Limit Cap</div>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
              {SAMPLE_USAGE_QUOTA.rateLimitPerMin} req/min
            </div>
          </div>
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Active Credentials</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {keys.length} Production Keys
            </div>
          </div>
        </div>
      </div>

      {/* Key Generator & Credentials List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="text-emerald-400 w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">API Credentials & Tokens</h3>
          </div>
        </div>

        {/* Generate Key Form */}
        <form onSubmit={handleCreateKey} className="flex gap-2">
          <Input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Enter key descriptive label (e.g. Mobile Production App)..."
            className="flex-1 bg-slate-950 border-slate-800 text-xs"
          />
          <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Create API Key
          </Button>
        </form>

        {/* Keys List */}
        <div className="flex flex-col gap-2.5 mt-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono"
            >
              <div>
                <div className="text-xs font-bold text-slate-100 font-sans flex items-center gap-2">
                  {key.name}
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                    {key.environment}
                  </span>
                </div>
                <div className="text-xs text-cyan-400 mt-1 flex items-center gap-2">
                  <span>{maskSecret(key.keySecret, !!visibleSecrets[key.id])}</span>
                  <button
                    onClick={() => toggleSecretVisibility(key.id)}
                    className="text-slate-500 hover:text-slate-300 p-0.5"
                  >
                    {visibleSecrets[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-500">Last used {key.lastUsedAt}</span>
                <button
                  onClick={() => handleCopy(key.id, key.keySecret)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition font-sans font-medium"
                >
                  {copiedId === key.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" /> Copy Secret
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
