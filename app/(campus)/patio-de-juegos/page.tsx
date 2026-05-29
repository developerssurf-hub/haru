import { fetchStrapi } from '@/lib/strapi';
import { cookies } from 'next/headers';
import { getMe, getEffectiveRole } from '@/lib/user';

export default async function PatioDeJuegos() {
  const user = await getMe();
  const actualRole = user?.role?.name;
  const canAdd = actualRole === 'Directora' || actualRole === 'Profesor';
  const roleName = await getEffectiveRole() || 'Alumno';
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  // Fetch patio de juegos
  const res = await fetchStrapi('patio-de-juegos', 'populate=*&pagination[pageSize]=100', jwt);
  const dataRaw = res?.data || [];
  const elementosList = Array.isArray(dataRaw) ? dataRaw : (dataRaw ? [dataRaw] : []);

  // Filtrar si es necesario
  const elementos = elementosList.filter((a: any) => {
    const f = a.attributes || a;
    const dirigido = f.Dirigido || f.dirigido;
    if (!dirigido) return true; // Show all if no target specified
    const cleanDirigido = dirigido.replace(/\t/g, '').trim();
    const cleanRole = roleName.trim();
    return cleanDirigido === 'Todos' || cleanDirigido === cleanRole;
  });

  return (
    <div className="flex flex-col gap-8 mt-10 md:mt-0">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif text-text">Patio de Juegos</h1>
          <p className="text-text-muted font-medium">Explora las actividades y juegos interactivos disponibles.</p>
        </div>
        {canAdd && (
          <a
            href="/campus/nuevo?type=juego"
            className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm shrink-0 mt-2"
          >
            + Añadir Juego
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {elementos.length > 0 ? (
          elementos.map((item: any, i: number) => {
            const f = item.attributes || item;
            const itemId = item.documentId || item.id || i; // fallback to documentId for Strapi v5
            const titulo = f.Titulo || f.titulo || f.title || f.name || 'Juego sin título';
            const descripcion = f.Descripcion || f.descripcion || f.description || '';
            const link = `/patio-de-juegos/${itemId}`;
            const imagenData = f.Imagen || f.imagen || f.image || f.portada;
            const imagenUrl = imagenData?.data?.attributes?.url || null;

            return (
              <a
                key={i}
                href={link}
                className="bg-white rounded-[24px] shadow-sm border border-zinc-100 overflow-hidden hover:shadow-md hover:border-primary/50 transition-all group flex flex-col h-full"
              >
                {imagenUrl ? (
                  <div className="w-full h-48 bg-zinc-100 overflow-hidden shrink-0 relative">
                    <img src={imagenUrl} alt={titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-500">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-primary" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                    <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">🎮</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <h3 className="font-bold text-lg text-text mb-3 group-hover:text-primary transition-colors leading-tight">{titulo}</h3>
                  <p className="text-sm text-text-muted flex-grow line-clamp-3 leading-relaxed">{descripcion}</p>
                </div>
              </a>
            );
          })
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center px-4 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 text-4xl shadow-sm">
              🎮
            </div>
            <h3 className="text-2xl font-serif text-text mb-3">Aún no hay juegos disponibles</h3>
            <p className="text-base text-text-muted max-w-md mx-auto">¡Vuelve pronto! Estamos preparando nuevas actividades interactivas para tu nivel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
