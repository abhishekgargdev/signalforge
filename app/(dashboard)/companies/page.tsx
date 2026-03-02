'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CompaniesView } from '@/components/modules/CompaniesView';
import { INITIAL_COMPANIES, INITIAL_PEOPLE } from '@/lib/signalforge-data';

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'people' ? 'people' : 'companies';

  return (
    <CompaniesView
      companies={INITIAL_COMPANIES}
      people={INITIAL_PEOPLE}
      initialTab={initialTab}
      onNavigateToEngagement={() => router.push('/engagement')}
    />
  );
}
