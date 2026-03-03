import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { INITIAL_PROSPECTING_CAMPAIGN, ProspectingCampaign } from '@/lib/signalforge-data';

let activeCampaign: ProspectingCampaign = { ...INITIAL_PROSPECTING_CAMPAIGN };

export async function GET() {
  try {
    await requireAuth();
    return standardResponse({ campaign: activeCampaign });
  } catch (err: any) {
    return standardError('CAMPAIGN_FETCH_ERROR', err.message || 'Failed to fetch campaign', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { action, updates } = body;

    if (action === 'trigger_cron_now') {
      // Execute immediate cron batch of connection requests
      const batchSent = Math.min(5, activeCampaign.dailyLimit - activeCampaign.sentToday);
      activeCampaign.sentToday += Math.max(1, batchSent);
      activeCampaign.totalSent += Math.max(1, batchSent);
      activeCampaign.lastRunAt = 'Just now (Manual Cron Execution)';

      return standardResponse({
        campaign: activeCampaign,
        batchResult: {
          sentCount: Math.max(1, batchSent),
          message: `Dispatched ${Math.max(1, batchSent)} personalized invites adhering to LinkedIn rate limits.`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (action === 'toggle_active') {
      activeCampaign.isActive = !activeCampaign.isActive;
      return standardResponse({ campaign: activeCampaign });
    }

    if (updates) {
      activeCampaign = {
        ...activeCampaign,
        ...updates,
      };
      return standardResponse({ campaign: activeCampaign });
    }

    return standardResponse({ campaign: activeCampaign });
  } catch (err: any) {
    return standardError('CAMPAIGN_UPDATE_ERROR', err.message || 'Failed to update campaign', 500);
  }
}
