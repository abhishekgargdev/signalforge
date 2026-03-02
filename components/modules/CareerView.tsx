'use client';

import React, { useEffect, useState } from 'react';
import { IdeaBox } from '@/components/IdeaBox';
import { Pagination } from '@/components/ui/Pagination';

type Skill = { name: string; matchPercent: number; demand: string };

export function CareerView() {
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [strategy, setStrategy] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [angles, setAngles] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [skillName, setSkillName] = useState('');
  const [angle, setAngle] = useState('');
  const [skillPage, setSkillPage] = useState(1);
  const [anglePage, setAnglePage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => {
    fetch('/api/v1/career')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        const career = data.data.career;
        setTargetRole(career.targetRole || '');
        setExperienceLevel(career.experienceLevel || '');
        setStrategy(career.strategy || '');
        setSkills(career.skills || []);
        setAngles(career.angles || []);
        setCompanies(career.targetCompanies || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (next?: { skills?: Skill[]; angles?: string[] }) => {
    const res = await fetch('/api/v1/career', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole,
        experienceLevel,
        strategy,
        skills: next?.skills || skills,
        angles: next?.angles || angles,
      }),
    });
    const data = await res.json();
    setMessage(data.success ? 'Saved' : data.error?.message || 'Could not save');
  };

  const skillPages = Math.max(1, Math.ceil(skills.length / 4));
  const anglePages = Math.max(1, Math.ceil(angles.length / 4));

  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100">Career signals</h1>
        <p className="mt-1 text-xs text-zinc-400">Role, strategy, skills, and angles the daily draft can use.</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
        <IdeaBox onFill={setStrategy} />
        <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target role" className="rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs" />
        <input value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="Experience level" className="rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs" />
        <textarea value={strategy} onChange={(e) => setStrategy(e.target.value)} rows={3} placeholder="Strategy objective" className="rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs" />
        <button type="button" onClick={() => save()} className="w-fit rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-bold text-black">Save profile</button>
        {message && <p className="text-xs text-emerald-300">{message}</p>}
      </div>

      <div className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
        <h2 className="text-sm font-bold text-slate-100">Target companies</h2>
        <p className="mt-1 text-xs text-zinc-500">{companies.length ? companies.join(', ') : 'Add companies on the Target companies page.'}</p>
      </div>

      <div className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-100">Skills</h2>
        <div className="flex gap-2">
          <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Skill" className="flex-1 rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs" />
          <button
            type="button"
            className="rounded-lg bg-[#22c55e] px-3 text-xs font-bold text-black"
            onClick={() => {
              if (!skillName.trim()) return;
              const next = [{ name: skillName.trim(), matchPercent: 50, demand: 'High' }, ...skills];
              setSkills(next);
              setSkillName('');
              save({ skills: next });
            }}
          >
            Add
          </button>
        </div>
        {skills.slice((skillPage - 1) * 4, skillPage * 4).map((skill) => (
          <div key={skill.name} className="flex items-center justify-between text-xs">
            <span>{skill.name}</span>
            <button
              type="button"
              className="text-red-300"
              onClick={() => {
                const next = skills.filter((item) => item.name !== skill.name);
                setSkills(next);
                save({ skills: next });
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <Pagination currentPage={skillPage} totalPages={skillPages} totalItems={skills.length} pageSize={4} onPageChange={setSkillPage} itemLabel="skills" />
      </div>

      <div className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-100">Content angles</h2>
        <div className="flex gap-2">
          <input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="Angle" className="flex-1 rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs" />
          <button
            type="button"
            className="rounded-lg bg-[#22c55e] px-3 text-xs font-bold text-black"
            onClick={() => {
              if (!angle.trim()) return;
              const next = [angle.trim(), ...angles];
              setAngles(next);
              setAngle('');
              save({ angles: next });
            }}
          >
            Add
          </button>
        </div>
        {angles.slice((anglePage - 1) * 4, anglePage * 4).map((item) => (
          <div key={item} className="flex items-center justify-between text-xs">
            <span>{item}</span>
            <button
              type="button"
              className="text-red-300"
              onClick={() => {
                const next = angles.filter((value) => value !== item);
                setAngles(next);
                save({ angles: next });
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <Pagination currentPage={anglePage} totalPages={anglePages} totalItems={angles.length} pageSize={4} onPageChange={setAnglePage} itemLabel="angles" />
      </div>
    </div>
  );
}
