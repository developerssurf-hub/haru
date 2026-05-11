import Image from "next/image";

export default function Home() {
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
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Empezar ahora
              </button>
              <button className="bg-transparent border border-primary/20 hover:border-primary text-primary px-8 py-4 rounded-full font-semibold transition-all hover:bg-primary/5">
                Ver cursos →
              </button>
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

          {[
            { title: "Preparación JLPT", desc: "N5 a N1 con simulacros", Image: "/curso1.png" },
            { title: "Japonés para niños", desc: "Desde los 6 años", Image: "/curso2.png" },
            { title: "Japonés Express", desc: "Viajes y negocios", Image: "/curso3.png" }
          ].map((card, i) => (
            <div
              key={i}
              className="group p-8 rounded-[20px] transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-end min-h-[450px] relative overflow-hidden shadow-sm hover:shadow-xl"
              style={{ backgroundImage: `url(${card.Image})` }}
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
          ))}
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
        <div className="premium-gradient rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">Empieza hoy mismo</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Únete a nuestra comunidad de estudiosos y amantes de la cultura. Inscríbete hoy mismo
              y recibe un kit de bienvenida gratuito que incluye materiales profesionales de caligrafía.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-white text-primary px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl">
                Apply to Academy
              </button>
              <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold transition-all">
                Download Prospectus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
    </div>
  );
}
