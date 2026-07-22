import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { MapView } from '@/components/map/MapView';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/api-client';
import { Search, GitCompare, PlusCircle, Sparkles, MapPin, Layers, Globe } from 'lucide-react';

export default async function HomePage() {
  let recentEntities: any[] = [];
  try {
    const res = await apiClient.getEntities(undefined, undefined, undefined, 'recent', 6);
    recentEntities = res.entities || [];
  } catch (_) {}

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section with Integrated Map Background */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <MapView className="absolute inset-0 h-full w-full z-0 pointer-events-auto" zoom={4} />

        {/* Floating Search Overlay Card */}
        <div className="relative z-10 max-w-2xl w-full px-4 text-center flex flex-col items-center gap-6">
          <div className="p-4 bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl w-full flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest">
              <Sparkles size={14} /> Open Geographic Intelligence Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
              Wikipedia for Geography
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore multi-polygon administrative boundaries, hospitals, schools, and business directories worldwide.
            </p>

            <div className="mt-2">
              <SearchBar placeholder="Search any city, district, school, or hospital..." onSearch={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/search?q=Tamil+Nadu" className="group">
          <Card glass className="p-6 h-full flex flex-col justify-between group-hover:border-blue-500/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <Globe size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                Explore India / Tamil Nadu
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Browse validation region boundaries, district level hierarchies, and full OSM spatial extracts.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-400 mt-4 inline-flex items-center gap-1">
              Start Exploring →
            </span>
          </Card>
        </Link>

        <Link href="/compare" className="group">
          <Card glass className="p-6 h-full flex flex-col justify-between group-hover:border-emerald-500/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <GitCompare size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Geographic Comparison
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Side-by-side metric table comparing land surface areas, admin levels, and entity counts.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 mt-4 inline-flex items-center gap-1">
              Compare Places →
            </span>
          </Card>
        </Link>

        <Link href="/contribute" className="group">
          <Card glass className="p-6 h-full flex flex-col justify-between group-hover:border-purple-500/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <PlusCircle size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                Community Editing
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Submit geographic corrections and new POIs into our provenance moderation queue.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-400 mt-4 inline-flex items-center gap-1">
              Submit Edit →
            </span>
          </Card>
        </Link>
      </section>

      {/* Recent Entity Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles size={20} className="text-blue-400" />
              Recently Verified Highlights
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live geographic entities and administrative units registered in the platform.
            </p>
          </div>
          <Link href="/search?q=a" className="text-xs font-semibold text-blue-400 hover:underline">
            View All Places →
          </Link>
        </div>

        {recentEntities.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No recent highlights recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntities.map((item) => (
              <Link key={item.id} href={`/place/${item.id}`}>
                <Card glass className="p-4 hover:border-blue-500/40 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-blue-400 shrink-0" />
                        {item.name}
                      </h4>
                      {item.native_name && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.native_name}</p>
                      )}
                    </div>
                    {item.entity_type && <Badge variant="emerald">{item.entity_type}</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
