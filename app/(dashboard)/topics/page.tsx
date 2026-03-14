'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DiscoverView } from '@/components/modules/DiscoverView';
import { INITIAL_TOPIC_SIGNALS } from '@/lib/signalforge-data';

export default function TopicsPage() {
  const router = useRouter();

  return (
    <DiscoverView
      signals={INITIAL_TOPIC_SIGNALS}
      onSelectTopic={() => {}}
      onDraftContent={() => router.push('/content')}
    />
  );
}
