import { getEffectiveRole } from '@/lib/user';
import { getAvailableLessons } from '@/lib/google-drive';
import Link from 'next/link';

export default async function LessonOverview() {
  const role = await getEffectiveRole();
  const lessons = (await getAvailableLessons(role)) ?? [];

  return (
    <div className="pt-8 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary font-serif">Contenido de estudio</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--neutral-900)] mt-1">
          Todas las Lecciones
        </h1>
        <p className="text-zinc-500 text-sm mt-2 max-w-xl">
          Seleccioná una lección para acceder a sus guías, audios de práctica y entregar tus tareas correspondientes.
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center shadow-sm max-w-md mx-auto mt-8">
          <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4 text-3xl">
            📚
          </div>
          <h3 className="font-semibold text-zinc-900 text-lg">No hay lecciones disponibles</h3>
          <p className="text-sm text-zinc-500 mt-2">
            No se encontraron lecciones en tu nivel asignado en este momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {lessons.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative flex flex-col justify-between overflow-hidden bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Decorative top pink line on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div>
                {/* Micro icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>

                <h3 className="font-serif font-bold text-xl text-[var(--neutral-900)] group-hover:text-primary transition-colors duration-300">
                  {l.label}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Acceder al material de estudio
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider">
                <span>Ingresar</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
