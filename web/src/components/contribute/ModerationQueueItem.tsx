'use client';

import React, { useState } from 'react';
import { Contribution } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, X, ShieldAlert } from 'lucide-react';

export interface ModerationQueueItemProps {
  contribution: Contribution;
  onReview: (id: string, action: 'approve' | 'reject') => Promise<void>;
}

export const ModerationQueueItem: React.FC<ModerationQueueItemProps> = ({ contribution, onReview }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      await onReview(contribution.id, action);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card glass className="flex flex-col gap-4 border-slate-800">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-base">
              Edit #{contribution.id.substring(0, 8)}
            </span>
            <Badge variant={contribution.status}>{contribution.status}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Target: <strong className="text-slate-200">{contribution.target_table}</strong> • Submitted{' '}
            {new Date(contribution.created_at).toLocaleString()}
          </p>
        </div>

        {contribution.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              isLoading={loading}
              onClick={() => handleAction('approve')}
              className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800/80"
            >
              <Check size={14} className="mr-1" /> Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={loading}
              onClick={() => handleAction('reject')}
            >
              <X size={14} className="mr-1" /> Reject
            </Button>
          </div>
        )}
      </div>

      {/* Diff View */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider mb-2">
          Proposed Diff Payload:
        </span>
        <pre className="text-xs font-mono text-emerald-400 overflow-x-auto">
          {JSON.stringify(contribution.diff, null, 2)}
        </pre>
      </div>
    </Card>
  );
};
