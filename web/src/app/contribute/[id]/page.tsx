'use client';

import React, { use } from 'react';
import { useContributionStatus } from '@/hooks/useContribution';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ContributionStatusPage({ params }: Props) {
  const { id } = use(params);
  const { data, isLoading, error } = useContributionStatus(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data || !data.contribution) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-400">
        Contribution record not found or error loading status.
      </div>
    );
  }

  const item = data.contribution;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6">
      <Card glass className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
              Contribution Tracking ID
            </span>
            <h1 className="text-xl font-mono font-bold text-slate-100">{item.id}</h1>
          </div>
          <Badge variant={item.status} className="text-sm px-3 py-1">
            {item.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {item.status === 'pending' && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 flex items-center gap-3 w-full">
              <Clock className="animate-spin text-amber-400 shrink-0" size={20} />
              <div className="text-xs">
                <p className="font-semibold">Queued for Moderation Review</p>
                <p className="text-amber-400/80">Polling automatically for status updates...</p>
              </div>
            </div>
          )}

          {item.status === 'approved' && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 flex items-center gap-3 w-full">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
              <div className="text-xs">
                <p className="font-semibold">Approved & Applied to GeoAtlas Database!</p>
                <p className="text-emerald-400/80">This contribution is now live in the platform.</p>
              </div>
            </div>
          )}

          {item.status === 'rejected' && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 flex items-center gap-3 w-full">
              <XCircle className="text-red-400 shrink-0" size={20} />
              <div className="text-xs">
                <p className="font-semibold">Contribution Rejected by Moderator</p>
                <p className="text-red-400/80">Did not pass provenance or quality guidelines.</p>
              </div>
            </div>
          )}
        </div>

        {/* Diff Data */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Submitted Edit Payload</span>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
            {JSON.stringify(item.diff, null, 2)}
          </pre>
        </div>

        <Link href="/" className="text-xs text-blue-400 hover:underline self-start">
          ← Return to GeoAtlas Home
        </Link>
      </Card>
    </div>
  );
}
