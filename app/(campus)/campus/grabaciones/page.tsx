import { getMe, getEffectiveRole } from '@/lib/user';
import { getRecordingsForRole } from '@/lib/google-drive';
import { redirect } from 'next/navigation';
import GrabacionesClient from './GrabacionesClient';

export const metadata = {
  title: 'Grabaciones de Clase - Campus Haru',
  description: 'Repasa las grabaciones de las clases en vivo de tu nivel.',
};

export default async function GrabacionesPage() {
  const user = await getMe();
  if (!user) {
    redirect('/login');
  }

  const effectiveRole = await getEffectiveRole();
  const username = user.username || undefined;
  const recordings = await getRecordingsForRole(effectiveRole || undefined, username);

  return (
    <GrabacionesClient 
      recordings={recordings} 
      effectiveRole={effectiveRole || 'Estudiante'} 
    />
  );
}
