'use client';

import { SimpleListView } from '@/components/modules/SimpleListView';

export default function OccasionsPage() {
  return (
    <SimpleListView
      title="Occasions"
      subtitle="Dates that should get their own post. Use MM-DD, for example 10-02."
      endpoint="/api/v1/occasions"
      listKey="occasions"
      noun="occasion"
      fillKey="note"
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'date', label: 'Date (MM-DD)' },
        { key: 'note', label: 'What the post should say', multiline: true },
      ]}
    />
  );
}
