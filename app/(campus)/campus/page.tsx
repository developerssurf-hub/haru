import { getMe, getEffectiveRole } from '@/lib/user';
import { fetchStrapi } from '@/lib/strapi';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const user = await getMe();
  const username = user?.username || 'Estudiante';
  const actualRole = user?.role?.name;
  const roleName = await getEffectiveRole() || 'Alumno';
  const isDirectora = actualRole === 'Directora';

  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  // Obtener datos de la próxima clase desde Strapi
  const resClase = await fetchStrapi('proxima-clases', 'populate=*', jwt);
  const dataClase = resClase?.data;

  // Manejamos tanto si viene un array (Colección) como un objeto único (Single Type)
  const clases = Array.isArray(dataClase) ? dataClase : (dataClase ? [dataClase] : []);

  // Buscamos la clase que corresponde al rol del usuario
  const proximaClase = clases.find((c: any) => {
    const f = c.attributes || c;
    const dirigido = f.Dirigido || f.dirigido || f.Dirigido_a;

    if (!dirigido) return false;

    // Limpieza robusta del string: eliminar tabs, espacios extra y normalizar
    const cleanDirigido = dirigido.replace(/\t/g, '').trim();
    const cleanRole = roleName.trim();

    return cleanDirigido === 'Todos' || cleanDirigido === cleanRole;
  });

  const classFields = proximaClase?.attributes || proximaClase;
  const tituloClase = classFields?.Titulo || classFields?.titulo || classFields?.title || 'Próxima Clase';
  const linkClase = classFields?.Link || classFields?.link || classFields?.url;

  // Obtener eventos (clases extra) desde Strapi
  const resEventos = await fetchStrapi('eventos', 'sort=createdAt:desc&pagination[limit]=5', jwt);
  const eventosRaw = resEventos?.data || [];
  const eventos = Array.isArray(eventosRaw) ? eventosRaw : [eventosRaw];

  // Obtener anuncios y links de interés desde Strapi
  const resAnuncios = await fetchStrapi('anuncios-y-links-de-interes', 'populate=*', jwt);
  const anunciosRaw = resAnuncios?.data || [];
  const anunciosList = Array.isArray(anunciosRaw) ? anunciosRaw : (anunciosRaw ? [anunciosRaw] : []);

  // Filtramos anuncios por rol
  const anuncios = anunciosList.filter((a: any) => {
    const f = a.attributes || a;
    const dirigido = f.Dirigido || f.dirigido;
    if (!dirigido) return false;
    const cleanDirigido = dirigido.replace(/\t/g, '').trim();
    const cleanRole = roleName.trim();
    return cleanDirigido === 'Todos' || cleanDirigido === cleanRole;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif text-text">Okaeri, {username}</h1>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 shadow-sm">
              {roleName}
            </span>
          </div>
          <p className="text-text-muted font-medium">Es un buen día para continuar tu camino en el japonés.</p>
        </div>
        {isDirectora && (
          <a
            href="/campus/nuevo?type=curso"
            className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm shrink-0 mt-2"
          >
            + Añadir Curso Público
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Nivel Actual', value: roleName },
          {
            title: 'Próxima Clase',
            value: proximaClase ? tituloClase : 'Sin programar',
            sub: linkClase ? 'Haz clic para unirte' : (proximaClase ? 'Link no disponible' : 'No hay clases hoy'),
            link: linkClase,
            active: !!linkClase,
            isProxima: true
          },
        ].map((stat, i) => {
          const CardContent = (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 h-full transition-all relative group/card ${stat.link ? 'hover:border-primary/50 hover:shadow-md group cursor-pointer' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.title}</p>
                {stat.isProxima && isDirectora && (
                  <a
                    href="/campus/nuevo?type=clase"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary hover:text-white transition-all opacity-0 group-hover/card:opacity-100"

                  >
                    Editar
                  </a>
                )}
              </div>
              <p className={`text-2xl font-bold text-text ${stat.link ? 'group-hover:text-primary transition-colors' : ''}`}>{stat.value}</p>
              <p className={`text-xs mt-2 font-bold uppercase tracking-wider ${stat.active ? 'text-primary' : 'text-text-muted'}`}>{stat.sub}</p>
            </div>
          );

          if (stat.link) {
            return (
              <a key={i} href={stat.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                {CardContent}
              </a>
            );
          }

          return CardContent;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col gap-6 relative group/section">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif">Anuncios e Interés</h3>
            {isDirectora && (
              <a
                href="/campus/nuevo?type=anuncio"
                className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                + Añadir
              </a>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {anuncios.length > 0 ? (
              anuncios.map((anuncio: any, i: number) => {
                const f = anuncio.attributes || anuncio;
                const titulo = f.Titulo || f.titulo || 'Anuncio';
                const contenido = f.Contenido || f.contenido || '';

                return (
                  <div key={i} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-2 hover:bg-zinc-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <h4 className="font-bold text-text">{titulo}</h4>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {contenido}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-2xl">
                  📢
                </div>
                <p className="text-sm text-text-muted italic">No hay anuncios para tu nivel en este momento.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 relative group/section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif">Talleres adicionales</h3>
            {isDirectora && (
              <a
                href="/campus/nuevo?type=evento"
                className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                + Añadir
              </a>
            )}
          </div>
          <div className="space-y-4">
            {eventos.length > 0 ? (
              eventos.map((event: any, i: number) => {
                const f = event.attributes || event;
                const titulo = f.Titulo || f.titulo || 'Evento';
                const desc = f.DescripcionCorta || f.descripcion || 'Nueva clase extra disponible';
                const dateObj = new Date(f.createdAt);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = dateObj.toLocaleString('es-ES', { month: 'short' }).replace('.', '');

                const tallerHref = `/campus/taller/${encodeURIComponent(titulo)}`;

                return (
                  <a
                    key={i}
                    href={tallerHref}
                    className="flex gap-4 items-center p-4 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-zinc-100"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
                      <span className="text-[10px] font-bold uppercase">{month}</span>
                      <span className="text-sm font-bold">{day}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text line-clamp-1">{titulo}</h4>
                      <p className="text-xs text-text-muted line-clamp-1">{desc}</p>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-text-muted italic">No hay clases extra disponibles por ahora.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
