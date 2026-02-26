import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Company } from '@/models/Company';
import { INITIAL_COMPANIES, TargetCompany } from '@/lib/signalforge-data';

let inMemoryCompanies: TargetCompany[] = [...INITIAL_COMPANIES];

export class CompanyService {
  static async getAll(userId: string): Promise<TargetCompany[]> {
    await connectToDatabase();
    if (isDbConnected()) {
      try {
        const found = await Company.find({}).sort({ priority: 1 }).lean();
        if (found.length > 0) {
          return found.map((c: any) => ({
            id: c._id.toString(),
            name: c.name,
            logo: c.logo || '',
            industry: c.industry,
            priority: c.priority,
            technologies: c.technologies || [],
            recentSignalCount: 4,
            engagementCount: 6,
            headquarters: c.headquarters || '',
            targetRoles: ['Staff Engineer'],
            description: c.description,
            openRolesCount: c.openRolesCount || 0,
            signals: [],
          }));
        }
      } catch (e) {
        console.warn('Fallback to in-memory companies');
      }
    }
    return inMemoryCompanies;
  }

  static async create(data: Partial<TargetCompany>, userId: string): Promise<TargetCompany> {
    const newComp: TargetCompany = {
      id: `comp-${Date.now()}`,
      name: data.name || 'New Company',
      logo: data.logo || '',
      industry: data.industry || 'Technology',
      priority: data.priority || 'Tier 1',
      technologies: data.technologies || [],
      recentSignalCount: 1,
      engagementCount: 0,
      headquarters: data.headquarters || 'Remote',
      targetRoles: data.targetRoles || ['Staff Systems Architect'],
      description: data.description || '',
      openRolesCount: 5,
      signals: [{ title: 'Company profile created', date: 'Just now', relevance: 'High' }],
    };
    inMemoryCompanies.unshift(newComp);
    return newComp;
  }
}
