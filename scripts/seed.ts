import { connectToDatabase, isDbConnected } from '../lib/db/mongoose';
import {
  User,
  Profile,
  Company,
  Person,
  Topic,
  Content,
  Article,
  Project,
  Experience,
  Notification
} from '../models';
import {
  INITIAL_TOPIC_SIGNALS,
  INITIAL_COMPANIES,
  INITIAL_PEOPLE,
  INITIAL_CONTENT_PIPELINE,
  INITIAL_ARTICLES,
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCES,
  INITIAL_NOTIFICATIONS
} from '../lib/signalforge-data';

export async function seedDatabase() {
  console.log('[SignalForge Seed] Connecting to MongoDB...');
  await connectToDatabase();

  if (!isDbConnected()) {
    console.log('[SignalForge Seed] MongoDB not connected. Seed data remains loaded in memory adapter.');
    return;
  }

  try {
    console.log('[SignalForge Seed] Seeding demo user...');
    let user = await User.findOne({ email: 'abhishekgarg959@gmail.com' });
    if (!user) {
      user = await User.create({
        name: 'Abhishek Garg',
        username: 'abhishekgarg',
        email: 'abhishekgarg959@gmail.com',
        passwordHash: '$2b$10$hashedPassword123DemoSecure',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      });
    }

    console.log('[SignalForge Seed] Seeding profile...');
    await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        headline: 'Staff AI Infrastructure & Distributed Systems Architect',
        bio: 'Specializing in high-throughput streaming systems, speculative inference decoding, and tiered WAL replication.',
        skills: ['Speculative Decoding', 'eBPF', 'Kafka', 'PostgreSQL WAL', 'Raft', 'WebGPU'],
        targetRoles: ['Staff AI Engineer', 'Principal Distributed Systems Architect'],
        targetIndustries: ['Frontier AI', 'Financial Infrastructure', 'Cloud Observability'],
      },
      { upsert: true }
    );

    console.log('[SignalForge Seed] Seeding articles...');
    for (const art of INITIAL_ARTICLES) {
      await Article.findOneAndUpdate(
        { slug: art.slug },
        {
          userId: user._id,
          title: art.title,
          slug: art.slug,
          subtitle: art.subtitle,
          category: art.category,
          status: 'PUBLISHED',
          readTime: art.readTime,
          views: art.views,
          coverImage: art.coverImage,
          contentMarkdown: art.contentMarkdown,
          toc: art.toc,
          seo: art.seo,
        },
        { upsert: true }
      );
    }

    console.log('[SignalForge Seed] Database seeded successfully.');
  } catch (err) {
    console.error('[SignalForge Seed] Seed execution error:', err);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
