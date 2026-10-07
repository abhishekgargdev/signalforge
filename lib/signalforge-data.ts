export interface TopicSignal {
  id: string;
  title: string;
  category: 'AI & Inference' | 'Distributed Systems' | 'Cloud & Infra' | 'Database Engines' | 'Developer Tooling';
  summary: string;
  source: string;
  sourceUrl?: string;
  trendScore: number;
  freshness: string;
  careerRelevance: string;
  companyRelevance: string[];
  tags: string[];
  keyFacts: string[];
  timeline: { year: string; milestone: string }[];
  suggestedAngles: string[];
  isSaved?: boolean;
}

export interface TargetCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  priority: 'Tier 1' | 'Tier 2' | 'Tier 3';
  technologies: string[];
  recentSignalCount: number;
  engagementCount: number;
  headquarters: string;
  targetRoles: string[];
  description: string;
  openRolesCount: number;
  signals: { title: string; date: string; relevance: string }[];
}

export interface TargetPerson {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  profileUrl: string;
  topics: string[];
  priority: 'High' | 'Medium' | 'Low';
  lastInteraction: string;
  engagementCount: number;
  notes: string;
  relationshipStatus: 'New' | 'Following' | 'Engaged' | 'Replied' | 'Connected' | 'Active Dialogue';
}

export interface EngagementOpportunity {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  timestamp: string;
  platform: 'LinkedIn' | 'X';
  content: string;
  relevanceScore: number;
  technicalAngle: string;
  status: 'pending' | 'posted' | 'ignored' | 'saved';
  suggestedComments: {
    type: 'Technical Insight' | 'Personal Perspective' | 'Constructive Question' | 'Alternative Perspective';
    text: string;
    originalityScore: number;
  }[];
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'LinkedIn Post' | 'Technical Article' | 'Carousel Slides' | 'X Thread';
  status: 'idea' | 'research' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  platform: 'LinkedIn' | 'X' | 'Web' | 'All';
  createdDate: string;
  scheduledDate?: string;
  tags: string[];
  body: string;
  views?: number;
  engagements?: number;
  coverImage?: string;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedDate: string;
  readTime: string;
  views: number;
  coverImage: string;
  contentMarkdown: string;
  toc: { id: string; title: string }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    keywords: string[];
    ogImage: string;
  };
}

export interface ExperienceItem {
  id: string;
  title: string;
  project: string;
  problem: string;
  challenge: string;
  solution: string;
  technologies: string[];
  result: string;
  lesson: string;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  problem: string;
  architecture: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  lessons: string;
  relatedArticleSlug?: string;
}

export interface CareerGoal {
  targetRole: string;
  experienceLevel: string;
  targetCompanies: string[];
  risingSkills: { name: string; matchPercent: number; demand: 'Surging' | 'High' | 'Stable' }[];
  skillGaps: string[];
  recommendedAngles: string[];
}

export interface LinkedInProspect {
  id: string;
  name: string;
  currentCompany: string;
  role: string;
  companyTier: 'FAANG' | 'Frontier AI' | 'Cloud Infra' | 'Fintech Core';
  location: string;
  profileUrl: string;
  avatar: string;
  aiMatchScore: number;
  seniority: 'Staff' | 'Principal' | 'Engineering Manager' | 'Director' | 'Tech Lead';
  techAlignment: string[];
  connectionStatus: 'uncontacted' | 'queued_cron' | 'invite_sent' | 'connected' | 'chat_active';
  personalizedNote: string;
  lastActivity: string;
  hiringSignal?: string;
}

export interface ProspectingCampaign {
  id: string;
  name: string;
  isActive: boolean;
  cronExpression: string;
  scheduleHumanText: string;
  dailyLimit: number;
  sentToday: number;
  totalSent: number;
  acceptedCount: number;
  targetCriteria: {
    companies: string[];
    roles: string[];
    technologies: string[];
    seniorities: string[];
  };
  lastRunAt?: string;
  nextRunAt: string;
}

export interface FaangMonitoredPost {
  id: string;
  authorName: string;
  authorRole: string;
  company: string;
  companyBadge: 'FAANG' | 'Frontier AI' | 'Tier 1 Infra';
  avatar: string;
  postTimestamp: string;
  platform: 'LinkedIn' | 'X';
  originalPostText: string;
  technicalProblemSummary: string;
  whyEngageReason: string;
  aiSuggestedComments: {
    angle: 'Staff Technical Insight' | 'Thoughtful Counter-Question' | 'Production War-Story';
    commentText: string;
    originalityScore: number;
  }[];
  status: 'hunted' | 'approved' | 'posted_by_cron' | 'reply_received';
  cronScheduledAt?: string;
  inMailPitchDraft?: string;
}

export interface FaangCommentCronConfig {
  isActive: boolean;
  cronSchedule: string;
  scheduleHumanText: string;
  autoPostEnabled: boolean;
  dailyCommentLimit: number;
  commentsPostedToday: number;
  totalProfileViewsGained: number;
  recruiterInboundsTriggered: number;
  lastRunTime: string;
}

export type PromptLibraryItem = {
  id: string;
  name: string;
  model: string;
  category: string;
  tokens: number;
  promptText: string;
  lastUsed: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: string;
  read: boolean;
  link?: string;
};

export type AuditLogItem = {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  status: string;
};

export const INITIAL_TOPIC_SIGNALS: TopicSignal[] = [];
export const INITIAL_COMPANIES: TargetCompany[] = [];
export const INITIAL_PEOPLE: TargetPerson[] = [];
export const INITIAL_ENGAGEMENTS: EngagementOpportunity[] = [];
export const INITIAL_CONTENT_PIPELINE: ContentItem[] = [];
export const INITIAL_ARTICLES: ArticleItem[] = [];
export const INITIAL_EXPERIENCES: ExperienceItem[] = [];
export const INITIAL_PROJECTS: ProjectItem[] = [];

export const INITIAL_CAREER_GOAL: CareerGoal = {
  targetRole: '',
  experienceLevel: '',
  targetCompanies: [],
  risingSkills: [],
  skillGaps: [],
  recommendedAngles: [],
};

export const INITIAL_PROMPT_LIBRARY: PromptLibraryItem[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const INITIAL_PROSPECTING_CAMPAIGN: ProspectingCampaign = {
  id: '',
  name: '',
  isActive: false,
  cronExpression: '0 9 * * *',
  scheduleHumanText: 'Not scheduled',
  dailyLimit: 15,
  sentToday: 0,
  totalSent: 0,
  acceptedCount: 0,
  targetCriteria: {
    companies: [],
    roles: [],
    technologies: [],
    seniorities: [],
  },
  nextRunAt: '—',
};

export const INITIAL_LINKEDIN_PROSPECTS: LinkedInProspect[] = [];

export const INITIAL_FAANG_MONITORED_POSTS: FaangMonitoredPost[] = [];

export const INITIAL_FAANG_COMMENT_CRON: FaangCommentCronConfig = {
  isActive: false,
  cronSchedule: '0 */4 * * *',
  scheduleHumanText: 'Not configured',
  autoPostEnabled: false,
  dailyCommentLimit: 8,
  commentsPostedToday: 0,
  totalProfileViewsGained: 0,
  recruiterInboundsTriggered: 0,
  lastRunTime: 'Never',
};
