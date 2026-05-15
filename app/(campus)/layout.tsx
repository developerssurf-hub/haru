import { getAvailableLessons, getAdditionalMaterial } from '@/lib/google-drive';
import { getMe, getEffectiveRole } from '@/lib/user';
import { logoutAction } from '@/app/actions/auth';
import SidebarLink from '@/components/campus/SidebarLink';
import RoleSwitcher from '@/components/campus/RoleSwitcher';
import { cookies } from 'next/headers';

const generalLinks = [
  { label: 'Inicio', href: '/campus' },
  { label: 'Avisos', href: '/campus/avisos' },
  { label: 'Dudas y consultas', href: '/campus/dudas' },
  { label: 'Links importantes', href: '/campus/links' },
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
  
  const lecciones = await getAvailableLessons(effectiveRole);
  const materialLinks = await getAdditionalMaterial(effectiveRole);
  console.log('DEBUG: Lessons fetched:', lecciones.length, 'for role:', effectiveRole);
  console.log('DEBUG: Additional material fetched:', materialLinks.length);

  const availableRoles = [
    'Año I Adultos', 
    'Año II Adultos', 
    'Año III Adultos', 
    'Año IV Adultos', 
    'Nivel I Niños', 
    'Nivel II Niños',
    'Estudiante', 
    'Profesor'
  ];

  return (
    <div className="min-h-screen bg-[var(--neutral-main)] flex">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center">
            <span className="text-white font-serif text-sm">春</span>
          </div>
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
