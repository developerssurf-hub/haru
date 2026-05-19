
import { getMe } from '@/lib/user';
import { redirect } from 'next/navigation';
import CreateForm from './CreateForm';

export default async function NuevoContenidoPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await getMe();
  const actualRole = user?.role?.name;

  if (actualRole !== 'Directora') {
    redirect('/campus');
  }

  const { type } = await searchParams;

  let title = 'Nuevo Contenido';
  let endpoint = '';
  
  if (type === 'clase') {
    title = 'Actualizar Próxima Clase';
    endpoint = 'proxima-clases';
  } else if (type === 'anuncio') {
    title = 'Nuevo Anuncio / Link';
    endpoint = 'anuncios-y-links-de-interes';
  } else if (type === 'evento') {
    title = 'Nueva Clase Extra / Taller';
    endpoint = 'eventos';
  } else if (type === 'juego') {
    title = 'Nuevo Juego';
    endpoint = 'patio-de-juegos';
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">{title}</h1>
        <p className="text-text-muted">Completa los campos para publicar el contenido directamente en el campus.</p>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
        <CreateForm type={type || 'anuncio'} endpoint={endpoint} />
      </div>
    </div>
  );
}
