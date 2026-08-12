import { getAvailableLessons, getAdditionalMaterial, getCampusWorkshops } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { fetchStrapi } from '@/lib/strapi';
import { checkPendingExams } from '@/lib/api/examenes';
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
  const jwt = cookieStore.get('jwt')?.value;

  const isDirectora = actualRole === 'Directora';

  let hasPendingExams = false;
  if (effectiveRole !== 'Directora' && user?.id && user?.programa?.id) {
    const pName = user?.programa?.nombre || user?.programa?.Nombre;
    hasPendingExams = await checkPendingExams(user.id, user.programa.id, jwt || '', pName);
  }

  // Fetch programas from Strapi for simulation dropdown
  let availableRoles: string[] = [];
  try {
    const programsRes = await fetchStrapi('programas?populate[mapeo_lecciones]=true', '', jwt);
    const programsArray = programsRes?.data || programsRes || [];
    
    if (Array.isArray(programsArray)) {
      availableRoles = programsArray
        .map((p: any) => p.Nombre || p.attributes?.Nombre)
        .filter(Boolean)
        .sort();

      // Always allow the user to switch back to Directora view
      availableRoles.unshift('Directora');
    }
  } catch (error) {
    availableRoles = ['Directora', ...DEFAULT_CAMPUS_ROLES];
  }

  console.log('DEBUG: User detected:', user?.username, 'Actual Role:', actualRole, 'Effective Role:', effectiveRole);
  console.log('DEBUG: User programa:', user?.programa ? user.programa.nombre : 'ninguno (legacy)');

  // Construir la configuración de nivel unificada (programa o rol)
  const levelConfig = buildLevelConfig(user, effectiveRole);
  console.log(`DEBUG: LevelConfig -> nombre='${levelConfig.nombre}' folder='${levelConfig.folder}' rango=[${levelConfig.leccionInicio}-${levelConfig.leccionFin}] source=${levelConfig.source}`);

  let lecciones = await getAvailableLessons(levelConfig);
  const workshopLinks = await getCampusWorkshops();
  const materialLinks = await getAdditionalMaterial(levelConfig);
  console.log('DEBUG: Lessons fetched:', lecciones.length, 'for config:', levelConfig.nombre);

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
          userProgramas={user?.programas || []}
          selectedProgramId={user?.programa?.id?.toString() || ''}
          hasPendingExams={hasPendingExams}
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
