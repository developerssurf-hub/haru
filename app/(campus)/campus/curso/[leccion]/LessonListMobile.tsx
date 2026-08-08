import { getAvailableLessons } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { buildLevelConfig } from '@/lib/roles';

export default async function LessonListMobile({ leccion }: { leccion: string }) {
  const user = await getMe();
  const role = await getEffectiveRole();
  const levelConfig = buildLevelConfig(user, role);
  const lecciones = await getAvailableLessons(levelConfig);

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

