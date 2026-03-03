import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { INITIAL_FAANG_COMMENT_CRON, FaangCommentCronConfig } from '@/lib/signalforge-data';

let activeCommentCron: FaangCommentCronConfig = { ...INITIAL_FAANG_COMMENT_CRON };

export async function GET() {
  try {
    await requireAuth();
    return standardResponse({ cronConfig: activeCommentCron });
  } catch (err: any) {
    return standardError('CRON_FETCH_ERROR', err.message || 'Failed to fetch comment cron config', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { action, updates } = body;

    if (action === 'trigger_hunt_now') {
      activeCommentCron.lastRunTime = 'Just now (Manual Cron Execution)';
      activeCommentCron.commentsPostedToday = Math.min(
        activeCommentCron.dailyCommentLimit,
        activeCommentCron.commentsPostedToday + 1
      );
      activeCommentCron.totalProfileViewsGained += 28;

      return standardResponse({
        cronConfig: activeCommentCron,
        huntResult: {
          scannedProfiles: 5,
          newPostsFound: 2,
          synthesizedComments: 6,
          message: 'Cron successfully scanned monitored FAANG leaders and prepared top technical comments.',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (action === 'toggle_active') {
      activeCommentCron.isActive = !activeCommentCron.isActive;
      return standardResponse({ cronConfig: activeCommentCron });
    }

    if (action === 'toggle_autopost') {
      activeCommentCron.autoPostEnabled = !activeCommentCron.autoPostEnabled;
      return standardResponse({ cronConfig: activeCommentCron });
    }

    if (updates) {
      activeCommentCron = {
        ...activeCommentCron,
        ...updates,
      };
      return standardResponse({ cronConfig: activeCommentCron });
    }

    return standardResponse({ cronConfig: activeCommentCron });
  } catch (err: any) {
    return standardError('CRON_UPDATE_ERROR', err.message || 'Failed to update comment cron config', 500);
  }
}
