import { EditForm } from '@/components/contribute/EditForm';
import { PlusCircle } from 'lucide-react';

export default function ContributePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <PlusCircle className="text-blue-500" size={32} />
          Community Contribution Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Submit corrections, new entities, or attribute updates. All edits route through our automated provenance and trust-tier moderation pipeline.
        </p>
      </div>

      <EditForm />
    </div>
  );
}
