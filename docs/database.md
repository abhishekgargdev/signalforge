# SignalForge Data Models & Entities

This document outlines the entity models required for SignalForge UI and services:

## Core Entities
1. **User & Profile**: `id`, `name`, `email`, `headline`, `bio`, `avatarUrl`, `brandColor`, `targetRoles`, `experienceYears`.
2. **Topic**: `id`, `title`, `summary`, `category`, `trendScore`, `sources[]`, `keyFacts[]`, `careerRelevance`, `companyRelevance`, `createdAt`.
3. **Company**: `id`, `name`, `industry`, `tier`, `website`, `logoUrl`, `technologies[]`, `recentSignals[]`, `targetRoles[]`, `notes`.
4. **Person**: `id`, `name`, `companyId`, `role`, `profileUrl`, `avatarUrl`, `topics[]`, `relationshipStatus`, `lastInteractionAt`.
5. **EngagementOpportunity**: `id`, `authorName`, `companyName`, `postText`, `postUrl`, `timestamp`, `relevanceScore`, `technicalAngle`, `suggestedComments[]`.
6. **ContentItem**: `id`, `title`, `type` (post, article, carousel), `status` (idea, research, draft, review, approved, scheduled, published), `platform` (linkedin, x, web), `body`, `tags[]`, `mediaUrl`, `scheduledAt`.
7. **Article**: `id`, `slug`, `title`, `subtitle`, `contentMarkdown`, `coverImageUrl`, `category`, `status`, `views`, `readTimeMinutes`, `seoMetadata`, `publishedAt`.
8. **MediaItem**: `id`, `title`, `cloudinaryPublicId`, `url`, `type`, `dimensions`, `tags[]`, `folder`, `createdAt`.
9. **ExperienceVaultItem**: `id`, `title`, `project`, `problem`, `challenge`, `solution`, `technologies[]`, `result`, `keyTakeaways`.
10. **CareerSignal**: `id`, `roleTitle`, `marketDemandScore`, `risingSkills[]`, `relatedCompanies[]`, `recommendedTopicAngles[]`.
