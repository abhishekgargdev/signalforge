'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CareerView } from '@/components/modules/CareerView';
import { INITIAL_CAREER_GOAL } from '@/lib/signalforge-data';

export default function CareerDashboardPage() {
  const router = useRouter();

  return (
    <CareerView
      career={INITIAL_CAREER_GOAL}
      onNavigateToContent={() => router.push('/content')}
    />
  );
}
