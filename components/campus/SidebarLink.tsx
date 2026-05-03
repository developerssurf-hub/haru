'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function SidebarLink({ href, children }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary/8 text-primary font-semibold'
          : 'text-[var(--neutral-700)] hover:bg-zinc-50'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-primary' : 'bg-zinc-300'
        }`}
      />
      {children}
    </Link>
  );
}
