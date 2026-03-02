export const PROMPT_LIBRARY = [
  {
    id: 'article-writer',
    name: 'Technical article writer',
    category: 'Editorial',
    promptText:
      'Draft a publication-grade systems essay. Include a direct title and excerpt, a table of contents with 4 to 6 sections, concrete invariants, a production pitfall, and SEO fields (meta title under 60 characters, meta description under 160, slug). Do not invent the author\'s employers or metrics.',
  },
  {
    id: 'comment-generator',
    name: 'Comment generator',
    category: 'Engagement',
    promptText:
      'Write four distinct comments: technical insight, personal perspective grounded only in supplied experience, a constructive question, and an alternative perspective. No generic praise. Keep each comment between 180 and 450 characters.',
  },
  {
    id: 'topic-strategist',
    name: 'Topic strategist',
    category: 'Research',
    promptText:
      'Analyze the source material. Attribute the source, score career alignment for the user\'s target role, and note where the finding contradicts a common assumption. Propose content angles the user can publish from their own experience.',
  },
];
