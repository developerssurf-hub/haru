import Link from "next/link";

export default function Navbar() {
  const navLinks = [
    { name: "Cursos", href: "/cursos" },
    { name: "Cultura", href: "/cultura" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Logo Haru yo Koi" className="w-10 h-10  group-hover:scale-110" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-text transition-colors group-hover:text-primary">
            Haru yo Koi
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Action */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-white border border-primary/20 px-6 py-2.5 rounded-full text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign In
        </Link>
      </div>
    </nav>
  );
}
