import Image from "next/image";
import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';
import Link from 'next/link';
import CallToAction from "@/components/CallToAction";

export default async function Home() {
  const resCursos = await fetchStrapi('cursos', 'populate=*');
  const cursosRaw = resCursos?.data || [];
  const cursosAll = Array.isArray(cursosRaw) ? cursosRaw : (cursosRaw ? [cursosRaw] : []);

  // Only show active courses
  const cursos = cursosAll.filter((curso: any) => {
    const attributes = curso.attributes || curso;
    return attributes.Activo !== false;
  });

  const whatsappUrl =
    "https://wa.me/5491123879647?text=" +
    encodeURIComponent("Hola, me gustaría conocer más sobre la academia.");

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden px-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 text-reveal z-10">
            <div className="flex flex-col gap-2">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                ¡Bienvenidos!
              </span>
              <h1 className="text-6xl md:text-8xl font-serif text-text leading-tight">
                Academia <span className="text-primary italic">Haru Yo Koi</span>
              </h1>
            </div>
            <p className="text-lg text-text-muted leading-relaxed max-w-lg">
              En Academia Haru Yo Koi, creemos que aprender japonés es más que
              solo un idioma: es adentrarse en una cultura rica y fascinante. Nuestra
              academia ofrece un espacio dinámico y amigable donde cada estudiante
              puede aprender de manera sencilla y divertida.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={"/inscripcion"}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Empezar ahora
              </Link>
              <Link
                href={"/cursos"}
                className="bg-transparent border border-primary/20 hover:border-primary text-primary px-8 py-4 rounded-full font-semibold transition-all hover:bg-primary/5">
                Ver cursos →
              </Link>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-[4/5] flex items-center justify-center">
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] rotate-3 -z-10 "></div>
            <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl relative">

              <div className="w-full h-full bg-zinc-200  flex items-center justify-center overflow-hidden">
                <Image
                  src="/portada.jpeg"
                  alt="Academia Haru Yo Koi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Intro Cards Section */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col justify-center gap-4">
            <h2 className="text-4xl font-serif text-text leading-tight">
              Aprender japonés no tiene por que ser <span className="text-primary">tan difícil</span>
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Haru Yo Koi te ayuda a hablar, leer, escuchar y sobre todo aprender en poco tiempo.
            </p>
          </div>

          {cursos.length > 0 ? cursos.map((curso: any, i: number) => {
            const attributes = curso.attributes || curso;
            const titulo = attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || 'Curso';
            const descripcion = attributes.Descripcion || attributes.descripcion || attributes.description || '';
            const inicio = attributes.Inicio || attributes.inicio || attributes.fecha || '';
            const imagenData = attributes.Portada || attributes.Imagen || attributes.imagen || attributes.image || attributes.portada;
            const rawUrl = imagenData?.url || imagenData?.data?.attributes?.url;
            const imagenUrl = rawUrl ? getStrapiMedia(rawUrl) : `/curso${(i % 3) + 1}.png`; // fallback if no image

            return (
              <Link
                href={`/cursos/${curso.documentId || curso.id || ''}`}
                key={i}
                className="group p-8 rounded-[20px] transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-end min-h-[450px] relative overflow-hidden shadow-sm hover:shadow-xl"
                style={{ backgroundImage: `url(${imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 premium-gradient opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 bg-neutral-100 p-5 rounded-[20px] min-h-[220px] flex flex-col">
                  <h3 className="text-2xl font-serif text-text mb-1">{titulo}</h3>
                  {inicio && (
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md mb-3 self-start">
                      Inicio: {inicio}
                    </span>
                  )}
                  <p className="text-sm text-text-muted mb-6 flex-grow line-clamp-2">{descripcion}</p>
                  <div className="w-10 h-10 rounded-full border border-text/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all self-end">
                    →
                  </div>
                </div>
              </Link>
            );
          }) : (
            [
              { title: "Preparación JLPT", desc: "N5 a N1 con simulacros", Image: "/curso1.png" },
              { title: "Japonés para niños", desc: "Desde los 6 años", Image: "/curso2.png" },
              { title: "Japonés Express", desc: "Viajes y negocios", Image: "/curso3.png" }
            ].map((card, i) => (
              <div
                key={i}
                className="group p-8 rounded-[20px] transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-end min-h-[450px] relative overflow-hidden shadow-sm hover:shadow-xl"
                style={{ backgroundImage: `url(${card.Image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 premium-gradient opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 bg-neutral-100 p-4 rounded-[20px] min-h-[200px]">
                  <h3 className="text-2xl font-serif text-text mb-2">{card.title}</h3>
                  <p className="text-sm text-text-muted mb-6">{card.desc}</p>
                  <div className="w-10 h-10 rounded-full border border-text/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    →
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Respaldo section */}

      <section className="my-3 ">
        <div className="text-center">
          <h4 className="text-2xl text-secondary-900 ">
            Contamos con el respaldo de:
          </h4>
          <div className="flex justify-center items-center gap-12 mt-6">
            <Image
              src="/Japanf.png"
              alt="Seidor"
              width={100}
              height={100}
            />
            <Image
              src="/JEES.png"
              alt="Seidor"
              width={100}
              height={100}
            />
            <Image
              src="/Nikkei.png"
              alt="Seidor"
              width={100}
              height={100}
            />
            <Image
              src="/Nichia.png"
              alt="Seidor"
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <CallToAction whatsappUrl={whatsappUrl} />
      </section>


    </div>
  );
}
