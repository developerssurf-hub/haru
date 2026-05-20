import { redirect } from 'next/navigation';
import { fetchStrapi } from '@/lib/strapi';
import { getUserRole } from '@/lib/user';
import Link from 'next/link';
import EditForm from './EditForm';

export default async function EditCursoPage({ params }: { params: { id: string } }) {
  const actualRole = await getUserRole() || 'Alumno';

  if (actualRole !== 'Directora') {
    redirect('/campus');
  }

  const res = await fetchStrapi(`cursos/${params.id}`, 'populate=*');
  const curso = res?.data;

  if (!curso) {
    return (
      <div className="p-8 text-center text-zinc-500">
        <p>Curso no encontrado.</p>
        <Link href="/campus/gestion-cursos" className="text-primary hover:underline mt-4 inline-block">
          Volver a Gestión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/campus/gestion-cursos" className="text-zinc-400 hover:text-zinc-600">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold font-serif text-[var(--neutral-900)]">
          Editar Curso
        </h1>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
        <EditForm curso={curso} />
      </div>
    </div>
  );
}
