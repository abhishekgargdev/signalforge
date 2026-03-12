'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CompaniesView } from '@/components/modules/CompaniesView';
import { INITIAL_COMPANIES, INITIAL_PEOPLE } from '@/lib/signalforge-data';

export default function PeoplePage() {
  const router = useRouter();

  return (
    <CompaniesView
      companies={INITIAL_COMPANIES}
      people={INITIAL_PEOPLE}
      onNavigateToEngagement={() => router.push('/engagement')}
    />
  );
}
