import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AttributionBadge } from '@/components/place/AttributionBadge';

export interface CompareTableProps {
  items: Array<{
    id: string;
    name: string;
    level_number: number;
    local_term?: string;
    country_code: string;
    area_sq_km: number;
  }>;
  attribution?: string;
}

export const CompareTable: React.FC<CompareTableProps> = ({ items, attribution }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card glass className="w-full overflow-x-auto p-0 border border-slate-800">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-slate-400">Metric</th>
            {items.map((item) => (
              <th key={item.id} className="p-4 font-bold text-base text-slate-100 min-w-[180px]">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          <tr>
            <td className="p-4 font-medium text-slate-400 text-xs">Country Code</td>
            {items.map((item) => (
              <td key={item.id} className="p-4 font-mono text-sm text-blue-400">
                {item.country_code}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-slate-400 text-xs">Admin Level</td>
            {items.map((item) => (
              <td key={item.id} className="p-4">
                <Badge variant="default">Level {item.level_number}</Badge>
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-slate-400 text-xs">Local Terminology</td>
            {items.map((item) => (
              <td key={item.id} className="p-4 italic text-slate-300">
                {item.local_term || '—'}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-slate-400 text-xs">Surface Area</td>
            {items.map((item) => (
              <td key={item.id} className="p-4 font-bold text-emerald-400">
                {item.area_sq_km ? `${item.area_sq_km.toLocaleString()} sq km` : '—'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {attribution && <AttributionBadge attribution={attribution} className="m-4 text-xs" />}
    </Card>
  );
};
