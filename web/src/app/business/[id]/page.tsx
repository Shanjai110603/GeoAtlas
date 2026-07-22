import { apiClient } from '@/lib/api-client';
import { BusinessCard } from '@/components/business/BusinessCard';
import { ReviewForm } from '@/components/business/ReviewForm';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { AttributionBadge } from '@/components/place/AttributionBadge';
import { MapView } from '@/components/map/MapView';
import { notFound } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: Props) {
  const { id } = await params;

  try {
    const data = await apiClient.getBusiness(id);
    const { business, reviews, attribution } = data;

    const center: [number, number] =
      business.geometry && business.geometry.type === 'Point'
        ? business.geometry.coordinates
        : [78.9629, 20.5937];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <BusinessCard
          name={business.name}
          nativeName={business.native_name}
          attributes={business.attributes || {}}
          confidenceScore={business.confidence_score}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ReviewForm businessId={id} />

            {/* Reviews List */}
            <Card glass className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-400" />
                Customer Reviews ({reviews ? reviews.length : 0})
              </h3>

              {!reviews || reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No approved reviews for this business yet.</p>
              ) : (
                <div className="flex flex-col gap-3 divide-y divide-slate-800/60">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-3 first:pt-0 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 text-sm">
                          {rev.display_name || 'Anonymous Contributor'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size={14} />
                      <p className="text-xs text-slate-300 mt-1">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {attribution && <AttributionBadge attribution={attribution} className="self-start" />}
          </div>

          <div className="h-[400px] lg:h-[550px] w-full sticky top-24">
            <MapView center={center} zoom={14} results={[business as any]} />
          </div>
        </div>
      </div>
    );
  } catch (_) {
    notFound();
  }
}
