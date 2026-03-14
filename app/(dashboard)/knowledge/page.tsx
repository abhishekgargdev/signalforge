'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { KnowledgeView } from '@/components/modules/KnowledgeView';
import { INITIAL_EXPERIENCES, INITIAL_PROJECTS } from '@/lib/signalforge-data';

export default function KnowledgePage() {
  const router = useRouter();

  return (
    <KnowledgeView
      experiences={INITIAL_EXPERIENCES}
      projects={INITIAL_PROJECTS}
      onDraftContentFromExperience={() => router.push('/content')}
    />
  );
}
