import Link from 'next/link';
import { HomeIcon, PuzzlePieceIcon, BookOpenIcon, PlayIcon, BookmarkIcon } from '@heroicons/react/24/outline';


export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 h-14 flex items-center justify-around z-20 md:hidden">
      <Link href="/campus" className="flex flex-col items-center text-sm text-primary">
        <HomeIcon className="h-6 w-6" />
      </Link>
      <Link href="/patio-de-juegos" className="flex flex-col items-center text-sm text-primary">
        <PuzzlePieceIcon className="h-6 w-6" />
      </Link>
      <Link href="/campus/curso" className="flex flex-col items-center text-sm text-primary">
        <BookOpenIcon className="h-6 w-6" />
      </Link>
      <Link href="/campus/grabaciones" className="flex flex-col items-center text-sm text-primary">
        <PlayIcon className="h-6 w-6" />
      </Link>
      <Link href="/campus/perfil" className="flex flex-col items-center text-sm text-primary">
        <BookmarkIcon className="h-6 w-6" />
      </Link>
    </nav>
  );
}
