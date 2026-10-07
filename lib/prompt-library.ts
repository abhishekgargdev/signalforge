import { prompt } from '@/lib/prompts';

export const PROMPT_LIBRARY = [
  {
    id: 'article-writer',
    name: 'Technical article writer',
    category: 'Editorial',
    promptText: prompt('article'),
  },
  {
    id: 'comment-generator',
    name: 'Comment generator',
    category: 'Engagement',
    promptText: prompt('comment-set', {
      sender: '{{sender}}',
      author: '{{author}}',
      role: '{{role}}',
      company: '{{company}}',
      postText: '{{postText}}',
      extra: '',
    }),
  },
  {
    id: 'topic-strategist',
    name: 'Topic strategist',
    category: 'Research',
    promptText: prompt('topic', { background: '{{background}}', items: '{{items}}' }),
  },
];
