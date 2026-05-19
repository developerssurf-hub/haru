import { fetchStrapi } from '@/lib/strapi';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function JuegoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  // Fetch del juego específico por ID
  const res = await fetchStrapi(`patio-de-juegos/${id}`, 'populate=*', jwt);
  const data = res?.data;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error al cargar el juego</h2>
        <p className="text-zinc-500 mb-4">No se pudo encontrar el juego con ID: {id}</p>
        <pre className="text-left text-xs bg-zinc-100 p-4 rounded-lg overflow-auto max-w-full">
          {JSON.stringify(res || 'Respuesta nula del servidor', null, 2)}
        </pre>
        <Link href="/patio-de-juegos" className="mt-6 text-primary hover:underline">
          Volver al Patio de Juegos
        </Link>
      </div>
    );
  }

  const attributes = data.attributes || data;
  const titulo = attributes.Titulo || attributes.titulo || attributes.title || attributes.name || 'Juego sin título';
  const descripcion = attributes.Descripcion || attributes.descripcion || attributes.description || '';
  let link = attributes.Enable || attributes.enable || attributes.Link || attributes.link || attributes.url || '';

  // Extraer el src si el texto viene como una etiqueta <iframe ... src="...">
  if (link && link.includes('<iframe')) {
    const srcMatch = link.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      link = srcMatch[1];
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)]">
      {/* Cabecera */}
      <div className="flex items-center gap-4 shrink-0">
        <Link 
          href="/patio-de-juegos"
          className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary hover:shadow-sm transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-serif text-text leading-tight">{titulo}</h1>
          <p className="text-sm text-text-muted">{descripcion}</p>
        </div>
      </div>

      {/* Contenedor del Juego (Iframe) */}
      <div className="flex-grow bg-white rounded-[24px] shadow-sm border border-zinc-100 overflow-hidden relative">
        {link ? (
          <iframe 
            src={link} 
            className="w-full h-full border-none absolute inset-0"
            allow="autoplay; fullscreen; microphone; camera"
            allowFullScreen
            title={titulo}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 text-4xl shadow-sm">
              🔗
            </div>
            <h3 className="text-xl font-serif text-text mb-2">Enlace no disponible</h3>
            <p className="text-text-muted">Este juego no tiene un enlace configurado para ser incrustado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
