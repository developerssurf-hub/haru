import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';
import Link from 'next/link';

export default async function CursosPage() {
  const resCursos = await fetchStrapi('cursos', 'populate=*');
  const cursosRaw = resCursos?.data || [];
  const cursosAll = Array.isArray(cursosRaw) ? cursosRaw : (cursosRaw ? [cursosRaw] : []);
  
  // Only show active courses
  const cursos = cursosAll.filter((curso: any) => {
    const attributes = curso.attributes || curso;
    return attributes.Activo !== false;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header para la página de cursos */}
      <section className="bg-zinc-50 py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">
            Nuestra Oferta
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-text">
            Cursos Disponibles
          </h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
            Explora nuestros programas diseñados para acompañarte en tu viaje hacia el dominio del idioma y la rica cultura japonesa.
          </p>
        </div>
      </section>

      {/* Grilla de Cursos */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cursos.length > 0 ? (
              cursos.map((curso: any, i: number) => {
                const attributes = curso.attributes || curso;
                const titulo = attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || 'Curso';
                const descripcion = attributes.Descripcion || attributes.descripcion || attributes.description || '';
                const inicio = attributes.Inicio || attributes.inicio || attributes.fecha || '';
                
                const imagenData = attributes.Portada || attributes.Imagen || attributes.imagen || attributes.image || attributes.portada;
                const rawUrl = imagenData?.url || imagenData?.data?.attributes?.url;
                const imagenUrl = rawUrl ? getStrapiMedia(rawUrl) : `/curso${(i % 3) + 1}.png`;

                return (
                  <div
                    key={i}
                    className="group p-8 rounded-[32px] transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-end min-h-[480px] relative overflow-hidden shadow-sm border border-zinc-100 hover:shadow-2xl"
                    style={{ backgroundImage: `url(${imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 premium-gradient opacity-20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-[24px] min-h-[220px] flex flex-col shadow-lg border border-white/20">
                      <h3 className="text-2xl font-serif text-text mb-2">{titulo}</h3>
                      {inicio && (
                        <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg mb-4 self-start tracking-wide uppercase">
                          Inicio: {inicio}
                        </span>
                      )}
                      <p className="text-sm text-text-muted mb-6 flex-grow leading-relaxed line-clamp-2">{descripcion}</p>
                      
                      {/* Botón de acción */}
                      <Link href={`/cursos/${curso.documentId || curso.id || ''}`} className="w-full py-3 rounded-xl border border-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                        Saber más <span>→</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-zinc-50 rounded-[40px] border border-zinc-100">
                <span className="text-6xl mb-6 opacity-50">🌸</span>
                <h3 className="text-2xl font-serif text-text mb-2">No hay cursos publicados aún</h3>
                <p className="text-text-muted">Vuelve pronto para ver nuestras nuevas ofertas académicas.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
