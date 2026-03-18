'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArticlesView } from '@/components/modules/ArticlesView';
import { INITIAL_ARTICLES, ArticleItem } from '@/lib/signalforge-data';

export default function ArticlesDashboardPage() {
  const router = useRouter();

  const handleOpenPublicArticle = (art: ArticleItem) => {
    router.push(`/articles/${art.slug}`);
  };

  return (
    <ArticlesView
      articles={INITIAL_ARTICLES}
      onOpenPublicArticle={handleOpenPublicArticle}
    />
  );
}
