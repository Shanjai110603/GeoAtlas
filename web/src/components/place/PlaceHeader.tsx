import React from 'react';
import Link from 'next/link';
import { HierarchyItem } from '@/lib/types';
import { ChevronRight, MapPin, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface PlaceHeaderProps {
  id: string;
  name: string;
  nativeName?: string;
  levelNumber?: number;
  localTerm?: string;
  countryCode?: string;
  entityType?: string;
  ancestors?: HierarchyItem[];
}

export const PlaceHeader: React.FC<PlaceHeaderProps> = ({
  name,
  nativeName,
  levelNumber,
  localTerm,
  countryCode,
  entityType,
  ancestors = [],
}) => {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-800 pb-6 w-full">
      {/* Breadcrumb Hierarchy */}
      {ancestors.length > 0 && (
        <nav className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Global
          </Link>
          {ancestors.map((anc) => (
            <React.Fragment key={anc.id}>
              <ChevronRight size={12} className="text-slate-600 shrink-0" />
              <Link href={`/place/${anc.id}`} className="hover:text-blue-400 transition-colors">
                {anc.name}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Title Block */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <MapPin className="text-blue-500 shrink-0" size={32} />
              {name}
            </h1>
            {nativeName && (
              <span className="text-xl sm:text-2xl text-slate-400 font-normal">
                ({nativeName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
            {countryCode && (
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md text-slate-300 font-mono">
                <Globe size={12} className="text-blue-400" />
                {countryCode}
              </span>
            )}
            {entityType && <Badge variant="emerald">{entityType}</Badge>}
            {localTerm && (
              <Badge variant="default">
                Level {levelNumber}: {localTerm}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
