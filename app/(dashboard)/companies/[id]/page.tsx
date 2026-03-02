import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyService } from '@/services/company-service';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await CompanyService.getById(id);
  if (!company) notFound();

  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/companies" className="text-xs text-emerald-400 hover:underline">
        Back to companies
      </Link>
      <h1 className="text-2xl font-bold text-slate-100">{company.name}</h1>
      <p className="text-xs font-mono text-[#f59e0b]">{company.priority} · {company.industry}</p>
      <p className="text-sm text-zinc-400">{company.description}</p>
      <p className="text-xs text-zinc-500">{company.headquarters}</p>
      {company.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {company.technologies.map((tech) => (
            <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#22c55e]/30 text-emerald-300">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
