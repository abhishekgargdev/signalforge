'use client';

import { useRouter } from 'next/navigation';
import { DashboardView } from '@/components/modules/DashboardView';

export default function DashboardPage() {
  const router = useRouter();
  return (
    <DashboardView
      onNavigate={(mod) => router.push(mod === 'articles' ? '/dashboard/articles' : `/${mod}`)}
    />
  );
}
