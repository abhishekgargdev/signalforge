import mongoose from 'mongoose';
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
            headquarters: c.website || c.headquarters || '',
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

  static async getById(id: string): Promise<TargetCompany | null> {
    const all = await this.getAll('session');
    return all.find((c) => c.id === id) || null;
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

    await connectToDatabase();
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const saved = await Company.create({
        userId,
        name: newComp.name,
        slug: newComp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `company-${Date.now()}`,
        industry: newComp.industry,
        priority: newComp.priority,
        technologies: newComp.technologies,
        headquarters: newComp.headquarters,
        description: newComp.description,
        website: data.headquarters || '',
        openRolesCount: newComp.openRolesCount,
        logo: newComp.logo,
      });
      newComp.id = saved._id.toString();
    }
    return newComp;
  }

  static async update(id: string, data: Partial<TargetCompany>, userId: string): Promise<TargetCompany | null> {
    await connectToDatabase();
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id) && mongoose.Types.ObjectId.isValid(userId)) {
      const saved = await Company.findOneAndUpdate(
        { _id: id, userId },
        {
          name: data.name,
          description: data.description,
          website: data.headquarters,
          industry: data.industry || 'Technology',
        },
        { new: true }
      ).lean();
      if (!saved) return null;
      return {
        id: saved._id.toString(),
        name: saved.name,
        logo: saved.logo || '',
        industry: saved.industry,
        priority: saved.priority,
        technologies: saved.technologies || [],
        recentSignalCount: 0,
        engagementCount: 0,
        headquarters: saved.website || '',
        targetRoles: [],
        description: saved.description || '',
        openRolesCount: saved.openRolesCount || 0,
        signals: [],
      };
    }
    return null;
  }

  static async remove(id: string, userId: string): Promise<boolean> {
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return false;
    const result = await Company.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}
