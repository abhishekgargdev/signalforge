import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Experience } from '@/models/Experience';
import { Project } from '@/models/Project';
import { ExperienceItem, ProjectItem } from '@/lib/signalforge-data';

function canWrite(userId: string) {
  return isDbConnected() && mongoose.Types.ObjectId.isValid(userId);
}

export class KnowledgeService {
  static async listExperiences(userId: string): Promise<ExperienceItem[]> {
    await connectToDatabase();
    if (!canWrite(userId)) return [];
    const found = await Experience.find({ userId }).sort({ createdAt: -1 }).lean();
    return found.map((row: any) => ({
      id: row._id.toString(),
      title: row.title,
      project: row.project,
      problem: row.problem,
      challenge: row.challenge,
      solution: row.solution,
      technologies: row.technologies || [],
      result: row.result,
      lesson: row.lesson,
      tags: row.tags || [],
    }));
  }

  static async createExperience(data: Partial<ExperienceItem>, userId: string): Promise<ExperienceItem> {
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: data.title || 'Untitled experience',
      project: data.project || '',
      problem: data.problem || '',
      challenge: data.challenge || '',
      solution: data.solution || '',
      technologies: data.technologies || [],
      result: data.result || '',
      lesson: data.lesson || '',
      tags: data.tags || [],
    };
    await connectToDatabase();
    if (canWrite(userId)) {
      const saved = await Experience.create({ userId, ...item, id: undefined });
      item.id = saved._id.toString();
    }
    return item;
  }

  static async listProjects(userId: string): Promise<ProjectItem[]> {
    await connectToDatabase();
    if (!canWrite(userId)) return [];
    const found = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
    return found.map((row: any) => ({
      id: row._id.toString(),
      name: row.name,
      description: row.description,
      problem: row.problem,
      architecture: row.architecture,
      technologies: row.technologies || [],
      githubUrl: row.githubUrl || '',
      liveUrl: row.liveUrl || '',
      lessons: row.lessons || '',
    }));
  }

  static async createProject(data: Partial<ProjectItem>, userId: string): Promise<ProjectItem> {
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: data.name || 'Untitled project',
      description: data.description || '',
      problem: data.problem || '',
      architecture: data.architecture || '',
      technologies: data.technologies || [],
      githubUrl: data.githubUrl || '',
      liveUrl: data.liveUrl || '',
      lessons: data.lessons || '',
    };
    await connectToDatabase();
    if (canWrite(userId)) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
      const saved = await Project.create({
        userId,
        name: item.name,
        slug,
        description: item.description,
        problem: item.problem,
        architecture: item.architecture,
        technologies: item.technologies,
        githubUrl: item.githubUrl,
        liveUrl: item.liveUrl,
        lessons: item.lessons,
      });
      item.id = saved._id.toString();
    }
    return item;
  }
}
