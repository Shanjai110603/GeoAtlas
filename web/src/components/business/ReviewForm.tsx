'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '@/lib/schemas';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { PhotoUploader } from './PhotoUploader';

type ReviewFormValues = z.infer<typeof reviewSchema>;

export interface ReviewFormProps {
  businessId: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ businessId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState<string[]>([]);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setServerMsg(null);
    try {
      const res = await apiClient.submitReview(businessId, rating, data.text, photos);
      setServerMsg(res.message || 'Review submitted and queued for moderation!');
      reset();
      setPhotos([]);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      setServerMsg(`Error: ${err.message}`);
    }
  };

  return (
    <Card glass className="p-6">
      <h3 className="text-base font-bold text-slate-100 mb-4">Write a Business Review</h3>

      {serverMsg && (
        <div className="mb-4 p-3 bg-blue-950/60 border border-blue-800 text-blue-300 text-xs rounded-xl">
          {serverMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Rating</label>
          <StarRating rating={rating} interactive onChange={(val) => setRating(val)} size={22} />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Review Experience</label>
          <textarea
            rows={3}
            placeholder="Share details of your experience with this business..."
            className="w-full px-3.5 py-2 text-sm bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            {...register('text')}
          />
          {errors.text && <span className="text-xs text-red-400">{errors.text.message}</span>}
        </div>

        <PhotoUploader
          businessId={businessId}
          onPhotoUploaded={(key) => setPhotos((prev) => [...prev, key])}
        />

        <Button type="submit" isLoading={isSubmitting} className="self-start mt-2">
          Submit Review (Queue Moderation)
        </Button>
      </form>
    </Card>
  );
};
