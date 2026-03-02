import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { CareerProfile } from '@/models/CareerProfile';
import { Company } from '@/models/Company';

const empty = {
  targetRole: '',
  experienceLevel: '',
  strategy: '',
  skills: [] as { name: string; matchPercent: number; demand: string }[],
  angles: [] as string[],
  targetCompanies: [] as string[],
};

export async function GET() {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(user.id)) {
      return standardResponse({ career: empty });
    }
    const profile = await CareerProfile.findOne({ userId: user.id }).lean();
    const companies = await Company.find({ userId: user.id }).select('name').lean();
    return standardResponse({
      career: {
        targetRole: profile?.targetRole || '',
        experienceLevel: profile?.experienceLevel || '',
        strategy: profile?.strategy || '',
        skills: profile?.skills || [],
        angles: profile?.angles || [],
        targetCompanies: companies.map((company) => company.name),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load career profile';
    return standardError('CAREER_FETCH_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(user.id)) {
      return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);
    }
    const body = await req.json();
    const saved = await CareerProfile.findOneAndUpdate(
      { userId: user.id },
      {
        targetRole: body.targetRole || '',
        experienceLevel: body.experienceLevel || '',
        strategy: body.strategy || '',
        skills: Array.isArray(body.skills) ? body.skills : [],
        angles: Array.isArray(body.angles) ? body.angles : [],
      },
      { upsert: true, new: true }
    );
    return standardResponse({ career: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save career profile';
    return standardError('CAREER_UPDATE_ERROR', message, 500);
  }
}
