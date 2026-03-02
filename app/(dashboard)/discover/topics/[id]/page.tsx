import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopicService } from '@/services/topic-service';

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await TopicService.getById(id);
  if (!topic) notFound();

  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/discover" className="text-xs text-emerald-400 hover:underline">
        Back to Discover
      </Link>
      <p className="text-[10px] font-mono text-[#f59e0b] uppercase">{topic.category}</p>
      <h1 className="text-2xl font-bold text-slate-100">{topic.title}</h1>
      <p className="text-sm text-zinc-400">{topic.summary}</p>
      {topic.keyFacts.length > 0 && (
        <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-4">
          {topic.keyFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      )}
      {topic.suggestedAngles.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-emerald-300 uppercase">Content angles</h2>
          {topic.suggestedAngles.map((angle) => (
            <p key={angle} className="text-xs text-zinc-300">{angle}</p>
          ))}
        </div>
      )}
    </div>
  );
}
