'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export interface PhotoUploaderProps {
  businessId: string;
  onPhotoUploaded: (fileKey: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ businessId, onPhotoUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Step 1: Request presigned upload URL from Phase 1 API
      const presignRes = await apiClient.getPresignedPhotoUrl(businessId, file.name, file.type);

      // Step 2: Upload directly to MinIO object storage using presigned URL
      const uploadRes = await fetch(presignRes.upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Direct storage upload failed with status ${uploadRes.status}`);
      }

      setUploadedKey(presignRes.object_key);
      onPhotoUploaded(presignRes.object_key);
    } catch (err: any) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
        <ImageIcon size={14} className="text-blue-400" />
        Attach Business Storefront Photo (Presigned MinIO Upload)
      </label>

      {uploadedKey ? (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="truncate">Photo uploaded to MinIO object storage!</span>
          <Badge variant="pending" className="ml-auto text-[10px]">
            Moderation Pending
          </Badge>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
          />
          {uploading && <span className="text-xs text-blue-400 ml-2 animate-pulse">Uploading to MinIO...</span>}
        </div>
      )}

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};
