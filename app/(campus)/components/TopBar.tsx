import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-2 shadow-sm md:hidden">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">

        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <span className="font-serif text-base font-semibold text-[var(--neutral-900)]">
          Campus Haru
        </span>

      </Link>

      {/* Edit profile button */}
      <Link
        href="/campus/perfil"
        className="text-sm font-medium text-primary hover:underline"
      >
        <UserIcon className="h-6 w-6" />
      </Link>
    </header>
  );
}
