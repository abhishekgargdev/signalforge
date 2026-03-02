import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import { CommentDraft } from '@/models/CommentDraft';

function mapDraft(row: { _id: { toString(): string }; author: string; excerpt: string; comment: string; status: string; dayKey: string }) {
  return {
    id: row._id.toString(),
    author: row.author,
    excerpt: row.excerpt,
    comment: row.comment,
    status: row.status,
    dayKey: row.dayKey,
  };
}

export async function GET() {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const rows = await CommentDraft.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    return standardResponse({ comments: rows.map(mapDraft) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load comments';
    return standardError('COMMENTS_FETCH_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const body = await req.json();
    const saved = await CommentDraft.findOneAndUpdate(
      { _id: body.id, userId: user.id },
      { comment: body.comment, status: body.status },
      { new: true }
    );
    if (!saved) return standardError('COMMENT_UPDATE_ERROR', 'Comment was not found', 404);
    return standardResponse({
      comment: mapDraft(saved),
      linkedinPosted: false,
      message: 'The comment is saved here. LinkedIn profile access cannot publish it automatically.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update comment';
    return standardError('COMMENT_UPDATE_ERROR', message, 500);
  }
}
