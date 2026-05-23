import { getAvailableLessons, getAdditionalMaterial, getCampusWorkshops } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { fetchStrapi } from '@/lib/strapi';
import CampusSidebar from '@/components/campus/CampusSidebar';
import { DEFAULT_CAMPUS_ROLES } from '@/lib/roles';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

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
  const workshopLinks = await getCampusWorkshops();
  const materialLinks = await getAdditionalMaterial(effectiveRole);
  console.log('DEBUG: Lessons fetched:', lecciones.length, 'for role:', effectiveRole);
  console.log('DEBUG: Campus workshops fetched:', workshopLinks.length);
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
  let availableRoles: string[] = DEFAULT_CAMPUS_ROLES;
  
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
      <Suspense fallback={<aside className="w-64 bg-white border-r border-zinc-200 hidden lg:block shrink-0" />}>
        <CampusSidebar
          isDirectora={isDirectora}
          simulatedRole={simulatedRole}
          availableRoles={availableRoles}
          actualRole={actualRole}
          workshopLinks={workshopLinks}
          materialLinks={materialLinks}
          lecciones={lecciones}
        />
      </Suspense>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-sm text-[var(--neutral-700)]">
            Panel del Estudiante
          </h2>
          <a
            href="/campus/perfil"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
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
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
