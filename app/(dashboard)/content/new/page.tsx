'use client';

import React from 'react';
import { ContentView } from '@/components/modules/ContentView';
import {
  INITIAL_CONTENT_PIPELINE,
  INITIAL_TOPIC_SIGNALS,
  INITIAL_EXPERIENCES,
  ContentItem
} from '@/lib/signalforge-data';

export default function NewContentPage() {
  const [pipeline, setPipeline] = React.useState(INITIAL_CONTENT_PIPELINE);

  const handleAddNewItem = (newItem: ContentItem) => {
    setPipeline((prev) => [newItem, ...prev]);
  };

  return (
    <ContentView
      pipeline={pipeline}
      signals={INITIAL_TOPIC_SIGNALS}
      experiences={INITIAL_EXPERIENCES}
      onAddNewContentItem={handleAddNewItem}
    />
  );
}
