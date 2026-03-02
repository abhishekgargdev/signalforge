import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EngagementService } from '@/services/engagement-service';

export default async function EngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await EngagementService.getById(id);
  if (!item) notFound();

  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/engagement" className="text-xs text-emerald-400 hover:underline">
        Back to comment studio
      </Link>
      <h1 className="text-xl font-bold text-slate-100">{item.author}</h1>
      <p className="text-xs text-zinc-500">{item.role} · {item.company} · {item.platform}</p>
      <blockquote className="text-sm text-zinc-300 border-l-2 border-[#22c55e] pl-3">{item.content}</blockquote>
      <p className="text-xs text-emerald-300">{item.technicalAngle}</p>
      <div className="space-y-2">
        {item.suggestedComments.map((comment) => (
          <div key={comment.type} className="p-3 rounded-lg bg-[#0e1710] border border-white/10 text-xs text-zinc-300">
            <div className="text-[10px] font-mono text-[#f59e0b] mb-1">{comment.type}</div>
            {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
}
