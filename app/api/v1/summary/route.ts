import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Content } from '@/models/Content';
import { Article } from '@/models/Article';
import { Company } from '@/models/Company';
import { Topic } from '@/models/Topic';
import { ConnectionLead } from '@/models/ConnectionLead';
import { CommentDraft } from '@/models/CommentDraft';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const userId = user.id;
    const [posts, articles, companies, topics, connections, comments] = await Promise.all([
      Content.find({ userId }).select('status').lean(),
      Article.countDocuments({ userId }),
      Company.countDocuments({ userId }),
      Topic.countDocuments({ userId }),
      ConnectionLead.find({ userId }).select('status').lean(),
      CommentDraft.find({ userId }).select('status').lean(),
    ]);
    const postStatus = posts.reduce<Record<string, number>>((acc, post) => {
      const key = String(post.status || 'DRAFT');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return standardResponse({
      posts: posts.length,
      postStatus,
      articles,
      companies,
      topics,
      connections: connections.length,
      connectionsInvited: connections.filter((item) => item.status === 'invited').length,
      comments: comments.length,
      commentsPosted: comments.filter((item) => item.status === 'posted').length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load summary';
    return standardError('SUMMARY_ERROR', message, 500);
  }
}
