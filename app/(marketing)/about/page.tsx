import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Flower2,
  Mail,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "About | Academia Haru Yo Koi",
  description:
    "Conocé a Sensei Norma Kerwin, fundadora y directora de la Academia de Idioma Japonés Haru Yo Koi.",
};

const titulos = [
  {
    titulo: "Profesora de Lengua, Literatura y Latín",
    institucion: "I.S.F.D. N° 50",
    año: "1998",
  },
  {
    titulo: "Licenciada en Enseñanza de la Lengua y la Comunicación",
    institucion: "Universidad CAECE Buenos Aires",
    año: "2002",
  },
  {
    titulo: "Magíster en Lingüística",
    institucion: "Universidad de Rosario",
    año: "2005",
  },
  {
    titulo: "Profesora de Inglés — First Certificate",
    institucion: "Instituto Collins (Quilmes)",
    año: "1996",
  },
  {
    titulo: "Estudios avanzados de Francés",
    institucion: "Alliance Française (CABA)",
  },
  {
    titulo: "Estudios de Lengua Japonesa",
    institucion: "Centro Nikkei Argentino e Instituto Nichia Gakuin",
  },
  {
    titulo: "JLPT N2",
    año: "2024",
  },
  {
    titulo: "Estudios de Medicina China",
    institucion: "Medicina Biológica Integrativa (CABA)",
    año: "2021",
  },
];

const experiencia = [
  {
    periodo: "27 años",
    rol: "D.G.C. y E.",
    descripcion:
      "Docente de Lengua, Literatura y Comunicación en diversos colegios secundarios del conurbano bonaerense.",
  },
  {
    rol: "Educación terciaria",
    descripcion:
      "Cátedras de Latín, Griego, Lingüística, Literatura Española y EDI.",
  },
  {
    periodo: "2005 – 2023",
    rol: "Directora de colegio secundario",
    descripcion: "Quilmes (18 años).",
  },
  {
    periodo: "1989 – 2003",
    rol: "Instructora de idiomas",
    descripcion:
      "Inglés, español, francés e italiano en el Centro de Estudios Bullrich (Buenos Aires).",
  },
  {
    rol: "Actualidad",
    descripcion:
      "Profesora de japonés en Haru Yo Koi (cursos presenciales y online) y de español para extranjeros.",
    destacado: true,
  },
];

export default function AboutPage() {
  const whatsappUrl =
    "https://wa.me/5491123879647?text=" +
    encodeURIComponent("Hola, me gustaría conocer más sobre la academia.");

  return (
    <div className="bg-[var(--neutral-main)] min-h-screen pb-24">
      {/* Hero — estilo entrada de blog */}
      <section>
        <div className="w-full mx-auto h-[420px] md:h-[500px] overflow-hidden relative shadow-2xl bg-neutral-200">
          <Image
            src="/portada.jpeg"
            alt="Sensei Norma Kerwin en Japón"
            fill
            className="object-cover object-[center_30%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent" />
        </div>
      </section>

      {/* Cabecera — estilo artículo de blog */}
      <section className="pt-20 pb-12 px-6 text-reveal">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <Link
            href="/"
            className="text-[var(--primary-main)] font-bold text-sm flex items-center gap-2 hover:translate-x-[-4px] transition-transform w-fit"
          >
            ← Volver al inicio
          </Link>
          <div className="flex flex-col gap-4">
            <span className="text-[var(--primary-main)] font-bold tracking-widest uppercase text-xs">
              Nuestra fundadora
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-neutral-900 leading-tight">
              Sensei <span className="text-[var(--primary-main)] italic">Norma Kerwin</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-neutral-500 text-sm">
              <span>Academia de Idioma Japonés Haru Yo Koi</span>
              <span>•</span>
              <span>Directora y docente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cuerpo — artículo + sidebar inspirado en el CV */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          {/* Sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[32px] overflow-hidden shadow-lg border border-neutral-100 aspect-[3/4] relative bg-neutral-200">
              <Image
                src="/norma.jpg"
                alt="Retrato de Sensei Norma Kerwin"
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>

            <div className="premium-gradient rounded-[24px] p-6 text-white shadow-lg shadow-primary/20">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
                Actualmente
              </p>
              <p className="text-sm leading-relaxed font-medium">
                Profesora de idioma japonés y español para extranjeros
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3 text-neutral-700">
                <Flower2 className="w-5 h-5 text-[var(--primary-main)] shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Practica Budismo Zen (hace 30 años). Es macrobiótica.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Contacto
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-neutral-700 hover:text-[var(--primary-main)] transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-[var(--primary-main)] shrink-0" />
                <span>
                  (+54) 11 23 87 96 47
                  <span className="block text-xs text-neutral-400 group-hover:text-[var(--primary-main)]/70">
                    WhatsApp
                  </span>
                </span>
              </a>
              <p className="flex items-center gap-3 text-sm text-neutral-700">
                <Mail className="w-5 h-5 text-[var(--primary-main)] shrink-0" />
                <span>aijaponesharuyokoi</span>
              </p>
            </div>
          </aside>

          {/* Contenido principal */}
          <article className="flex flex-col gap-14">
            <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed font-medium border-l-4 border-[var(--primary-main)] pl-6 italic">
              Está a cargo de la Academia de Idioma Japonés Haru Yo Koi, donde
              combina décadas de experiencia docente con su pasión por la cultura
              y el idioma japonés.
            </p>

            {/* Títulos habilitantes */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[var(--primary-main)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">
                  Títulos habilitantes
                </h2>
              </div>
              <ul className="flex flex-col gap-4">
                {titulos.map((item, i) => (
                  <li
                    key={i}
                    className="bg-white rounded-[20px] px-6 py-5 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-neutral-900 leading-snug">
                      {item.titulo}
                    </p>
                    {item.institucion && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {item.institucion}
                        {item.año && (
                          <span className="text-neutral-400"> · {item.año}</span>
                        )}
                      </p>
                    )}
                    {!item.institucion && item.año && (
                      <p className="text-sm text-neutral-400 mt-1">{item.año}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Experiencia laboral */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[var(--primary-main)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">
                  Experiencia laboral
                </h2>
              </div>
              <ul className="flex flex-col gap-4">
                {experiencia.map((item, i) => (
                  <li
                    key={i}
                    className={`rounded-[20px] px-6 py-5 border shadow-sm transition-shadow ${
                      item.destacado
                        ? "bg-[var(--primary-100)]/40 border-[var(--primary-300)]"
                        : "bg-white border-neutral-100 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      {item.periodo && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-main)]">
                          {item.periodo}
                        </span>
                      )}
                      {item.rol && (
                        <span className="font-semibold text-neutral-900">
                          {item.rol}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                      {item.descripcion}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA — coherente con el sitio */}
            <div className="premium-gradient rounded-[32px] p-8 md:p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <p className="text-lg font-serif leading-snug">
                  ¿Querés aprender japonés con la Sensei?
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Link
                    href="/cursos"
                    className="bg-white text-[var(--primary-main)] px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
                  >
                    Ver cursos
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border border-white/40 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold text-sm transition-all"
                  >
                    Escribinos
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
