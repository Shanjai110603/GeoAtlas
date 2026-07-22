'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contributionSchema } from '@/lib/schemas';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

type EditFormValues = z.infer<typeof contributionSchema>;

export const EditForm: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('hospital');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      target_table: 'entities',
      entity_type: 'hospital',
    },
  });

  const onSubmit = async (data: EditFormValues) => {
    setServerError(null);
    try {
      const diffPayload = {
        name: data.name,
        native_name: data.native_name,
        entity_type: selectedType,
        attributes: {
          submitted_at: new Date().toISOString(),
          source_attribution: data.source || 'GeoAtlas Community Editor',
        },
      };

      const res = await apiClient.submitContribution(
        data.target_table,
        data.target_id || null,
        diffPayload,
        data.source || 'community_web_editor'
      );

      if (res.contribution && res.contribution.id) {
        router.push(`/contribute/${res.contribution.id}`);
      }
    } catch (err: any) {
      setServerError(err.message || 'Failed to submit contribution');
    }
  };

  return (
    <Card glass className="p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Submit Geographic Data Edit / Creation</h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Target Classification</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="hospital">Hospital & Healthcare</option>
            <option value="school">School & Education</option>
            <option value="business">Local Business</option>
            <option value="waterway">Waterway / River</option>
            <option value="mountain">Mountain / Peak</option>
          </select>
        </div>

        <Input label="Location Name (English)" placeholder="e.g. Apollo Hospital" {...register('name')} error={errors.name?.message} />

        <Input label="Native Name (Local Script)" placeholder="e.g. அபோலோ மருத்துவமனை" {...register('native_name')} />

        <Input label="Data Source / Provenance" placeholder="e.g. OpenStreetMap / Field Survey" {...register('source')} />

        <Button type="submit" isLoading={isSubmitting} className="self-start mt-2">
          Submit to Moderation Engine
        </Button>
      </form>
    </Card>
  );
};
