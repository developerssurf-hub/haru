import { getAvailableLessons, getAdditionalMaterial, getCampusWorkshops } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { fetchStrapi } from '@/lib/strapi';
import CampusSidebar from '@/components/campus/CampusSidebar';
import { DEFAULT_CAMPUS_ROLES, buildLevelConfig } from '@/lib/roles';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';


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
  console.log('DEBUG: User programa:', user?.programa ? user.programa.nombre : 'ninguno (legacy)');

  // Construir la configuración de nivel unificada (programa o rol)
  const levelConfig = buildLevelConfig(user, effectiveRole);
  console.log(`DEBUG: LevelConfig -> nombre='${levelConfig.nombre}' folder='${levelConfig.folder}' rango=[${levelConfig.leccionInicio}-${levelConfig.leccionFin}] source=${levelConfig.source}`);

  let lecciones = await getAvailableLessons(levelConfig);
  const workshopLinks = await getCampusWorkshops();
  const materialLinks = await getAdditionalMaterial(levelConfig);
  console.log('DEBUG: Lessons fetched:', lecciones.length, 'for config:', levelConfig.nombre);

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
        <TopBar />

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto pb-16">
  {children}
</main>
<BottomNav />
      </div>
    </div>
  );
}
