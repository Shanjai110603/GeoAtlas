import { apiClient } from '@/lib/api-client';
import { StatisticChart } from '@/components/charts/StatisticChart';
import { Card } from '@/components/ui/Card';
import { AttributionBadge } from '@/components/place/AttributionBadge';
import { BarChart3, Layers, Globe, Maximize2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ admin_id: string }>;
}

export default async function StatisticsPage({ params }: Props) {
  const { admin_id } = await params;

  try {
    const data = await apiClient.getStatistics(admin_id);
    const { admin_unit, statistics, attribution } = data;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            <Globe size={14} />
            {admin_unit.country_code} • Level {admin_unit.level_number}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={32} />
            Statistical Overview: {admin_unit.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Aggregated entity counts, surface area metrics, and child unit structures derived from open spatial databases.
          </p>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card glass>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Surface Area</span>
            <p className="text-2xl font-black text-slate-100 mt-1">
              {statistics.area_sq_km ? `${statistics.area_sq_km.toLocaleString()} sq km` : 'N/A'}
            </p>
          </Card>
          <Card glass>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Child Admin Units</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{statistics.child_admin_units}</p>
          </Card>
          <Card glass>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recorded Entities</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {statistics.entity_counts.reduce((acc, curr) => acc + curr.count, 0)}
            </p>
          </Card>
        </div>

        {/* Entity Type Distribution Chart */}
        <Card glass className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            Entity Distribution by Type
          </h2>
          <StatisticChart data={statistics.entity_counts} />
        </Card>

        {attribution && <AttributionBadge attribution={attribution} className="self-start" />}
      </div>
    );
  } catch (_) {
    notFound();
  }
}
