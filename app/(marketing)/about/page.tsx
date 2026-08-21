import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Flower2,
  Mail,
  MessageCircle,
} from "lucide-react";
import CallToAction from "@/components/CallToAction";

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







      {/* History Section */}
      <section className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-12">
        <div className="flex flex-col gap-8">
          <h2 className="text-5xl font-serif text-text">Nuestra Historia</h2>
          <div className="w-20 h-1 bg-primary"></div>
          <div className="space-y-6 text-text-muted leading-relaxed">
            <p >
              Siempre nos preguntan por qué nuestra academia se llama Haru Yo Koi (春よ来い – "La primavera vendrá")
            </p>
            <p className="italic font-medium text-text">
              Detrás de este nombre hay una historia de amor y pasión por el idioma japonés.
            </p>
            <p>
              Nuestra fundadora, <b>Sensei Norma Kerwin</b>, encontró su inspiración en el estudio del japonés, un idioma armonioso y espiritual. Sin embargo, la verdadera chispa que dio vida a la academia surgió en el <b>2018</b>, cuando el patinador japonés <b>Yuzuru Hanyu</b> realizó una presentación con la canción <b>Haru Yo Koi</b>, como tributo a su madre. Esta canción, interpretada por Arai Yumi en 1994, representa la espera paciente y la certeza de que, con esfuerzo y dedicación, los sueños pueden hacerse realidad.
            </p>
            <p>Siguiendo este espíritu de constancia y perseverancia, nació nuestra academia. Aquí, cada estudiante encuentra un lugar donde crecer, aprender y descubrir el hermoso idioma japonés, tal como nuestra fundadora encontró en él su ikigai, su razón de ser.</p>
            <p>
              En Haru Yo Koi, creemos que la primavera siempre llega. Solo hay que trabajar con paciencia
              y dedicación para alcanzar nuestras metas. 🌸
            </p>
          </div>
        </div>
        <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl">

          <Image
            src="/norma.jpg"
            alt="History"
            fill
            className="object-cover"
          />
        </div>
      </section>



      <section className="max-w-7xl mx-auto mt-10">
        <CallToAction whatsappUrl={whatsappUrl} />
      </section>



    </div>
  );
}
