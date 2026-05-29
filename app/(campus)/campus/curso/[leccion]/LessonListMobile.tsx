import { getAvailableLessons } from '@/lib/google-drive';
import { getEffectiveRole } from '@/lib/user';

export default async function LessonListMobile({ leccion }: { leccion: string }) {
  const role = await getEffectiveRole();
  const lecciones = await getAvailableLessons(role);

  return (
    <div className="overflow-x-auto py-3 px-4 md:hidden border-b border-zinc-100 bg-white sticky top-0 z-10 scrollbar-none">
      <div className="flex gap-6 whitespace-nowrap">
        {lecciones.map((l) => {
          const isActive = l.href === `/campus/curso/${leccion}`;
          return (
            <a
              key={l.href}
              href={l.href}
              className={`py-1 text-[15px] font-serif transition-colors shrink-0 ${
                isActive
                  ? 'border-b-2 border-primary text-[var(--neutral-900)] font-bold'
                  : 'text-zinc-500 hover:text-[var(--neutral-900)]'
              }`}
            >
              {l.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

