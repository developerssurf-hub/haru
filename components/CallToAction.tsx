import Link from "next/link";


interface CallToActionProps {
  whatsappUrl: string;
}

export default function CallToAction({ whatsappUrl }: CallToActionProps) {
  return (
    <div className="premium-gradient rounded-[32px] p-8 md:p-10 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h2 className="text-4xl md:text-6xl font-serif leading-tight">Empieza hoy mismo</h2>
        <p className="text-lg opacity-90 leading-relaxed max-w-md">
          Únete a nuestra comunidad de estudiosos y amantes de la cultura. Inscríbete hoy mismo

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
  );
}
