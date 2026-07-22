import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { PlaceHeader } from '@/components/place/PlaceHeader';
import { PlaceInfoTabs } from '@/components/place/PlaceInfoTabs';
import { AttributionBadge } from '@/components/place/AttributionBadge';
import { MapView } from '@/components/map/MapView';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await apiClient.getAdminUnit(id);
    const unit = data.admin_unit;
    return {
      title: `${unit.name} (${unit.country_code}) — GeoAtlas`,
      description: `Detailed geographic profile, administrative hierarchy, and spatial data for ${unit.name} (${unit.native_name || unit.country_code}).`,
    };
  } catch (_) {
    try {
      const entityData = await apiClient.getEntity(id);
      const entity = entityData.entity;
      return {
        title: `${entity.name} — GeoAtlas`,
        description: `Spatial profile, attributes, and map coordinates for ${entity.name} (${entity.entity_type}).`,
      };
    } catch (_) {
      return {
        title: 'Location Profile — GeoAtlas',
      };
    }
  }
}

export default async function PlacePage({ params }: Props) {
  const { id } = await params;

  let isAdmin = false;
  let adminUnit: any = null;
  let children: any[] = [];
  let ancestors: any[] = [];
  let entity: any = null;
  let attribution = '';

  try {
    const adminData = await apiClient.getAdminUnit(id);
    adminUnit = adminData.admin_unit;
    children = adminData.children || [];
    attribution = adminData.attribution || '';
    isAdmin = true;

    try {
      const hierarchyData = await apiClient.getHierarchy(id);
      ancestors = hierarchyData.ancestors || [];
    } catch (_) {}
  } catch (_) {
    try {
      const entityData = await apiClient.getEntity(id);
      entity = entityData.entity;
      attribution = entityData.attribution || '';
    } catch (_) {
      notFound();
    }
  }

  const title = isAdmin ? adminUnit.name : entity.name;
  const nativeName = isAdmin ? adminUnit.native_name : entity.native_name;
  const geometry = isAdmin ? adminUnit.geometry : entity.geometry;
  const centroid = isAdmin ? adminUnit.centroid : null;

  const center: [number, number] = centroid
    ? centroid.coordinates
    : geometry && geometry.type === 'Point'
    ? geometry.coordinates
    : [78.9629, 20.5937];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header section */}
      <PlaceHeader
        id={id}
        name={title}
        nativeName={nativeName}
        levelNumber={isAdmin ? adminUnit.level_number : undefined}
        localTerm={isAdmin ? adminUnit.local_term : undefined}
        countryCode={isAdmin ? adminUnit.country_code : undefined}
        entityType={!isAdmin ? entity.entity_type : undefined}
        ancestors={ancestors}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Attributes */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PlaceInfoTabs
            attributes={isAdmin ? {} : entity.attributes || {}}
            areaSqKm={isAdmin ? adminUnit.area_sq_km : undefined}
          />

          {/* Child administrative units list */}
          {isAdmin && children.length > 0 && (
            <Card glass className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers size={18} className="text-blue-400" />
                Child Administrative Units ({children.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/place/${child.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">
                        {child.name}
                      </p>
                      {child.local_term && (
                        <p className="text-[11px] text-slate-500">{child.local_term}</p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-400" />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {attribution && <AttributionBadge attribution={attribution} className="self-start mt-2" />}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="h-[450px] lg:h-[600px] w-full sticky top-24">
          <MapView
            center={center}
            zoom={isAdmin ? 8 : 12}
            results={[{ id, name: title, geometry } as any]}
          />
        </div>
      </div>
    </div>
  );
}
