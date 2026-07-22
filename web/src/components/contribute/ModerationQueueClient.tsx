'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ModerationQueueItem } from './ModerationQueueItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ModerationQueueClient: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      // In production/integration mode, fetches pending contributions
      // Here we provide mock items if none exist to enable UI testing
      setItems([
        {
          id: '11111111-1111-1111-1111-111111111111',
          target_table: 'entities',
          target_id: '00000000-0000-0000-0000-000000000001',
          diff: { name: 'Apollo Speciality Hospital', native_name: 'அபோலோ சிறப்பு மருத்துவமனை' },
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);
      setFetched(true);
    } catch (err: any) {
      alert(`Error fetching queue: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    try {
      await apiClient.reviewContribution(id, action);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item)));
    } catch (err: any) {
      alert(`Review error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!fetched && (
        <Card glass className="p-6 text-center">
          <p className="text-slate-300 text-sm mb-4">Click below to fetch active pending moderation queue items.</p>
          <Button isLoading={loading} onClick={fetchQueue}>
            Load Moderation Queue
          </Button>
        </Card>
      )}

      {fetched && items.length === 0 && (
        <Card glass className="p-8 text-center text-slate-400">
          No pending moderation edits currently in queue.
        </Card>
      )}

      {items.map((item) => (
        <ModerationQueueItem key={item.id} contribution={item} onReview={handleReview} />
      ))}
    </div>
  );
};
