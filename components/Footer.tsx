import Link from "next/link";

export default function Footer() {
  const links = [
    { name: "Cursos", href: "/cursos" },
    { name: "Cultura", href: "/cultura" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  return (
    <footer className="bg-footer border-t border-primary/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo Haru yo Koi" className="w-10 h-10  group-hover:scale-110" />
              <span className="font-serif text-xl font-semibold text-text">
                Haru yo Koi
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs">
              © 2024 Academia Haru yo Koi.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
