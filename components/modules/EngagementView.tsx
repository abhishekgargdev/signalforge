'use client';

import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Send,
  UserCheck,
  Clock,
  Play,
  Pause,
  Bot,
  Plus,
  Building,
  Target,
  MessageCircle,
  TrendingUp,
  X,
  Linkedin,
  Flame,
  Award,
  Edit,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import {
  EngagementOpportunity,
  TargetPerson,
  FaangMonitoredPost,
  FaangCommentCronConfig,
  INITIAL_FAANG_MONITORED_POSTS,
  INITIAL_FAANG_COMMENT_CRON
} from '@/lib/signalforge-data';
import { SkeletonCard, SkeletonTableRow, SkeletonPostDetail, ApiSpinner } from '@/components/ui/SkeletonLoader';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';

interface EngagementViewProps {
  opportunities: EngagementOpportunity[];
  people: TargetPerson[];
}

export function EngagementView({ opportunities, people }: EngagementViewProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'cron' | 'crm'>('posts');
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);

  // Monitored posts state
  const [monitoredPosts, setMonitoredPosts] = useState<FaangMonitoredPost[]>(INITIAL_FAANG_MONITORED_POSTS);
  const [selectedPost, setSelectedPost] = useState<FaangMonitoredPost | null>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number>(0);
  const [editedComment, setEditedComment] = useState<string>('');
  const [copiedComment, setCopiedComment] = useState<boolean>(false);
  const [postedSuccess, setPostedSuccess] = useState<string | null>(null);

  // Pagination for posts
  const [postsPage, setPostsPage] = useState<number>(1);
  const [postsPageSize, setPostsPageSize] = useState<number>(4);

  // Pagination for CRM people
  const [crmPage, setCrmPage] = useState<number>(1);
  const [crmPageSize, setCrmPageSize] = useState<number>(5);

  // Custom post analyzer / Add post modal state
  const [customPostModalOpen, setCustomPostModalOpen] = useState(false);
  const [customAuthor, setCustomAuthor] = useState('');
  const [customCompany, setCustomCompany] = useState('Google');
  const [customRole, setCustomRole] = useState('Staff Engineer / Hiring Manager');
  const [customPostText, setCustomPostText] = useState('');
  const [analyzingCustomPost, setAnalyzingCustomPost] = useState(false);

  // View Post Modal state
  const [viewingPost, setViewingPost] = useState<FaangMonitoredPost | null>(null);

  // Edit Post Modal state
  const [editingPost, setEditingPost] = useState<FaangMonitoredPost | null>(null);
  const [isSavingPostEdit, setIsSavingPostEdit] = useState<boolean>(false);

  // Delete Post state
  const [postToDelete, setPostToDelete] = useState<FaangMonitoredPost | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState<boolean>(false);

  // InMail / Active Chat Pitch Modal state
  const [chatPitchModalOpen, setChatPitchModalOpen] = useState(false);
  const [chatPitchRecipient, setChatPitchRecipient] = useState<string>('');
  const [chatPitchCompany, setChatPitchCompany] = useState<string>('');
  const [chatPitchTopic, setChatPitchTopic] = useState<string>('');
  const [chatPitchText, setChatPitchText] = useState<string>('');
  const [generatingChatPitch, setGeneratingChatPitch] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [pitchSentSuccess, setPitchSentSuccess] = useState<string | null>(null);

  // Cron Config state
  const [cronConfig, setCronConfig] = useState<FaangCommentCronConfig>(INITIAL_FAANG_COMMENT_CRON);
  const [cronRunning, setCronRunning] = useState(false);
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);

  // Filter company for monitored posts
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');

  // Handle post selection
  const handleSelectPost = (post: FaangMonitoredPost) => {
    setSelectedPost(post);
    setSelectedCommentIndex(0);
    setEditedComment(post.aiSuggestedComments[0]?.commentText || '');
    setPostedSuccess(null);
  };

  // Handle comment angle tab
  const handleSelectCommentAngle = (idx: number) => {
    if (!selectedPost) return;
    setSelectedCommentIndex(idx);
    setEditedComment(selectedPost.aiSuggestedComments[idx]?.commentText || '');
  };

  // Copy comment
  const handleCopyComment = () => {
    navigator.clipboard?.writeText(editedComment);
    setCopiedComment(true);
    setTimeout(() => setCopiedComment(false), 2000);
  };

  // Dispatch comment directly to LinkedIn
  const handlePostCommentToLinkedIn = (postId: string) => {
    setMonitoredPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'approved' } : p))
    );
    setPostedSuccess(
      selectedPost
        ? `Comment marked ready for ${selectedPost.authorName}'s post.`
        : 'Comment saved.'
    );
    setTimeout(() => setPostedSuccess(null), 3000);
  };

  // Delete Post Confirmation Handler
  const handleConfirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeletingPost(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const remaining = monitoredPosts.filter((p) => p.id !== postToDelete.id);
      setMonitoredPosts(remaining);
      if (selectedPost?.id === postToDelete.id) {
        if (remaining.length > 0) handleSelectPost(remaining[0]);
        else {
          setSelectedPost(null);
          setEditedComment('');
        }
      }
      setPostToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingPost(false);
    }
  };

  // Save Edit Post
  const handleSavePostEdit = async () => {
    if (!editingPost) return;
    setIsSavingPostEdit(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setMonitoredPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? editingPost : p))
      );
      if (selectedPost?.id === editingPost.id) {
        setSelectedPost(editingPost);
        setEditedComment(editingPost.aiSuggestedComments[selectedCommentIndex]?.commentText || '');
      }
      setEditingPost(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingPostEdit(false);
    }
  };

  // Open InMail / Active Chat Pitch Modal
  const handleOpenChatPitch = async (post: FaangMonitoredPost) => {
    setChatPitchRecipient(post.authorName);
    setChatPitchCompany(post.company);
    setChatPitchTopic(post.technicalProblemSummary);
    setChatPitchText(post.inMailPitchDraft || '');
    setChatPitchModalOpen(true);
    setPitchSentSuccess(null);

    if (!post.inMailPitchDraft) {
      setGeneratingChatPitch(true);
      try {
        const res = await fetch('/api/v1/engagement/chat-pitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetName: post.authorName,
            company: post.company,
            role: post.authorRole,
            contextTopic: post.technicalProblemSummary,
          }),
        });
        const data = await res.json();
        if (data.success && data.data?.message) {
          setChatPitchText(data.data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setGeneratingChatPitch(false);
      }
    }
  };

  // Regenerate InMail pitch
  const handleRegeneratePitch = async () => {
    setGeneratingChatPitch(true);
    try {
      const res = await fetch('/api/v1/engagement/chat-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetName: chatPitchRecipient,
          company: chatPitchCompany,
          contextTopic: chatPitchTopic,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.message) {
        setChatPitchText(data.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingChatPitch(false);
    }
  };

  // Send InMail pitch
  const handleSendPitch = () => {
    setPitchSentSuccess(`Active chat message successfully dispatched to ${chatPitchRecipient} via LinkedIn InMail!`);
    setTimeout(() => {
      setChatPitchModalOpen(false);
      setPitchSentSuccess(null);
    }, 2000);
  };

  // Handle analyze custom pasted post
  const handleAnalyzeCustomPost = async () => {
    if (!customPostText.trim()) return;
    setAnalyzingCustomPost(true);

    try {
      const res = await fetch('/api/v1/engagement/generate-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: customAuthor || 'Engineering Leader',
          company: customCompany,
          authorRole: customRole,
          postText: customPostText,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.comments) {
        const newPost: FaangMonitoredPost = {
          id: `custom-post-${Date.now()}`,
          authorName: customAuthor || 'Engineering Leader',
          authorRole: customRole || 'Systems Architect',
          company: customCompany,
          companyBadge: 'FAANG',
          avatar: '',
          postTimestamp: 'Just analyzed',
          platform: 'LinkedIn',
          originalPostText: customPostText,
          technicalProblemSummary: data.data.problemSummary || 'Custom technical post analysis',
          whyEngageReason: data.data.whyEngage || 'High-impact technical post for FAANG hiring visibility',
          aiSuggestedComments: data.data.comments,
          status: 'hunted',
        };

        setMonitoredPosts([newPost, ...monitoredPosts]);
        setSelectedPost(newPost);
        setSelectedCommentIndex(0);
        setEditedComment(newPost.aiSuggestedComments[0]?.commentText || '');
        setCustomPostModalOpen(false);
        setCustomPostText('');
        setPostsPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingCustomPost(false);
    }
  };

  // Trigger Cron Hunt
  const handleTriggerCronHunt = async () => {
    setCronRunning(true);
    setCronFeedback(null);

    try {
      const res = await fetch('/api/v1/engagement/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_hunt_now' }),
      });
      const data = await res.json();
      if (data.success) {
        setCronConfig(data.data.cronConfig);
        setCronFeedback(data.data.huntResult?.message || 'Cron executed successfully.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCronRunning(false);
    }
  };

  // Toggle Cron active
  const handleToggleCron = async () => {
    try {
      const res = await fetch('/api/v1/engagement/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active' }),
      });
      const data = await res.json();
      if (data.success) {
        setCronConfig(data.data.cronConfig);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered posts
  const filteredPosts = monitoredPosts.filter((p) => {
    if (selectedCompanyFilter === 'All') return true;
    return p.company.toLowerCase().includes(selectedCompanyFilter.toLowerCase());
  });

  // Paginated monitored posts
  const postsTotalPages = Math.ceil(filteredPosts.length / postsPageSize) || 1;
  const paginatedPosts = filteredPosts.slice(
    (postsPage - 1) * postsPageSize,
    postsPage * postsPageSize
  );

  // Paginated CRM people
  const crmTotalPages = Math.ceil(people.length / crmPageSize) || 1;
  const paginatedPeople = people.slice(
    (crmPage - 1) * crmPageSize,
    crmPage * crmPageSize
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              FAANG Post Auto-Commenter & Thought-Leadership Studio
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Boost reach to FAANG engineering leaders by having AI monitor their posts, prepare high-signal architectural insights, dispatch automated comments on cron, and draft warm active-chat pitches.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              activeTab === 'posts' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Post Studio ({monitoredPosts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cron')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              activeTab === 'cron' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>AI Comment Cron</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
              activeTab === 'crm' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Relationship CRM ({people.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FAANG Post Studio & Live Comment Engine */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Quick Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              <span className="text-zinc-500">Filter Company:</span>
              {['All', 'Google', 'Meta', 'Netflix', 'Apple', 'Anthropic', 'Stripe'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCompanyFilter(c);
                    setPostsPage(1);
                  }}
                  className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
                    selectedCompanyFilter === c
                      ? 'bg-[#22c55e]/20 text-emerald-300 border-[#22c55e]'
                      : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCustomPostModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm shadow-[#22c55e]/20 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Analyze & Comment on Any Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Monitored Posts Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Monitored FAANG Leader Posts
                </span>
                <span className="text-zinc-500 text-[10px]">
                  {filteredPosts.length} posts
                </span>
              </div>

              {isPostsLoading ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3 animate-pulse">
                    <div className="h-4 bg-zinc-700 rounded w-1/2" />
                    <div className="h-12 bg-zinc-800 rounded" />
                  </div>
                  <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3 animate-pulse">
                    <div className="h-4 bg-zinc-700 rounded w-1/2" />
                    <div className="h-12 bg-zinc-800 rounded" />
                  </div>
                </div>
              ) : paginatedPosts.length === 0 ? (
                <div className="p-8 text-center bg-[#0e1710] border border-white/5 rounded-xl text-zinc-500 font-mono text-xs">
                  No monitored posts found for this filter. Click &quot;Analyze & Comment on Any Post&quot; to add one.
                </div>
              ) : (
                paginatedPosts.map((post) => {
                  const isSelected = selectedPost?.id === post.id;
                  const isApproved = post.status === 'approved';

                  return (
                    <div
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className={`p-4 rounded-xl border transition cursor-pointer space-y-2.5 group relative ${
                        isSelected
                          ? 'bg-[#0e1710] border-[#22c55e] ring-1 ring-[#22c55e]'
                          : 'bg-[#080c08] border-[#22c55e]/20 hover:border-[#22c55e]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={post.avatar}
                            alt={post.authorName}
                            className="w-9 h-9 rounded-full object-cover border border-[#22c55e]/40"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                              <span>{post.authorName}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black border border-emerald-500/30 text-emerald-300">
                                {post.companyBadge}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-400 line-clamp-1">{post.authorRole}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingPost(post);
                            }}
                            className="p-1 text-zinc-500 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition"
                            title="View Full Post Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPost(post);
                            }}
                            className="p-1 text-zinc-500 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition"
                            title="Edit Post Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostToDelete(post);
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                            title="Delete Monitored Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
                        &ldquo;{post.originalPostText}&rdquo;
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/5">
                        <span className="text-[#f59e0b] truncate max-w-[180px]">
                          ⚡ {post.technicalProblemSummary}
                        </span>
                        {isApproved ? (
                          <span className="text-[#22c55e] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Live Comment
                          </span>
                        ) : (
                          <span className="text-zinc-500">Draft Ready</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination for Posts Feed */}
              <Pagination
                currentPage={postsPage}
                totalPages={postsTotalPages}
                totalItems={filteredPosts.length}
                pageSize={postsPageSize}
                onPageChange={setPostsPage}
                itemLabel="posts"
              />
            </div>

            <div className="lg:col-span-2 space-y-5">
              {!selectedPost ? (
                <div className="p-12 rounded-xl bg-[#0e1710] border border-white/5 text-center text-xs text-zinc-500 font-mono">
                  Select a monitored post or use &quot;Analyze & Comment on Any Post&quot; to get started.
                </div>
              ) : (
              <>
              <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-xs text-slate-200">
                      Post by {selectedPost.authorName} ({selectedPost.company})
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      via {selectedPost.platform} • {selectedPost.postTimestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <button
                      onClick={() => setViewingPost(selectedPost)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Dossier</span>
                    </button>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>FAANG Hiring Priority</span>
                    </div>
                  </div>
                </div>

                <blockquote className="text-xs text-slate-200 italic leading-relaxed pl-3 border-l-2 border-[#22c55e]">
                  &ldquo;{selectedPost.originalPostText}&rdquo;
                </blockquote>

                <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] font-mono space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Core Technical Dilemma:</span>
                    <span className="text-[#f59e0b] font-medium">{selectedPost.technicalProblemSummary}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    💡 <strong className="text-emerald-400">Reach Strategy:</strong> {selectedPost.whyEngageReason}
                  </div>
                </div>
              </div>

              {/* 4 Generated Comment Angles Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#22c55e]" />
                    AI Architectural Comment Angles:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Avg 98-99% Originality Score (Zero AI Cliché)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedPost.aiSuggestedComments.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectCommentAngle(idx)}
                      className={`p-3 rounded-lg border text-left text-xs transition ${
                        selectedCommentIndex === idx
                          ? 'bg-[#22c55e]/20 border-[#22c55e] text-emerald-300 font-bold'
                          : 'bg-[#0e1710] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#f59e0b] mb-1">
                        <span>Angle #{idx + 1}</span>
                        <span className="text-emerald-400">{c.originalityScore}% Rating</span>
                      </div>
                      <div className="text-[11px] font-semibold">{c.angle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Comment Editor & Refinement */}
              <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    Active Comment Draft: {selectedPost.aiSuggestedComments[selectedCommentIndex]?.angle}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {editedComment.length} characters • ~{Math.ceil(editedComment.length / 5)} words
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-xs text-slate-200 placeholder-zinc-500 focus:outline-none focus:border-[#22c55e] font-mono leading-relaxed"
                />

                {postedSuccess && (
                  <div className="p-2.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                    <span>{postedSuccess}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditedComment((prev) =>
                          prev.includes('From an architectural standpoint, ')
                            ? prev.replace('From an architectural standpoint, ', '')
                            : `From an architectural standpoint, ${prev}`
                        )
                      }
                      className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-zinc-400 hover:text-emerald-300 font-mono"
                    >
                      + Technical Polish
                    </button>
                    <button
                      onClick={() =>
                        setEditedComment((prev) => `${prev} What empirical trade-offs did your team observe at peak scale?`)
                      }
                      className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-zinc-400 hover:text-emerald-300 font-mono"
                    >
                      + Add Socratic Question
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active Chat Pitch Button */}
                    <button
                      onClick={() => handleOpenChatPitch(selectedPost)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition"
                      title="Prepare warm direct message / InMail pitch to this leader"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Prepare Active Chat Pitch</span>
                    </button>

                    <button
                      onClick={handleCopyComment}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition"
                    >
                      {copiedComment ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedComment ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handlePostCommentToLinkedIn(selectedPost.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black text-xs font-extrabold hover:bg-emerald-400 transition shadow-sm shadow-[#22c55e]/30"
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-black" />
                      <span>Post Comment to LinkedIn</span>
                    </button>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Automated AI Comment Cron Engine */}
      {activeTab === 'cron' && (
        <div className="space-y-6">
          {/* Cron Control Panel */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#0e1710] to-[#080c08] border border-[#22c55e]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-100">
                      FAANG Thought-Leadership Autonomous Commenter Cron
                    </h3>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        cronConfig.isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {cronConfig.isActive ? 'Cron Active' : 'Cron Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                    Cadence: <span className="text-emerald-300 font-semibold">{cronConfig.scheduleHumanText}</span> ({cronConfig.cronSchedule}) • Last Run: <span className="text-[#f59e0b]">{cronConfig.lastRunTime}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleCron}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                    cronConfig.isActive
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                      : 'bg-[#22c55e]/20 border-[#22c55e] text-emerald-300'
                  }`}
                >
                  {cronConfig.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{cronConfig.isActive ? 'Pause Cron Engine' : 'Resume Cron Engine'}</span>
                </button>

                <button
                  onClick={handleTriggerCronHunt}
                  disabled={cronRunning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition shadow-sm shadow-[#22c55e]/20"
                >
                  {cronRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning FAANG Posts...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Run Cron Hunter Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">TODAY&apos;S COMMENTS POSTED</span>
                <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
                  <span>{cronConfig.commentsPostedToday} / {cronConfig.dailyCommentLimit}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Optimal Rate</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">PROFILE VIEWS GAINED</span>
                <div className="font-bold text-sm text-[#22c55e] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{cronConfig.totalProfileViewsGained} FAANG Views</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">RECRUITER INBOUNDS</span>
                <div className="font-bold text-sm text-[#f59e0b] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{cronConfig.recruiterInboundsTriggered} Inbound Dialogues</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] block">AUTOMATION MODE</span>
                <div className="font-bold text-sm text-slate-200">
                  {cronConfig.autoPostEnabled ? 'Hands-Free Auto-Post' : 'Human Review Queue'}
                </div>
              </div>
            </div>

            {cronFeedback && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>{cronFeedback}</span>
              </div>
            )}
          </div>

          {/* Cron Monitored Execution Queue Table */}
          <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Autonomous Comment Queue (Target FAANG Leads)
              </span>
              <span className="text-zinc-500 text-[10px]">
                Prepared by Gemini 2.5 • Scheduled Execution
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                    <th className="py-2 px-3">Target Leader</th>
                    <th className="py-2 px-3">Company & Problem</th>
                    <th className="py-2 px-3">Top AI Comment Angle</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {monitoredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-200">{post.authorName}</div>
                        <div className="text-[10px] text-zinc-400">{post.authorRole}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-emerald-400 font-semibold">{post.company}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">
                          {post.technicalProblemSummary}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <span className="text-[#f59e0b] block text-[10px] mb-0.5">
                          {post.aiSuggestedComments[0]?.angle}
                        </span>
                        <p className="text-[11px] text-zinc-300 line-clamp-2">
                          {post.aiSuggestedComments[0]?.commentText}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            post.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-black text-[#f59e0b] border-amber-500/30'
                          }`}
                        >
                          {post.status === 'approved' ? 'Live on LinkedIn' : 'Ready in Cron Queue'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenChatPitch(post)}
                          className="text-[#f59e0b] hover:underline"
                        >
                          Chat Pitch
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setActiveTab('posts');
                          }}
                          className="text-[#22c55e] hover:underline"
                        >
                          Review & Push →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Relationship CRM Table with Pagination */}
      {activeTab === 'crm' && (
        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#22c55e]/15 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#22c55e]" />
                FAANG Leader Engagement Pipeline
              </h3>
              <p className="text-xs text-zinc-400">
                Track how continuous high-signal commentary advances relationships into warm recruitment dialogues.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Stage: Active Dialogue (1), Replied (1), Connected (1)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">Person</th>
                  <th className="py-2 px-3">Company & Role</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Touchpoints</th>
                  <th className="py-2 px-3">Last Touch</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {paginatedPeople.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-3 px-3 text-zinc-400">{p.company} • {p.role}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        {p.relationshipStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{p.engagementCount} interactions</td>
                    <td className="py-3 px-3 text-zinc-500">{p.lastInteraction}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          const matchingPost = monitoredPosts.find((mp) => mp.authorName === p.name);
                          if (matchingPost) handleOpenChatPitch(matchingPost);
                          else {
                            setChatPitchRecipient(p.name);
                            setChatPitchCompany(p.company);
                            setChatPitchTopic(p.topics[0] || 'distributed systems');
                            setChatPitchText('');
                            setChatPitchModalOpen(true);
                            handleRegeneratePitch();
                          }
                        }}
                        className="text-[#22c55e] hover:underline"
                      >
                        InMail Pitch →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CRM Pagination */}
          <Pagination
            currentPage={crmPage}
            totalPages={crmTotalPages}
            totalItems={people.length}
            pageSize={crmPageSize}
            onPageChange={setCrmPage}
            itemLabel="contacts"
          />
        </div>
      )}

      {/* MODAL 1: Analyze & Add Any Post */}
      {customPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider block">
                  AI POST ANALYZER & COMMENT GENERATOR
                </span>
                <h3 className="font-bold text-sm text-slate-100">
                  Analyze & Add Monitored Post to Pipeline
                </h3>
              </div>
              <button
                onClick={() => setCustomPostModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Author Name *:</label>
                <input
                  type="text"
                  placeholder="e.g. Jeff Dean"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Target Company *:</label>
                <input
                  type="text"
                  placeholder="e.g. Google DeepMind"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Author Role / Team:</label>
              <input
                type="text"
                placeholder="e.g. VP / Fellow, Chief Scientist"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 block">Paste LinkedIn Post Content *:</label>
              <textarea
                rows={5}
                placeholder="Paste the target post or article snippet here..."
                value={customPostText}
                onChange={(e) => setCustomPostText(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e] leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setCustomPostModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAnalyzeCustomPost}
                disabled={analyzingCustomPost || !customPostText.trim()}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 transition flex items-center gap-1.5"
              >
                {analyzingCustomPost ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Add to Feed</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View Full Monitored Post Dossier */}
      {viewingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={viewingPost.avatar}
                  alt={viewingPost.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#22c55e]/40"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                    {viewingPost.authorName}
                    <span className="px-1.5 py-0.2 rounded bg-black border border-emerald-500/30 text-emerald-300 text-[10px]">
                      {viewingPost.company}
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-[11px]">{viewingPost.authorRole} • {viewingPost.postTimestamp}</p>
                </div>
              </div>

              <button
                onClick={() => setViewingPost(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block mb-1">ORIGINAL LINKEDIN POST</span>
                <blockquote className="p-3 rounded-lg bg-black/60 border border-white/5 text-slate-200 italic leading-relaxed text-xs">
                  &ldquo;{viewingPost.originalPostText}&rdquo;
                </blockquote>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Technical Dilemma:</span>
                  <span className="text-[#f59e0b] font-medium">{viewingPost.technicalProblemSummary}</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <strong>Reach Angle:</strong> {viewingPost.whyEngageReason}
                </div>
              </div>

              <div>
                <span className="text-zinc-400 font-semibold block mb-1">Pre-Computed Comment Angles ({viewingPost.aiSuggestedComments.length}):</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {viewingPost.aiSuggestedComments.map((c, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#0e1710] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#f59e0b]">
                        <span className="font-bold">{c.angle}</span>
                        <span className="text-emerald-400">{c.originalityScore}% Score</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-snug">{c.commentText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-zinc-500 text-[11px]">
                Status: <strong className="text-emerald-400 uppercase">{viewingPost.status}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const toEdit = viewingPost;
                    setViewingPost(null);
                    setEditingPost(toEdit);
                  }}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-slate-200 hover:bg-zinc-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleSelectPost(viewingPost);
                    setViewingPost(null);
                  }}
                  className="px-3.5 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400"
                >
                  Load in Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Monitored Post */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#22c55e]" />
                Edit Monitored Post: {editingPost.authorName}
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Author Name:</label>
                  <input
                    type="text"
                    value={editingPost.authorName}
                    onChange={(e) => setEditingPost({ ...editingPost, authorName: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Company:</label>
                  <input
                    type="text"
                    value={editingPost.company}
                    onChange={(e) => setEditingPost({ ...editingPost, company: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technical Dilemma Summary:</label>
                <input
                  type="text"
                  value={editingPost.technicalProblemSummary}
                  onChange={(e) => setEditingPost({ ...editingPost, technicalProblemSummary: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-amber-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Original Post Text:</label>
                <textarea
                  rows={4}
                  value={editingPost.originalPostText}
                  onChange={(e) => setEditingPost({ ...editingPost, originalPostText: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setEditingPost(null)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePostEdit}
                disabled={isSavingPostEdit}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 flex items-center gap-1.5"
              >
                {isSavingPostEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Active Chat / InMail Warm Pitch Generator */}
      {chatPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#f59e0b]/40 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider font-bold block flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                  ACTIVE CHAT & INMAIL WARM PITCH
                </span>
                <h3 className="font-bold text-sm text-slate-100 mt-0.5">
                  Direct Message to {chatPitchRecipient} ({chatPitchCompany})
                </h3>
              </div>
              <button
                onClick={() => setChatPitchModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {pitchSentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-center space-y-2 py-8">
                <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto animate-bounce" />
                <div className="font-bold text-sm">{pitchSentSuccess}</div>
                <p className="text-[11px] text-zinc-400">
                  Direct message logged to your Relationship CRM pipeline.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1 text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Target Leader:</span>
                    <span className="text-slate-200 font-bold">{chatPitchRecipient}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Topic Context:</span>
                    <span className="text-[#f59e0b]">{chatPitchTopic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Objective:</span>
                    <span className="text-emerald-400">Staff Systems / AI Architect Discovery Chat</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-400">Pitch Text (Concise & Impactful):</label>
                    <span className="text-[10px] text-zinc-500">
                      {chatPitchText.length} chars • ~{Math.ceil(chatPitchText.length / 5)} words
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={chatPitchText}
                    onChange={(e) => setChatPitchText(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/60 border border-[#f59e0b]/30 text-amber-100 focus:outline-none focus:border-[#f59e0b] leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleRegeneratePitch}
                    disabled={generatingChatPitch}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition"
                  >
                    {generatingChatPitch ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                    )}
                    <span>Regenerate with Gemini</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(chatPitchText);
                        setCopiedPitch(true);
                        setTimeout(() => setCopiedPitch(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded bg-black border border-white/10 text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPitch ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleSendPitch}
                      className="px-4 py-1.5 rounded bg-[#f59e0b] text-black font-extrabold hover:bg-amber-400 transition flex items-center gap-1.5 shadow-md shadow-[#f59e0b]/25"
                    >
                      <Send className="w-3.5 h-3.5 fill-black" />
                      <span>Send InMail / Chat</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM DELETE POST MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDeletePost}
        title="Delete Monitored Post"
        itemName={postToDelete ? `${postToDelete.authorName}'s Post (${postToDelete.company})` : ''}
        description="Are you sure you want to permanently remove this monitored post? All associated AI technical comment angles, drafts, and scheduled cron comment dispatches will be permanently deleted."
        isDeleting={isDeletingPost}
      />
    </div>
  );
}
