import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { CompanyService } from '@/services/company-service';

export async function GET() {
  try {
    const user = await requireAuth();
    const companies = await CompanyService.getAll(user.id);
    return standardResponse({ companies });
  } catch (err: any) {
    return standardError('COMPANIES_FETCH_ERROR', err.message || 'Failed to fetch companies', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await CompanyService.create(body, user.id);
    return standardResponse({ company: created }, { status: 201 });
  } catch (err: any) {
    return standardError('COMPANY_CREATE_ERROR', err.message || 'Failed to create company', 500);
  }
}
