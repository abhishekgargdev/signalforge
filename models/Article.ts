import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  publishedDate?: string;
  readTime: string;
  views: number;
  coverImage?: string;
  contentMarkdown: string;
  toc: { id: string; title: string }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    keywords: string[];
    ogImage?: string;
  };
}

const ArticleSchema = new Schema<IArticle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    subtitle: { type: String, default: '' },
    category: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'], default: 'DRAFT' },
    publishedDate: { type: String },
    readTime: { type: String, default: '5 min read' },
    views: { type: Number, default: 0 },
    coverImage: { type: String },
    contentMarkdown: { type: String, required: true },
    toc: [{ id: String, title: String }],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      canonicalUrl: { type: String },
      keywords: [{ type: String }],
      ogImage: { type: String },
    },
  },
  { timestamps: true }
);

export const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
