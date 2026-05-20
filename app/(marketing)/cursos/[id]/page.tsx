import Link from "next/link";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function CursoDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const response = await fetchStrapi(`cursos/${id}`, 'populate=*');
  const curso = response?.data;

  if (!curso) {
    notFound();
  }

  const attributes = curso.attributes || curso;
  const nombre = attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || 'Curso';
  const descripcion = attributes.Descripcion || attributes.descripcion || attributes.description || '';
  const inicio = attributes.Inicio || attributes.inicio || attributes.fecha || '';
  const imagenData = attributes.Portada || attributes.Imagen || attributes.imagen || attributes.image || attributes.portada;
  
  const rawUrl = imagenData?.url || imagenData?.data?.attributes?.url;
  const imagenUrl = rawUrl ? getStrapiMedia(rawUrl) : null;

  // WhatsApp link preparation
  const whatsappNumber = "5491123879647"; 
  const messageText = `¡Hola! Me gustaría recibir más información sobre el curso de "${nombre}".`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="bg-zinc-50 min-h-screen pb-24">
      {/* Hero / Cover Section */}
      <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden bg-zinc-900 flex items-end">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={nombre}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-zinc-950/80"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto w-full px-6 pb-12 relative z-10 text-white flex flex-col gap-4">
          <Link 
            href="/cursos" 
            className="inline-flex items-center gap-2 text-zinc-300 font-semibold text-sm hover:text-white hover:-translate-x-1 transition-all mb-4 w-fit"
          >
            ← Volver a Cursos
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-serif leading-tight max-w-4xl text-reveal">
            {nombre}
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Description & Course Detail */}
          <div className="lg:col-span-2 space-y-8 bg-white p-8 md:p-12 rounded-[32px] border border-zinc-100 shadow-sm">
            <div>
              <h2 className="text-2xl font-serif text-text mb-6">Detalles del programa</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-600">
                {descripcion || "No hay una descripción detallada disponible para este curso aún."}
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar info and CTA */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-serif text-text pb-4 border-b border-zinc-100">Información del Curso</h3>
              
              {inicio && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    📅
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fecha de Inicio</p>
                    <p className="font-semibold text-zinc-700">{inicio}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Modalidad</p>
                  <p className="font-semibold text-zinc-700">Online / Vía Zoom con Campus Virtual</p>
                </div>
              </div>

              <div className="pt-4">
                {/* Premium WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <svg className="w-6 h-6 fill-current animate-pulse" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.012 14.077.99 11.52 1.01c-5.433 0-9.856 4.371-9.86 9.8.001 2.03.547 4.01 1.588 5.751L2.2 20.894l4.447-1.74zm12.52-5.41c-.263-.13-1.555-.767-1.797-.854-.242-.088-.417-.13-.592.13-.176.26-.68.854-.833 1.03-.153.174-.307.195-.57.065-.262-.13-1.11-.409-2.113-1.302-.78-.696-1.307-1.555-1.46-1.817-.153-.263-.016-.404.115-.534.117-.117.262-.307.393-.46.13-.153.176-.263.263-.439.088-.176.044-.33-.022-.46-.066-.13-.592-1.424-.812-1.95-.213-.518-.45-.448-.62-.456-.157-.008-.337-.01-.518-.01-.18 0-.476.067-.724.337-.247.27-.945.922-.945 2.248 0 1.325.967 2.607 1.1 2.785.133.177 1.902 2.906 4.607 4.077.643.278 1.144.444 1.536.568.646.205 1.233.176 1.7.107.52-.078 1.555-.634 1.775-1.246.22-.613.22-1.139.154-1.246-.067-.108-.242-.174-.505-.304z"/>
                  </svg>

                

                  Consultar por WhatsApp
                </a>
                <p className="text-center text-xs text-zinc-400 mt-3 font-medium">
                  ¿Tienes dudas? Conversa con nuestra secretaría directamente.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
