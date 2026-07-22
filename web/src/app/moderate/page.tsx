import { isModerator, getServerSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ModerationQueueClient } from '@/components/contribute/ModerationQueueClient';

export default async function ModeratePage() {
  const session = await getServerSession();
  const hasAccess = await isModerator();

  if (!session || !hasAccess) {
    redirect('/login');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <ShieldCheck size={16} /> Trust Tier Authorized: {session.trust_tier}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Moderation Review Queue</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review pending community edits, audit diffs, and approve or reject submissions to update the global spatial graph.
        </p>
      </div>

      <ModerationQueueClient />
    </div>
  );
}
