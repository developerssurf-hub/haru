"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActiveProgramAction } from "@/app/actions/auth";

interface ProgramSwitcherProps {
  currentProgramId: string;
  availablePrograms: { id: string; name: string }[];
  label?: string;
}

export default function ProgramSwitcher({
  currentProgramId,
  availablePrograms,
  label = 'Programa',
}: ProgramSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentProgramId);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelected(newId);
    
    startTransition(async () => {
      await setActiveProgramAction(newId);
      router.refresh();
    });
  };

  if (availablePrograms.length <= 1) return null;

  return (
    <div className="px-6 py-2 bg-zinc-50 border-y border-zinc-100">
      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative group">
        <select
          value={selected}
          onChange={handleChange}
          disabled={isPending}
          className="w-full bg-white border border-zinc-200 text-zinc-700 text-xs rounded-lg focus:ring-primary focus:border-primary block p-2 pr-8 appearance-none cursor-pointer transition-all hover:border-zinc-300 disabled:opacity-50 font-medium"
        >
          {availablePrograms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {isPending && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
           <div className="w-3 h-3 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
