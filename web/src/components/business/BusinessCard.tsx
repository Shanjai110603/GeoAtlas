import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Clock, Phone, Globe, MapPin } from 'lucide-react';

export interface BusinessCardProps {
  name: string;
  nativeName?: string;
  attributes?: Record<string, any>;
  confidenceScore?: number;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  name,
  nativeName,
  attributes = {},
  confidenceScore,
}) => {
  return (
    <Card glass className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="text-blue-500" size={24} />
              {name}
            </h1>
            {nativeName && <span className="text-lg text-slate-400">({nativeName})</span>}
          </div>
          <Badge variant="emerald" className="mt-2">
            Verified Business Directory
          </Badge>
        </div>

        {confidenceScore && (
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
              Confidence Rating
            </span>
            <span className="text-base font-extrabold text-blue-400">
              {(confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
        {attributes.opening_hours && (
          <div className="flex items-center gap-2 text-slate-300">
            <Clock size={16} className="text-blue-400 shrink-0" />
            <span>{attributes.opening_hours}</span>
          </div>
        )}
        {attributes.phone && (
          <div className="flex items-center gap-2 text-slate-300">
            <Phone size={16} className="text-blue-400 shrink-0" />
            <span>{attributes.phone}</span>
          </div>
        )}
        {attributes.website && (
          <div className="flex items-center gap-2 text-slate-300">
            <Globe size={16} className="text-blue-400 shrink-0" />
            <a
              href={attributes.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline truncate"
            >
              {attributes.website}
            </a>
          </div>
        )}
        {attributes.address && (
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin size={16} className="text-blue-400 shrink-0" />
            <span className="truncate">{attributes.address}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
