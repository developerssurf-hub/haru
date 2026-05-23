'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarLink from '@/components/campus/SidebarLink';
import RoleSwitcher from '@/components/campus/RoleSwitcher';
import type { AdditionalMaterialItem } from '@/lib/google-drive';
import type { DriveFile } from '@/lib/google-drive';
import { logoutAction } from '@/app/actions/auth';

interface CampusSidebarProps {
  isDirectora: boolean;
  simulatedRole?: string;
  availableRoles: string[];
  actualRole?: string;
  workshopLinks: AdditionalMaterialItem[];
  materialLinks: AdditionalMaterialItem[];
  lecciones: { label: string; href: string }[];
}

const generalLinks = [
  { label: 'Inicio', href: '/campus' },
  { label: 'Patio de Juegos', href: '/patio-de-juegos' },
  { label: 'Mi Perfil', href: '/campus/perfil' },
];

export default function CampusSidebar({
  isDirectora,
  simulatedRole,
  availableRoles,
  actualRole,
  workshopLinks,
  materialLinks,
  lecciones,
}: CampusSidebarProps) {
  const pathname = usePathname();
  const tallerMatch = pathname.match(/^\/campus\/taller\/([^/]+)/);
  const workshopSlug = tallerMatch?.[1] ?? null;
  const workshopName = workshopSlug ? decodeURIComponent(workshopSlug) : null;

  const [workshopFiles, setWorkshopFiles] = useState<DriveFile[]>([]);
  const [loadingWorkshop, setLoadingWorkshop] = useState(false);

  useEffect(() => {
    if (!workshopSlug) {
      setWorkshopFiles([]);
      return;
    }

    let cancelled = false;
    setLoadingWorkshop(true);

    fetch(`/api/drive/taller/${workshopSlug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { files: DriveFile[] }) => {
        if (!cancelled) setWorkshopFiles(data.files ?? []);
      })
      .catch(() => {
        if (!cancelled) setWorkshopFiles([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingWorkshop(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workshopSlug]);

  const isWorkshopMode = Boolean(workshopName);

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <span className="font-serif text-base font-semibold text-[var(--neutral-900)]">
          Campus Haru
        </span>
      </div>

      {isDirectora && (
        <RoleSwitcher
          currentRole={simulatedRole || 'Año I Adultos'}
          availableRoles={availableRoles}
        />
      )}

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-5">
        {isWorkshopMode ? (
          <div className="px-4 flex flex-col gap-4">
            

            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                Material del curso
              </p>
              <p className="text-xs text-zinc-500 px-2 mb-2 line-clamp-2" title={workshopName!}>
                {workshopName}
              </p>
              <div className="flex flex-col gap-0.5">
                {loadingWorkshop ? (
                  <p className="text-xs text-zinc-400 px-2 py-2">Cargando material…</p>
                ) : workshopFiles.length > 0 ? (
                  workshopFiles.map((file) => {
                    const href = `/campus/taller/${workshopSlug}?archivo=${file.id}`;
                    return (
                      <SidebarLink key={file.id} href={href}>
                        {file.name.replace(/\.[^/.]+$/, '')}
                      </SidebarLink>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-400 px-2 py-2 italic">
                    No hay archivos en esta carpeta de Drive.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                General
              </p>
              <div className="flex flex-col gap-0.5">
                {generalLinks.map((item) => (
                  <SidebarLink key={item.label} href={item.href}>
                    {item.label}
                  </SidebarLink>
                ))}
                <SidebarLink href="/campus/grabaciones">Grabaciones de Clase</SidebarLink>
                {(actualRole === 'Directora' || actualRole === 'Profesor') && (
                  <SidebarLink href="/campus/mapeo-lecciones">Mapeo de Lecciones</SidebarLink>
                )}
                {isDirectora && (
                  <>
                    <SidebarLink href="/campus/gestion-cursos">Gestión de Cursos</SidebarLink>
                    <SidebarLink href="/campus/gestion-alumnos">Gestión de Alumnos</SidebarLink>
                  </>
                )}
              </div>
            </div>

            {/*workshopLinks.length > 0 && (
              <div className="px-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                  Talleres adicionales
                </p>
                <div className="flex flex-col gap-0.5">
                  {workshopLinks.map((item) => (
                    <SidebarLink key={item.label} href={item.href}>
                      {item.label}
                    </SidebarLink>
                  ))}
                </div>
              </div>
            )*/}

            {materialLinks.length > 0 && (
              <div className="px-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                  Material para cursada
                </p>
                <div className="flex flex-col gap-0.5">
                  {materialLinks.map((item) => (
                    <SidebarLink
                      key={item.label}
                      href={item.href}
                      target={item.isFolder ? undefined : '_blank'}
                      rel={item.isFolder ? undefined : 'noopener noreferrer'}
                    >
                      {item.label}
                    </SidebarLink>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                Lecciones
              </p>
              <div className="flex flex-col gap-0.5">
                {lecciones.map((item) => (
                  <SidebarLink key={item.label} href={item.href}>
                    {item.label}
                  </SidebarLink>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-100">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-lg font-medium"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
