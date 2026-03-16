'use client';

import React from 'react';
import { EngagementView } from '@/components/modules/EngagementView';
import { INITIAL_ENGAGEMENTS, INITIAL_PEOPLE } from '@/lib/signalforge-data';

export default function EngagementPage() {
  return (
    <EngagementView
      opportunities={INITIAL_ENGAGEMENTS}
      people={INITIAL_PEOPLE}
    />
  );
}
