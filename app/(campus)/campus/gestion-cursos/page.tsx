import { redirect } from 'next/navigation';
import { getStrapiMedia, fetchStrapi } from '@/lib/strapi';
import { getUserRole } from '@/lib/user';
import Link from 'next/link';

export default async function GestionCursosPage() {
  const actualRole = await getUserRole() || 'Alumno';

  if (actualRole !== 'Directora') {
    redirect('/campus');
  }

  const resCursos = await fetchStrapi('cursos', 'populate=*');
  const cursosRaw = resCursos?.data || [];
  const cursos = Array.isArray(cursosRaw) ? cursosRaw : (cursosRaw ? [cursosRaw] : []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-[var(--neutral-900)]">
          Gestión de Cursos Públicos
        </h1>
        <Link 
          href="/campus/nuevo?type=curso"
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--primary-700)] transition-colors"
        >
          + Añadir Curso
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Curso</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Estado</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Inicio</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.length > 0 ? (
              cursos.map((curso: any) => {
                const attributes = curso.attributes || curso;
                const docId = curso.documentId || curso.id;
                const nombre = attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || 'Sin nombre';
                const activo = attributes.Activo !== false; // Default to true if null/undefined
                const imagenData = attributes.Portada || attributes.Imagen;
                const rawUrl = imagenData?.url || imagenData?.data?.attributes?.url;
                const imagenUrl = rawUrl ? getStrapiMedia(rawUrl) : null;
                
                return (
                  <tr key={docId} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {imagenUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                            <img src={imagenUrl} alt={nombre} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0 flex items-center justify-center text-zinc-400 text-xs">
                            IMG
                          </div>
                        )}
                        <span className="font-semibold text-sm text-[var(--neutral-900)]">{nombre}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {attributes.Inicio || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/campus/gestion-cursos/${docId}`}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No hay cursos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
