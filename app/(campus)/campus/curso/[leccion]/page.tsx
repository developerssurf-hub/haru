import { getLessonMeta } from '@/lib/google-drive';
import { getMe } from '@/lib/user';
import LeccionTabs from './LeccionTabs';
import Image from 'next/image';

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ leccion: string }>;
}) {
  const { leccion } = await params;
  const user = await getMe();
  const level = user?.role?.name;

  // Fetch lesson metadata from Drive (portada, description, subfolder IDs)
  // Falls back gracefully when Drive is not configured (dev without .env.local)
  let meta;
  try {
    meta = await getLessonMeta(leccion, level);
  } catch {
    meta = {
      leccion,
      description: null,
      portadaId: null,
      portadaLink: null,
      folderIds: { grabaciones: null, guias: null, audios: null, tareas: null },
    };
  }

  const portadaSrc = meta.portadaId
    ? `/api/drive/portada/${meta.portadaId}`
    : '/tokyo-hero.png'; // fallback while Drive isn't configured

  const description =
    meta.description ??
    'Explorá el material de esta lección: grabaciones de clase, guías de estudio, audios de práctica y más.';

  return (
    <div className="flex flex-col gap-2 -mt-8 -mr-8 -ml-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-56 md:h-72 overflow-hidden shrink-0">
        <Image
          src={portadaSrc}
          alt={`Portada de la Lección ${leccion}`}
          fill
          className="object-cover object-center"
          priority
          // portada served via our /api route; skip Next.js optimization
          unoptimized={!!meta.portadaId}
        />
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
          <span className="text-primary-300 text-xs font-semibold uppercase tracking-widest mb-2">
            Lección {leccion}
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-serif font-bold drop-shadow">
            Lección {leccion}
          </h1>
          <p className="text-white/75 text-sm mt-2 max-w-xl leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* ── Tabs + content (client component) ───────────────────────────── */}
      <div className="p-4 overflow-hidden">
        <LeccionTabs leccion={leccion} meta={meta} />
      </div>
    </div>
  );
}
