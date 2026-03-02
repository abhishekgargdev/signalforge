'use client';

import { SimpleListView } from '@/components/modules/SimpleListView';

export default function CompaniesPage() {
  return (
    <SimpleListView
      title="Target companies"
      subtitle="Companies you want your posts and articles to reach."
      endpoint="/api/v1/companies"
      listKey="companies"
      noun="company"
      fillKey="description"
      fields={[
        { key: 'name', label: 'Company name' },
        { key: 'description', label: 'Why this company should notice you', multiline: true },
        { key: 'headquarters', label: 'Website (optional)' },
      ]}
    />
  );
}
