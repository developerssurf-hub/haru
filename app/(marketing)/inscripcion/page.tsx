import { fetchStrapi } from '@/lib/strapi';
import InscripcionForm from '@/components/InscripcionForm';

export const metadata = {
  title: "Inscripción | Academia Haru Yo Koi",
  description: "Inscríbete a nuestros cursos de idioma y cultura japonesa.",
};

export default async function InscripcionPage() {
  const resCursos = await fetchStrapi('cursos', 'populate=*');
  const cursosRaw = resCursos?.data || [];
  const cursosAll = Array.isArray(cursosRaw) ? cursosRaw : (cursosRaw ? [cursosRaw] : []);

  // Solo cursos activos
  const cursos = cursosAll.filter((curso: any) => {
    const attributes = curso.attributes || curso;
    return attributes.Activo !== false;
  });

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <section className="px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          <div className="text-center flex flex-col gap-4">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Sumate a la academia
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-neutral-900 leading-tight">
              Formulario de <span className="text-primary italic">Inscripción</span>
            </h1>
            <p className="text-neutral-500 max-w-lg mx-auto">
              Completá el formulario para iniciar tu proceso de inscripción o hacernos llegar tu consulta. ¡Te responderemos a la brevedad!
            </p>
          </div>

          <InscripcionForm cursos={cursos} />
          
        </div>
      </section>
    </div>
  );
}
