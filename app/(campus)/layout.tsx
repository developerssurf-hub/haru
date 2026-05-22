import { getAvailableLessons, getAdditionalMaterial } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { logoutAction } from '@/app/actions/auth';
import { fetchStrapi } from '@/lib/strapi';
import SidebarLink from '@/components/campus/SidebarLink';
import RoleSwitcher from '@/components/campus/RoleSwitcher';
import { cookies } from 'next/headers';

const generalLinks = [
  { label: 'Inicio', href: '/campus' },
  { label: 'Patio de Juegos', href: '/patio-de-juegos' },
];

// Static material links removed in favor of dynamic Google Drive content

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();
  const actualRole = user?.role?.name;
  const effectiveRole = await getEffectiveRole();

  // Logic for Directora simulation UI
  const cookieStore = await cookies();
  const simulatedRole = cookieStore.get('simulated_role')?.value;

  const isDirectora = actualRole === 'Directora';

  console.log('DEBUG: User detected:', user?.username, 'Actual Role:', actualRole, 'Effective Role:', effectiveRole);

  let lecciones = await getAvailableLessons(effectiveRole);
  const materialLinks = await getAdditionalMaterial(effectiveRole);
  console.log('DEBUG: Lessons fetched:', lecciones.length, 'for role:', effectiveRole);
  console.log('DEBUG: Additional material fetched:', materialLinks.length);

  // Para el rol Particulares, el rango de lecciones viene del usuario (no del mapeo por rol)
  if (effectiveRole === 'Particulares' && user) {
    const inicio = Number(user.LeccionInicio ?? user.leccionInicio ?? 1);
    const fin = Number(user.LeccionFin ?? user.leccionFin ?? 50);
    lecciones = lecciones.filter((item) => {
      // Los hrefs tienen formato /campus/curso/N
      const match = item.href.match(/(\d+)$/);
      if (!match) return false;
      const num = Number(match[1]);
      return num >= inicio && num <= fin;
    });
    console.log(`DEBUG: Particulares – rango del usuario [${inicio}, ${fin}], lecciones filtradas: ${lecciones.length}`);
  }

  // Fetch roles from Strapi
  let availableRoles: string[] = [
    'Año I Adultos',
    'Año II Adultos',
    'Año III Adultos',
    'Año IV Adultos',
    'Año V Adultos',
    'Nivel I Niños',
    'Nivel II Niños',
    'Estudiante',
    'Profesor',
  ];
  
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    
    const usersRes = await fetchStrapi('users?pagination[pageSize]=1000&populate=role', '', jwt);
    const usersArray = usersRes?.data || usersRes;
    
    if (Array.isArray(usersArray)) {
      const rolesSet = new Set<string>();
      usersArray.forEach((user: any) => {
        const roleName = user?.role?.name || user?.attributes?.role?.data?.attributes?.name;
        if (roleName) {
          rolesSet.add(roleName);
        }
      });
      const uniqueRoles = Array.from(rolesSet).filter((name: string) => name && !['Public', 'Authenticated'].includes(name));
      if (uniqueRoles.length > 0) {
        availableRoles = uniqueRoles.sort();
      }
    }
  } catch (error) {
    // Fallback silencioso a los roles por defecto
  }

  return (
    <div className="min-h-screen bg-[var(--neutral-main)] flex">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <img src="/logo.png" alt="Logo" className='w-10 h-10' />
          <span className="font-serif text-base font-semibold text-[var(--neutral-900)]">
            Campus Haru
          </span>
        </div>

        {/* Role Switcher for Directora */}
        {isDirectora && (
          <RoleSwitcher
            currentRole={simulatedRole || 'Año I Adultos'}
            availableRoles={availableRoles}
          />
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-5">
          {/* General */}
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
              <SidebarLink href="/campus/grabaciones">
                Grabaciones de Clase
              </SidebarLink>
              {(actualRole === 'Directora' || actualRole === 'Profesor') && (
                <SidebarLink href="/campus/mapeo-lecciones">
                  Mapeo de Lecciones
                </SidebarLink>
              )}
              {isDirectora && (
                <>
                  <SidebarLink href="/campus/gestion-cursos">
                    Gestión de Cursos
                  </SidebarLink>
                  <SidebarLink href="/campus/gestion-alumnos">
                    Gestión de Alumnos
                  </SidebarLink>
                </>
              )}
            </div>
          </div>

          {/* Material */}
          {materialLinks.length > 0 && (
            <div className="px-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                Material para cursada
              </p>
              <div className="flex flex-col gap-0.5">
                {materialLinks.map((item) => (
                  <SidebarLink key={item.label} href={item.href} target="_blank">
                    {item.label}
                  </SidebarLink>
                ))}
              </div>
            </div>
          )}

          {/* Lecciones */}
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
        </nav>

        {/* Bottom actions */}
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

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-sm text-[var(--neutral-700)]">
            Panel del Estudiante
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.username?.[0] || 'E'}
            </div>
            <div className="flex flex-col -gap-1 hidden sm:flex">
              <span className="text-sm font-bold text-[var(--neutral-900)] leading-tight">
                {user?.username || 'Estudiante'}
              </span>
              <span className="text-[10px] font-medium text-primary uppercase tracking-tighter">
                {isDirectora && simulatedRole ? `${actualRole} (como ${simulatedRole})` : (actualRole || 'Alumno')}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
