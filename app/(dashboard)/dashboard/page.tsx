'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardView } from '@/components/modules/DashboardView';
import {
  INITIAL_TOPIC_SIGNALS,
  INITIAL_COMPANIES,
  INITIAL_ENGAGEMENTS,
  INITIAL_CONTENT_PIPELINE,
  INITIAL_ARTICLES,
  INITIAL_CAREER_GOAL
} from '@/lib/signalforge-data';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <DashboardView
      signals={INITIAL_TOPIC_SIGNALS}
      companies={INITIAL_COMPANIES}
      engagements={INITIAL_ENGAGEMENTS}
      pipeline={INITIAL_CONTENT_PIPELINE}
      articles={INITIAL_ARTICLES}
      career={INITIAL_CAREER_GOAL}
      onNavigate={(mod) => router.push(`/${mod}`)}
      onSelectTopic={() => router.push('/discover')}
    />
  );
}
