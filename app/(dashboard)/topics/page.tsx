'use client';

import { SimpleListView } from '@/components/modules/SimpleListView';

export default function TopicsPage() {
  return (
    <SimpleListView
      title="Topics"
      subtitle="Subjects you want posts and articles written about."
      endpoint="/api/v1/topics"
      listKey="topics"
      noun="topic"
      fillKey="summary"
      fields={[
        { key: 'title', label: 'Topic' },
        { key: 'summary', label: 'Angle you want to take', multiline: true },
      ]}
    />
  );
}
