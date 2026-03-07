export interface TopicSignal {
  id: string;
  title: string;
  category: 'AI & Inference' | 'Distributed Systems' | 'Cloud & Infra' | 'Database Engines' | 'Developer Tooling';
  summary: string;
  source: string;
  sourceUrl?: string;
  trendScore: number; // 0-100
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

export const INITIAL_TOPIC_SIGNALS: TopicSignal[] = [
  {
    id: 'sig-1',
    title: 'Speculative Decoding & Multi-Token Prediction in Production LLM Inference',
    category: 'AI & Inference',
    summary: 'Decoupling target model compute from small draft models yields 2.8x-3.8x lower latency per output token without compromising sampling temperature.',
    source: 'DeepMind Research & vLLM Core Architecture',
    trendScore: 98,
    freshness: '4 hours ago',
    careerRelevance: 'Staff AI Infrastructure / ML Systems Engineer',
    companyRelevance: ['Anthropic', 'OpenAI', 'Google Cloud', 'Together AI'],
    tags: ['Inference', 'LLM Systems', 'Speculative Decoding', 'vLLM'],
    keyFacts: [
      'Draft models execute on memory-bound tensor bandwidth while main model validates batch tokens concurrently.',
      'Tree-based speculative verification captures branching tokens with zero rejection penalty on accepted paths.',
      'Reduces GPU cluster energy and inference cloud bills by up to 42% on long-context generation.'
    ],
    timeline: [
      { year: '2023', milestone: 'Initial Leviathan & Chen draft-model verification theorem published' },
      { year: '2024', milestone: 'vLLM and TensorRT-LLM introduce streaming speculative pipelines' },
      { year: '2025', milestone: 'Multi-token prediction incorporated into frontier model weights natively' },
      { year: '2026', milestone: 'Dynamic speculative draft selection based on prompt entropy' }
    ],
    suggestedAngles: [
      'Why Speculative Decoding is the single biggest win for LLM latency budgets in 2026',
      'Architectural breakdown: Tree-verification vs linear draft pipelines under heavy concurrency',
      'The engineering cost trade-off: Draft VRAM memory footprint vs token speedup'
    ],
    isSaved: true,
  },
  {
    id: 'sig-2',
    title: 'Kernel-Bypassing eBPF Observability for High-Throughput Kafka Infrastructure',
    category: 'Distributed Systems',
    summary: 'Replacing userspace tracing agents with in-kernel eBPF ring buffers eliminates CPU context-switch latency in distributed streaming backbones.',
    source: 'Stripe Engineering & Cloudflare Architecture Blog',
    trendScore: 94,
    freshness: '7 hours ago',
    careerRelevance: 'Staff Distributed Systems Engineer / Platform Architect',
    companyRelevance: ['Stripe', 'Cloudflare', 'Datadog', 'Snowflake'],
    tags: ['eBPF', 'Kafka', 'Linux Kernel', 'Observability', 'Low Latency'],
    keyFacts: [
      'eBPF programs run sandboxed directly in the kernel space at socket buffer boundary.',
      'Bypasses millions of userspace context switches per second on multi-gigabit TCP streams.',
      'Provides microsecond p99 latency isolation during partition rebalances.'
    ],
    timeline: [
      { year: '2022', milestone: 'BCC and libbpf adopted for production network telemetry' },
      { year: '2024', milestone: 'Kafka KRaft deployments migrate from JMX polling to eBPF socket tracing' },
      { year: '2026', milestone: 'Autonomous packet-level zero-copy socket steering in production' }
    ],
    suggestedAngles: [
      'How eBPF saved 18% cluster CPU on our multi-broker streaming clusters',
      'Why traditional APM agents degrade p99 latency in event-driven systems',
      'Step-by-step guide to writing your first custom eBPF socket filter for Kafka'
    ],
    isSaved: true,
  },
  {
    id: 'sig-3',
    title: 'Tiered Write-Ahead Log (WAL) Replication in Serverless Postgres Engines',
    category: 'Database Engines',
    summary: 'Decoupling database compute nodes from immutable object-storage page servers fundamentally changes Postgres scalability and recovery time.',
    source: 'Neon & AWS Aurora Architecture Whitepaper',
    trendScore: 91,
    freshness: '1 day ago',
    careerRelevance: 'Staff Database Systems / Storage Engine Engineer',
    companyRelevance: ['Neon', 'Supabase', 'AWS', 'Google Cloud'],
    tags: ['PostgreSQL', 'Storage Engines', 'WAL', 'Distributed DB'],
    keyFacts: [
      'Compute nodes do not maintain persistent disks; they replay page diffs on demand.',
      'Log-structured storage tier stores immutable LSN records in NVMe tiers before flushing to S3.',
      'Instantaneous point-in-time recovery and branchable databases in under 400ms.'
    ],
    timeline: [
      { year: '2021', milestone: 'Neon open sources storage engine architecture' },
      { year: '2023', milestone: 'Zero-copy database branching adopted for developer CI/CD' },
      { year: '2025', milestone: 'Local NVMe-oF page caches rival local disk throughput' },
      { year: '2026', milestone: 'Serverless instant-suspend down to 0 compute nodes without state loss' }
    ],
    suggestedAngles: [
      'Separation of compute and storage: The definitive death of monolithic relational DBs?',
      'How tiered WAL replication reduces cold cache restore times by 95%',
      'Lessons learned migrating 100k production tables to a serverless Postgres architecture'
    ],
    isSaved: false,
  },
  {
    id: 'sig-4',
    title: 'WebGPU Compute Shaders for In-Browser Vector Embeddings & Quantized Inference',
    category: 'Developer Tooling',
    summary: 'Browser-native tensor operations via WebGPU eliminate cloud API roundtrips for client-side privacy-first semantic search.',
    source: 'W3C WebGPU Standards & ONNX Runtime Web',
    trendScore: 88,
    freshness: '2 days ago',
    careerRelevance: 'Lead Web Engineer / Frontier AI Engineer',
    companyRelevance: ['Figma', 'Vercel', 'Canva', 'Google'],
    tags: ['WebGPU', 'Client AI', 'WASM', 'Vector Search'],
    keyFacts: [
      'Executes WGSL compute kernels directly on client GPU without WebGL texture emulation.',
      '8-bit quantized models run at 60 FPS in Chrome and Safari without background thermal throttling.',
      'Enables offline local-first semantic document retrieval with zero server inference cost.'
    ],
    timeline: [
      { year: '2023', milestone: 'WebGPU reaches general availability in Chrome and Edge' },
      { year: '2024', milestone: 'ONNX Runtime and Transformers.js achieve parity with native WASM' },
      { year: '2026', milestone: 'Zero-copy shared ArrayBuffers enable seamless audio & camera streaming' }
    ],
    suggestedAngles: [
      'Why the future of semantic search is 0ms client-side WebGPU compute',
      'Benchmarking WebGPU vs WebAssembly SIMD across Apple Silicon and Nvidia laptops',
      'Building an end-to-end private code search tool that never phones home'
    ],
    isSaved: false,
  }
];

export const INITIAL_COMPANIES: TargetCompany[] = [
  {
    id: 'comp-1',
    name: 'Anthropic',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=face',
    industry: 'Frontier AI & Safety',
    priority: 'Tier 1',
    technologies: ['PyTorch', 'Distributed Training', 'vLLM', 'Rust', 'Kubernetes'],
    recentSignalCount: 8,
    engagementCount: 14,
    headquarters: 'San Francisco, CA',
    targetRoles: ['Staff AI Infrastructure Engineer', 'Member of Technical Staff - Inference'],
    description: 'Frontier AI research company focusing on helpful, harmless, and honest AI systems, creators of Claude.',
    openRolesCount: 18,
    signals: [
      { title: 'New cluster scaling whitepaper on 100k GPU nodes', date: '2 days ago', relevance: 'High' },
      { title: 'Claude 3.7 Sonnet architectural reflections released', date: '1 week ago', relevance: 'Critical' }
    ]
  },
  {
    id: 'comp-2',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop&crop=face',
    industry: 'Financial Infrastructure',
    priority: 'Tier 1',
    technologies: ['Ruby / Sorbet', 'Java', 'Kafka', 'eBPF', 'AWS', 'Envoy'],
    recentSignalCount: 6,
    engagementCount: 19,
    headquarters: 'South San Francisco, CA & Dublin',
    targetRoles: ['Staff Infrastructure Engineer', 'Principal Engineer - Payment Core'],
    description: 'Financial infrastructure platform powering internet commerce, legendary for distributed reliability.',
    openRolesCount: 24,
    signals: [
      { title: 'Sorbet static typing speedup for large codebases', date: '3 days ago', relevance: 'Medium' },
      { title: 'Zero-downtime multi-region ledger architecture deep dive', date: '5 days ago', relevance: 'High' }
    ]
  },
  {
    id: 'comp-3',
    name: 'Datadog',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=128&h=128&fit=crop&crop=face',
    industry: 'Cloud Monitoring & Security',
    priority: 'Tier 2',
    technologies: ['Go', 'eBPF', 'Kafka', 'Cassandra', 'C++'],
    recentSignalCount: 5,
    engagementCount: 9,
    headquarters: 'New York, NY',
    targetRoles: ['Staff Systems Engineer - Agent Core', 'Lead Distributed Storage Architect'],
    description: 'Cloud-scale observability and security platform handling trillions of events daily.',
    openRolesCount: 15,
    signals: [
      { title: 'eBPF continuous profiling at scale in production Linux kernels', date: '4 days ago', relevance: 'High' }
    ]
  },
  {
    id: 'comp-4',
    name: 'Snowflake',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&h=128&fit=crop&crop=face',
    industry: 'Data Cloud & Warehousing',
    priority: 'Tier 2',
    technologies: ['C++', 'Java', 'FoundationDB', 'Apache Iceberg', 'Python'],
    recentSignalCount: 4,
    engagementCount: 11,
    headquarters: 'Bozeman, MT & San Mateo, CA',
    targetRoles: ['Principal Query Execution Engineer', 'Staff Cloud Storage Architect'],
    description: 'Cloud data platform powering enterprise analytics, data lakes, and generative AI apps on Iceberg.',
    openRolesCount: 20,
    signals: [
      { title: 'Vector execution optimizations for columnar Iceberg tables', date: '6 days ago', relevance: 'High' }
    ]
  }
];

export const INITIAL_PEOPLE: TargetPerson[] = [
  {
    id: 'person-1',
    name: 'Alex Rivera',
    company: 'Stripe',
    role: 'Staff Infrastructure Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
    profileUrl: 'https://linkedin.com/in/alex-rivera-infra',
    topics: ['Distributed Systems', 'Kafka', 'eBPF', 'Zero Downtime'],
    priority: 'High',
    lastInteraction: '2 days ago',
    engagementCount: 6,
    notes: 'Key decision maker for platform scaling. Very receptive to benchmark data and kernel optimizations.',
    relationshipStatus: 'Active Dialogue'
  },
  {
    id: 'person-2',
    name: 'Sarah Chen, PhD',
    company: 'Anthropic',
    role: 'Member of Technical Staff - Inference',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face',
    profileUrl: 'https://linkedin.com/in/sarah-chen-ai',
    topics: ['Speculative Decoding', 'vLLM', 'KV Caching', 'GPU Kernels'],
    priority: 'High',
    lastInteraction: 'Yesterday',
    engagementCount: 4,
    notes: 'Publishes frequently on inference batching. Engages on deep technical questions with math/code references.',
    relationshipStatus: 'Replied'
  },
  {
    id: 'person-3',
    name: 'Marcus Vance',
    company: 'Datadog',
    role: 'VP of Systems Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    profileUrl: 'https://linkedin.com/in/marcus-vance-eng',
    topics: ['Linux Kernel', 'Telemetry', 'SRE Culture', 'High Concurrency'],
    priority: 'Medium',
    lastInteraction: '5 days ago',
    engagementCount: 3,
    notes: 'Interested in reducing CPU tax of telemetry collectors.',
    relationshipStatus: 'Connected'
  }
];

export const INITIAL_ENGAGEMENTS: EngagementOpportunity[] = [
  {
    id: 'eng-1',
    author: 'Sarah Chen, PhD',
    role: 'Member of Technical Staff - Inference',
    company: 'Anthropic',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face',
    timestamp: '3 hours ago',
    platform: 'LinkedIn',
    content: 'A lot of teams think speculative decoding is a free lunch. But if your draft model has less than 70% acceptance rate on code generation, the validation overhead and memory bandwidth penalty will actually degrade your p95 latency. You need dynamic draft selection based on entropy.',
    relevanceScore: 98,
    technicalAngle: 'Inference batch validation & entropy thresholds',
    status: 'pending',
    suggestedComments: [
      {
        type: 'Technical Insight',
        text: 'Crucial observation on draft model acceptance rates. When token entropy spikes during complex algorithmic loops, speculative rollback thrashing consumes GPU memory channels that could have finished standard autoregressive step faster. We observed that capping draft tokens to 2 when entropy exceeds 1.4 bits restores throughput.',
        originalityScore: 99,
      },
      {
        type: 'Personal Perspective',
        text: 'We ran into this exact pitfall benchmarking a 1B draft model against a 70B target. In multi-turn dialogue, acceptance was ~78%, but on synthetic SQL schema generation, it plummeted to 48%, turning our 2x speedup into a 15% latency penalty.',
        originalityScore: 97,
      },
      {
        type: 'Constructive Question',
        text: 'Fascinating point on dynamic selection! How do you handle draft model KV cache eviction when switching draft models mid-stream? Does the context re-encoding overhead ever negate the entropy prediction gain?',
        originalityScore: 98,
      },
      {
        type: 'Alternative Perspective',
        text: 'Tree-based speculative decoders like Medusa mitigate the low acceptance penalty by testing multiple draft branches simultaneously on the same forward pass, though at the expense of higher VRAM allocation.',
        originalityScore: 96,
      }
    ]
  },
  {
    id: 'eng-2',
    author: 'Alex Rivera',
    role: 'Staff Infrastructure Architect',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
    timestamp: '6 hours ago',
    platform: 'LinkedIn',
    content: 'Unpopular infrastructure opinion: Moving observability from userspace sidecars into eBPF socket filters is the single cleanest way to win back 15% of your cluster CPU. If you are still running heavy sidecars on your high-throughput stream nodes, you are essentially paying an involuntary context-switch tax.',
    relevanceScore: 96,
    technicalAngle: 'eBPF kernel bypass vs userspace sidecar overhead',
    status: 'pending',
    suggestedComments: [
      {
        type: 'Technical Insight',
        text: 'The involuntary context-switch tax is spot on. On multi-tenant brokers handling 500k req/sec, each userspace roundtrip incurs L1/L2 cache evictions and TLB shootdowns. eBPF ring buffers using BPF_MAP_TYPE_RINGBUF provide lockless in-kernel ingestion without memory copies.',
        originalityScore: 99,
      },
      {
        type: 'Personal Perspective',
        text: 'We migrated our ingress layer from daemonset sidecars to an eBPF-based flow tracer last quarter. Beyond the 14% CPU reclamation, our p99 tail latency dropped from 18ms to 4.2ms simply by avoiding socket queue contention.',
        originalityScore: 96,
      },
      {
        type: 'Constructive Question',
        text: 'What was your strategy for handling kernel version discrepancies across your fleet during the rollout? Did you rely strictly on CO-RE (Compile Once – Run Everywhere) with BTF, or did you have to maintain fallback probes?',
        originalityScore: 98,
      },
      {
        type: 'Alternative Perspective',
        text: 'The trade-off many teams forget is verifier limits and debugging complexity. When an eBPF program is rejected by the kernel verifier due to loop boundaries or stack depths, debugging kernel logs is significantly harder for junior SREs than troubleshooting a standard Go sidecar.',
        originalityScore: 95,
      }
    ]
  }
];

export const INITIAL_CONTENT_PIPELINE: ContentItem[] = [
  {
    id: 'cnt-1',
    title: 'Why Speculative Decoding Lowers Frontier Model Cost 4x',
    type: 'Technical Article',
    status: 'draft',
    platform: 'Web',
    createdDate: '2026-09-24',
    tags: ['AI', 'Inference', 'Distributed Systems'],
    body: 'A deep dive into speculative draft pipelines, entropy thresholds, and GPU memory channel optimization.',
    views: 1420,
    engagements: 184,
  },
  {
    id: 'cnt-2',
    title: 'Kernel-Bypassing with eBPF: Killing the Sidecar Tax',
    type: 'LinkedIn Post',
    status: 'approved',
    platform: 'LinkedIn',
    createdDate: '2026-09-26',
    scheduledDate: '2026-09-29 09:00',
    tags: ['eBPF', 'Linux', 'Observability'],
    body: 'Most engineers don’t realize how many millions of CPU context switches their sidecars generate every hour...',
  },
  {
    id: 'cnt-3',
    title: 'Postgres vs DuckDB: The Vectorized Storage Revolution',
    type: 'Carousel Slides',
    status: 'review',
    platform: 'LinkedIn',
    createdDate: '2026-09-25',
    tags: ['Database', 'Postgres', 'Analytics'],
    body: '8 slides breaking down row-oriented B-trees versus vectorized columnar compression.',
  },
  {
    id: 'cnt-4',
    title: 'Understanding Raft Invariants: Log Compaction & Heartbeats',
    type: 'Technical Article',
    status: 'published',
    platform: 'Web',
    createdDate: '2026-09-18',
    tags: ['Consensus', 'Raft', 'Distributed DB'],
    body: 'Complete visual guide to leader election safety and partition recovery.',
    views: 5820,
    engagements: 432,
  },
  {
    id: 'cnt-5',
    title: 'Designing Cache Coherency with Redis Cluster & Local Ephemeral VRAM',
    type: 'LinkedIn Post',
    status: 'scheduled',
    platform: 'LinkedIn',
    createdDate: '2026-09-27',
    scheduledDate: '2026-09-30 14:00',
    tags: ['Caching', 'Redis', 'Architecture'],
    body: 'Cache invalidation is famously hard. Here is how we enforce write-through invariants with zero phantom reads.',
  }
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    slug: 'speculative-decoding-production-llms',
    title: 'Speculative Decoding in Production: How to Cut Token Latency by 65%',
    subtitle: 'An architectural deep dive into draft model selection, entropy verification thresholds, and memory-bandwidth decoupling.',
    category: 'AI Systems',
    status: 'published',
    publishedDate: 'Sept 26, 2026',
    readTime: '7 min read',
    views: 4890,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
    toc: [
      { id: 'the-memory-bandwidth-wall', title: '1. The Memory Bandwidth Wall in Autoregressive Sampling' },
      { id: 'mathematics-of-speculation', title: '2. The Mathematics of Speculative Verification' },
      { id: 'draft-entropy-thresholds', title: '3. Dynamic Entropy Thresholding' },
      { id: 'production-benchmarks', title: '4. Production Benchmarks & Cluster Cost' },
      { id: 'architectural-takeaways', title: '5. Staff Engineer Key Invariants' },
    ],
    contentMarkdown: `## 1. The Memory Bandwidth Wall in Autoregressive Sampling
Modern large language models during inference are rarely compute-bound; they are **memory-bandwidth bound**. Every generated token requires loading gigabytes of weights from High-Bandwidth Memory (HBM3e) onto the streaming multiprocessor registers just to perform a single forward pass.

When generating token by token, memory channels are saturated while compute cores sit idle. 

\`\`\`
Autoregressive Step:
Weight Load (140GB) -> Arithmetic (1 token) -> Memory Eviction
\`\`\`

## 2. The Mathematics of Speculative Verification
Speculative decoding resolves this bottleneck by running a smaller, hyper-fast "draft model" (e.g. 1B parameters) that executes multiple speculative tokens ahead of time. The primary target model (e.g. 70B parameters) then executes **a single batch forward pass** to verify all draft tokens simultaneously.

Because batch computation utilizes the exact same weight-loading pass from HBM, verifying $K$ draft tokens takes virtually identical GPU time to generating 1 token!

## 3. Dynamic Entropy Thresholding
The risk of speculative decoding is token rejection. When draft models guess incorrectly, the target model must roll back KV-cache pointers and re-sample.
By measuring the **Shannon entropy** of the target model's output distribution:
$$H(X) = -\\sum P(x_i) \\log_2 P(x_i)$$
The engine can dynamically adjust draft speculative depth:
- Low entropy ($H < 0.8$): Speculate 4 to 6 tokens ahead (e.g. boilerplate syntax, repetitive JSON structures).
- High entropy ($H > 1.6$): Speculate only 1 token or fall back to pure autoregressive generation.

## 4. Production Benchmarks
In our test cluster running vLLM across 8x H100 nodes:
- **Baseline Autoregressive**: 28.4 tokens/second per stream
- **Fixed Speculative (K=4)**: 62.1 tokens/second (2.18x speedup)
- **Entropy-Guided Speculative**: 84.7 tokens/second (2.98x speedup)
- **Cluster Cloud Compute Savings**: 38.6% per million output tokens.`,
    seo: {
      metaTitle: 'Speculative Decoding in Production: Cut Token Latency by 65% | SignalForge',
      metaDescription: 'Complete technical breakdown of speculative draft model verification, entropy gating, and GPU memory bandwidth scaling in modern inference clusters.',
      canonicalUrl: 'https://signalforge.dev/articles/speculative-decoding-production-llms',
      keywords: ['Speculative Decoding', 'vLLM', 'LLM Inference', 'GPU Memory Bandwidth', 'AI Systems'],
      ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop'
    }
  },
  {
    id: 'art-2',
    slug: 'ebpf-kernel-bypassing-kafka',
    title: 'Kernel-Bypassing with eBPF: Reclaiming 15% Cluster CPU from Kafka Sidecars',
    subtitle: 'Why socket-level eBPF ring buffers eradicate the context-switch tax in high-throughput distributed event streaming.',
    category: 'Distributed Systems',
    status: 'published',
    publishedDate: 'Sept 22, 2026',
    readTime: '6 min read',
    views: 3120,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
    toc: [
      { id: 'the-sidecar-tax', title: '1. The Sidecar Tax in Microservice Meshes' },
      { id: 'bpf-ringbuf-architecture', title: '2. BPF Ringbuf vs Userspace Sockets' },
      { id: 'latency-impact', title: '3. Benchmarking p99 Microsecond Tails' },
    ],
    contentMarkdown: `## 1. The Sidecar Tax in Microservice Meshes
Traditional daemonset sidecars monitor network payloads by intercepting packets via iptables redirects or TCP proxy loops. On systems processing millions of records per second, this introduces catastrophic context switches and cache thrashing.

## 2. BPF Ringbuf Architecture
By inserting eBPF bytecode directly into the Linux socket buffer layer (\`sock_ops\` and \`sk_msg\`), telemetry events are committed to lockless memory ring buffers with zero kernel-to-user memory duplication.`,
    seo: {
      metaTitle: 'Kernel-Bypassing with eBPF: Reclaiming 15% Cluster CPU | SignalForge',
      metaDescription: 'Eliminate Kafka sidecar CPU overhead using eBPF socket filters and lockless ring buffers.',
      canonicalUrl: 'https://signalforge.dev/articles/ebpf-kernel-bypassing-kafka',
      keywords: ['eBPF', 'Kafka', 'Linux Kernel', 'Distributed Systems'],
      ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop'
    }
  }
];

export const INITIAL_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Mitigated 100M+ Req/Day Cache Stampede with Singleflight & Redis Cell',
    project: 'Distributed Identity & Rate Limiting Gateway',
    problem: 'Sudden flash-crowd login spikes caused upstream Postgres thread exhaustion as expired cache entries triggered thousands of simultaneous DB queries.',
    challenge: 'Could not simply increase TTL because authentication tokens required deterministic 60-second revocation guarantees across 4 regional clusters.',
    solution: 'Implemented Go singleflight deduplication on cache misses combined with an atomic Redis token bucket via Redis Cell. Pre-warmed cache keys asynchronously at 80% TTL expiration.',
    technologies: ['Go', 'Redis', 'PostgreSQL', 'Docker', 'Prometheus'],
    result: 'Reduced database query spikes during traffic surges by 94.2%. p99 latency dropped from 420ms to 12ms under 25,000 req/sec load.',
    lesson: 'Never let client requests initiate un-debounced database queries on cache misses. Asynchronous pre-warming always beats reactive eviction.',
    tags: ['Caching', 'Concurrency', 'Redis', 'High Availability']
  },
  {
    id: 'exp-2',
    title: 'Architected Zero-Downtime Migration of 45TB Kafka KRaft Cluster',
    project: 'Real-Time Event Processing Core',
    problem: 'Legacy ZooKeeper-based Kafka cluster suffered frequent leader election timeouts during network partition blips, stalling billing ingestion pipelines.',
    challenge: 'Strict zero message-loss requirement; could not afford more than 0ms of consumer lag drift or duplicate billing receipts.',
    solution: 'Formulated a 4-phase dual-write migration to KRaft metadata quorum with dynamic partition rebalancing scripts and eBPF consumer lag tracing.',
    technologies: ['Apache Kafka', 'KRaft', 'eBPF', 'Kubernetes', 'Terraform'],
    result: 'Successfully migrated 45TB of replicated partition logs without a single dropped packet or customer-facing payment disruption.',
    lesson: 'Verify cluster consensus invariants in an isolated staging shadow mirror before touching production metadata controllers.',
    tags: ['Distributed Systems', 'Kafka', 'Consensus', 'Zero Downtime']
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'AetherKV — Distributed In-Memory Raft Consensus Store',
    description: 'High-performance distributed key-value store in Go implementing Raft consensus, log compaction, snapshotting, and atomic compare-and-swap.',
    problem: 'Off-the-shelf stores had high memory overhead and opaque failure recovery semantics for custom micro-leader topologies.',
    architecture: 'Multi-node Raft state machine with memory-mapped write-ahead logs, asynchronous snapshotting, and gRPC streaming between peers.',
    technologies: ['Go', 'gRPC', 'Protobuf', 'Raft Consensus', 'BoltDB'],
    githubUrl: 'https://github.com/example/aether-kv',
    liveUrl: 'https://aether-demo.example.dev',
    lessons: 'Handling split-brain partitions requires strict leader lease verification before acknowledging read quorums.',
    relatedArticleSlug: 'speculative-decoding-production-llms'
  },
  {
    id: 'proj-2',
    name: 'TraceForge — eBPF Low-Overhead Network Profiler',
    description: 'Lightweight Linux kernel observability tool providing per-socket TCP retransmit and queue latency metrics without userspace context switches.',
    problem: 'Standard APM agents consumed 12-18% of CPU on edge proxies.',
    architecture: 'Kernel-space eBPF C program writing to circular ring buffer, read by Go CLI with Prometheus exporter.',
    technologies: ['C', 'libbpf', 'Go', 'eBPF', 'Grafana'],
    githubUrl: 'https://github.com/example/traceforge-ebpf',
    liveUrl: 'https://traceforge.example.dev',
    lessons: 'BPF verifier safety bounds require bounded loops and strict pointer math.',
    relatedArticleSlug: 'ebpf-kernel-bypassing-kafka'
  }
];

export const INITIAL_CAREER_GOAL: CareerGoal = {
  targetRole: 'Staff / Principal AI Infrastructure Engineer',
  experienceLevel: 'Senior / Staff (8+ Years)',
  targetCompanies: ['Anthropic', 'Stripe', 'Datadog', 'Snowflake', 'OpenAI'],
  risingSkills: [
    { name: 'Speculative Decoding & LLM Inference', matchPercent: 94, demand: 'Surging' },
    { name: 'eBPF Kernel Tracing & Observability', matchPercent: 88, demand: 'Surging' },
    { name: 'Distributed Consensus (Raft / Paxos)', matchPercent: 96, demand: 'High' },
    { name: 'Vectorized Columnar Storage (Iceberg / Parquet)', matchPercent: 82, demand: 'High' },
    { name: 'WebGPU Client Compute', matchPercent: 74, demand: 'Stable' }
  ],
  skillGaps: [
    'Triton custom GPU kernel development for FlashAttention variations',
    'NVMe-over-Fabrics (NVMe-oF) tiered memory caching benchmarks'
  ],
  recommendedAngles: [
    'Publish a deep dive on memory-bandwidth walls in LLM inference clusters',
    'Write a comparative benchmark of eBPF vs userspace tracing in Kafka',
    'Engage with Anthropic inference researchers regarding dynamic draft entropy'
  ]
};

export const INITIAL_PROMPT_LIBRARY = [
  {
    id: 'prm-1',
    name: 'Anti-Spam Staff Engineer Comment Generator',
    model: 'gemini-2.5-flash',
    category: 'Engagement',
    tokens: 380,
    promptText: 'Analyze the following technical post from an engineering leader. Formulate 4 distinct commentary perspectives (Technical Insight, Personal Experience, Constructive Question, Alternative Tradeoff). Ensure strict zero-slop, no generic praise, and deep domain grounding.',
    lastUsed: 'Today'
  },
  {
    id: 'prm-2',
    name: 'Technical Article Deep-Dive Outline',
    model: 'gemini-2.5-flash',
    category: 'Editorial',
    tokens: 650,
    promptText: 'Generate a publication-grade article structure for a Staff Software Engineer audience. Include architectural diagrams, mathematical invariants, benchmark setups, and counter-intuitive production pitfalls.',
    lastUsed: 'Yesterday'
  },
  {
    id: 'prm-3',
    name: 'STAR Experience to Viral Post Converter',
    model: 'gemini-2.5-flash',
    category: 'Content',
    tokens: 420,
    promptText: 'Take this raw engineering incident war-story and extract the core architectural lesson. Format as a high-density, narrative LinkedIn post with a strong technical hook and concrete metrics.',
    lastUsed: '3 days ago'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New High-Relevance Signal Detected',
    message: 'Anthropic published research on speculative decoding memory latency.',
    timestamp: '25m ago',
    type: 'signal',
    read: false,
    link: '/discover'
  },
  {
    id: 'notif-2',
    title: 'Target Person Posted on LinkedIn',
    message: 'Sarah Chen (Anthropic) posted about draft model acceptance rates.',
    timestamp: '2h ago',
    type: 'engagement',
    read: false,
    link: '/engagement'
  },
  {
    id: 'notif-3',
    title: 'Article Performance Milestone',
    message: 'Your article "Speculative Decoding in Production" crossed 4,800 readers.',
    timestamp: '1d ago',
    type: 'analytics',
    read: true,
    link: '/articles'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'Published Technical Article',
    resource: 'speculative-decoding-production-llms',
    timestamp: 'Sept 26, 2026, 14:22 UTC',
    status: 'Success'
  },
  {
    id: 'log-2',
    action: 'AI Comment Generated',
    resource: 'Anthropic Sarah Chen Post',
    timestamp: 'Sept 28, 2026, 06:10 UTC',
    status: 'Success'
  },
  {
    id: 'log-3',
    action: 'Target Company Added',
    resource: 'Snowflake (Tier 2)',
    timestamp: 'Sept 25, 2026, 11:04 UTC',
    status: 'Success'
  },
  {
    id: 'log-4',
    action: 'STAR Experience Vault Updated',
    resource: 'Kafka KRaft Zero Downtime Migration',
    timestamp: 'Sept 24, 2026, 09:15 UTC',
    status: 'Success'
  }
];

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
  cronExpression: string; // e.g. "0 9 * * *"
  scheduleHumanText: string;
  dailyLimit: number; // e.g. 15
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
  cronSchedule: string; // e.g. "0 */4 * * *"
  scheduleHumanText: string;
  autoPostEnabled: boolean; // if false, queues for 1-click human approval
  dailyCommentLimit: number;
  commentsPostedToday: number;
  totalProfileViewsGained: number;
  recruiterInboundsTriggered: number;
  lastRunTime: string;
}

export const INITIAL_PROSPECTING_CAMPAIGN: ProspectingCampaign = {
  id: 'cmp-1',
  name: 'FAANG & Tier-1 Systems Engineering Expansion',
  isActive: true,
  cronExpression: '0 9 * * *',
  scheduleHumanText: 'Daily at 09:00 UTC',
  dailyLimit: 15,
  sentToday: 7,
  totalSent: 84,
  acceptedCount: 38,
  targetCriteria: {
    companies: ['Google', 'Meta', 'Netflix', 'Apple', 'Amazon', 'Anthropic', 'Stripe'],
    roles: ['Staff Software Engineer', 'Principal Architect', 'Engineering Manager', 'Tech Lead'],
    technologies: ['Distributed Systems', 'LLM Inference', 'eBPF', 'PostgreSQL WAL', 'vLLM'],
    seniorities: ['Staff', 'Principal', 'Engineering Manager', 'Director'],
  },
  lastRunAt: 'Today at 09:00 UTC',
  nextRunAt: 'Tomorrow at 09:00 UTC',
};

export const INITIAL_LINKEDIN_PROSPECTS: LinkedInProspect[] = [
  {
    id: 'prosp-1',
    name: 'David Chen',
    currentCompany: 'Google (DeepMind)',
    role: 'Principal Systems Architect — TPU Inference Fleet',
    companyTier: 'FAANG',
    location: 'Mountain View, CA',
    profileUrl: 'https://linkedin.com/in/david-chen-tpu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 99,
    seniority: 'Principal',
    techAlignment: ['Speculative Decoding', 'TPU v5p', 'Distributed KV Cache', 'TensorRT'],
    connectionStatus: 'queued_cron',
    personalizedNote: 'Hi David, loved your insights on decoupled TPU memory bus scaling. I recently published an architecture deep dive on dynamic draft entropy gating in speculative decoding. Would love to connect and follow your systems work!',
    lastActivity: 'Active 2h ago',
    hiringSignal: 'Actively hiring Staff ML Infra Engineers for TPU Fleet',
  },
  {
    id: 'prosp-2',
    name: 'Elena Rostova',
    currentCompany: 'Meta',
    role: 'Director of Engineering — PyTorch & Distributed GPU Core',
    companyTier: 'FAANG',
    location: 'Menlo Park, CA',
    profileUrl: 'https://linkedin.com/in/elena-rostova-meta',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 97,
    seniority: 'Director',
    techAlignment: ['PyTorch FSDP', 'GPU Kernel Tuning', 'CUDA Streams', 'Distributed Training'],
    connectionStatus: 'queued_cron',
    personalizedNote: 'Hi Elena, your work expanding FSDP v2 zero-redundancy optimizer at Meta is legendary. As a systems engineer focusing on low-overhead kernel observability and inference latency, I’d be honored to connect.',
    lastActivity: 'Active 4h ago',
    hiringSignal: 'Expanding Staff AI Platform team in Menlo Park & Seattle',
  },
  {
    id: 'prosp-3',
    name: 'Marcus Vance',
    currentCompany: 'Netflix',
    role: 'Staff Distributed Systems Engineer — Core Streaming Mesh',
    companyTier: 'FAANG',
    location: 'Los Gatos, CA',
    profileUrl: 'https://linkedin.com/in/marcus-vance-netflix',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 95,
    seniority: 'Staff',
    techAlignment: ['eBPF', 'Kafka KRaft', 'High Concurrency', 'Zero Downtime'],
    connectionStatus: 'invite_sent',
    personalizedNote: 'Hi Marcus, followed your blog on eliminating sidecar proxy CPU taxes. We recently migrated a 45TB streaming cluster to eBPF socket filters and saved 15% CPU. Would love to stay connected!',
    lastActivity: 'Active yesterday',
  },
  {
    id: 'prosp-4',
    name: 'Sarah Chen, PhD',
    currentCompany: 'Anthropic',
    role: 'Member of Technical Staff — Frontier Inference Systems',
    companyTier: 'Frontier AI',
    location: 'San Francisco, CA',
    profileUrl: 'https://linkedin.com/in/sarah-chen-anthropic',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 98,
    seniority: 'Staff',
    techAlignment: ['Speculative Decoding', 'Claude Inference', 'KV Eviction', 'vLLM'],
    connectionStatus: 'connected',
    personalizedNote: 'Hi Sarah, your points on speculative verification rollback penalties under high entropy match our production benchmarks exactly. Excited to stay in touch!',
    lastActivity: 'Active 1h ago',
    hiringSignal: 'Hiring Member of Technical Staff (Inference Scaling)',
  },
  {
    id: 'prosp-5',
    name: 'Karthik Raman',
    currentCompany: 'Apple',
    role: 'Senior Engineering Manager — CoreML & On-Device Neural Engines',
    companyTier: 'FAANG',
    location: 'Cupertino, CA',
    profileUrl: 'https://linkedin.com/in/karthik-raman-apple',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 94,
    seniority: 'Engineering Manager',
    techAlignment: ['WebGPU Compute', 'Quantized Inference', 'Neural Engine', 'Metal Performance Shaders'],
    connectionStatus: 'uncontacted',
    personalizedNote: 'Hi Karthik, fascinated by Apple’s on-device zero-roundtrip inference research. I’ve been benchmarking in-browser WebGPU tensor kernels vs WASM SIMD. Would love to connect and follow your team’s progress.',
    lastActivity: 'Active 3d ago',
    hiringSignal: 'Looking for Senior/Staff Systems Engineers for Apple Neural Engine',
  },
  {
    id: 'prosp-6',
    name: 'Alex Rivera',
    currentCompany: 'Stripe',
    role: 'Staff Infrastructure Architect — Global Payment Ledger',
    companyTier: 'Fintech Core',
    location: 'San Francisco, CA',
    profileUrl: 'https://linkedin.com/in/alex-rivera-stripe',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&crop=face',
    aiMatchScore: 96,
    seniority: 'Staff',
    techAlignment: ['PostgreSQL WAL', 'Raft Consensus', 'Singleflight Caching', 'Zero Downtime'],
    connectionStatus: 'chat_active',
    personalizedNote: 'Hi Alex, loved your talk on tiered WAL replication without monolithic DB lockups. Great to connect!',
    lastActivity: 'Active 5m ago',
    hiringSignal: 'Staff Infrastructure Role open on Global Core Ledger',
  }
];

export const INITIAL_FAANG_MONITORED_POSTS: FaangMonitoredPost[] = [
  {
    id: 'fpost-1',
    authorName: 'David Chen',
    authorRole: 'Principal Systems Architect (TPU Inference)',
    company: 'Google (DeepMind)',
    companyBadge: 'FAANG',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
    postTimestamp: '2 hours ago',
    platform: 'LinkedIn',
    originalPostText: 'When serving 100k concurrent LLM streams, memory bandwidth saturation at the HBM interface dominates total cost. If teams spend all their engineering hours writing custom fused kernels but ignore batch speculative draft alignment, they are leaving 3x throughput on the table. Hardware isn’t the bottleneck—it is the memory bus scheduling.',
    technicalProblemSummary: 'HBM3e memory bus saturation during token autoregression; lack of dynamic speculative draft model scheduling.',
    whyEngageReason: 'David manages hiring for Google DeepMind TPU Fleet. A technical comment highlighting memory channel utilization will immediately trigger recruiter interest.',
    aiSuggestedComments: [
      {
        angle: 'Staff Technical Insight',
        commentText: 'Spot-on regarding memory bus scheduling vs fused kernels. In autoregressive forward passes, loading 140GB weights to compute a single token leaves SM arithmetic units idle 82% of the time. Speculative verification leverages the exact same weight fetch pass to evaluate K tokens simultaneously, shifting the operational ceiling from memory-bound to compute-saturated.',
        originalityScore: 99,
      },
      {
        angle: 'Thoughtful Counter-Question',
        commentText: 'Crucial distinction! In your TPU v5p benchmarks, how do you handle dynamic draft model context synchronization across multi-host TPU slices? Does inter-chip interconnect (ICI) latency ever cannibalize the memory-bandwidth speedup when draft branch depth exceeds 4?',
        originalityScore: 98,
      },
      {
        angle: 'Production War-Story',
        commentText: 'We verified this exact phenomenon benchmarking 70B targets with 1B drafts. Simply gating speculative depth based on output Shannon entropy restored 2.9x throughput while eliminating rollback thrashing during high-entropy code loops.',
        originalityScore: 97,
      }
    ],
    status: 'approved',
    cronScheduledAt: 'Today at 10:00 UTC',
    inMailPitchDraft: 'Hi David, following up on our discussion regarding speculative memory bus saturation on TPU slices—I have spent the past several years architecting low-latency inference and distributed streaming backbones. I noticed DeepMind is expanding the Staff TPU Fleet team. I’d welcome a conversation to discuss how my distributed systems experience could contribute.',
  },
  {
    id: 'fpost-2',
    authorName: 'Elena Rostova',
    authorRole: 'Director of Engineering — PyTorch & GPU Core',
    company: 'Meta',
    companyBadge: 'FAANG',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face',
    postTimestamp: '5 hours ago',
    platform: 'LinkedIn',
    originalPostText: 'One of the most counter-intuitive lessons from scaling LLaMA clusters across 24k H100s: Traditional TCP network telemetry agents in userspace generate millions of context switches that degrade all-reduce synchronization barriers. We need kernel-level zero-copy telemetry standard.',
    technicalProblemSummary: 'Userspace APM agents degrading p99 synchronization latency during PyTorch All-Reduce operations across large GPU clusters.',
    whyEngageReason: 'Elena leads Meta’s core GPU systems org. An authoritative technical insight citing eBPF ring buffers positions Abhishek as a prime Staff Systems candidate.',
    aiSuggestedComments: [
      {
        angle: 'Staff Technical Insight',
        commentText: 'The all-reduce barrier degradation is devastating because p99 tail latency on a single slow node stalls the entire gradient synchronization ring. Replacing userspace sidecars with eBPF BPF_MAP_TYPE_RINGBUF filters on the socket buffer interface eliminates CPU context switches and TLB flushes completely.',
        originalityScore: 99,
      },
      {
        angle: 'Thoughtful Counter-Question',
        commentText: 'Fascinating finding on the all-reduce barriers! With RoCE v2 and InfiniBand kernel-bypass (RDMA), are you attaching eBPF probes directly at the PCIe NIC driver boundary, or capturing host-level TCP fallback flows?',
        originalityScore: 98,
      },
      {
        angle: 'Production War-Story',
        commentText: 'We observed an 18ms to 4.2ms tail drop on high-throughput streaming nodes by evicting daemonset APMs for in-kernel ring buffers. The L1/L2 cache locality reclamation is massive.',
        originalityScore: 96,
      }
    ],
    status: 'hunted',
    inMailPitchDraft: 'Hi Elena, I read your insights on PyTorch all-reduce synchronization barriers and eBPF kernel telemetry. Having designed kernel-bypassing observability tools and distributed streaming systems, I would love to connect and explore Staff AI Infrastructure opportunities at Meta.',
  }
];

export const INITIAL_FAANG_COMMENT_CRON: FaangCommentCronConfig = {
  isActive: true,
  cronSchedule: '0 */4 * * *',
  scheduleHumanText: 'Every 4 Hours (Autonomous Hunt & Synthesize)',
  autoPostEnabled: false, // Guardrail: Human review before push
  dailyCommentLimit: 8,
  commentsPostedToday: 3,
  totalProfileViewsGained: 412,
  recruiterInboundsTriggered: 9,
  lastRunTime: '2 hours ago',
};

