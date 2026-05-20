import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/user';
import { cookies } from 'next/headers';
import GestionAlumnosClient from './GestionAlumnosClient';

export default async function GestionAlumnosPage() {
  const actualRole = await getUserRole() || 'Alumno';
  
  if (actualRole !== 'Directora') {
    redirect('/campus');
  }

  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) {
    redirect('/login');
  }

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Fetch users with role populated
  let users = [];
  try {
    const res = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      users = await res.json();
    } else {
      console.error('Failed to fetch users:', res.statusText);
    }
  } catch (error) {
    console.error('Error fetching users on server:', error);
  }

  // Fetch roles list
  let roles = [];
  try {
    const res = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      roles = data?.roles || [];
    } else {
      console.error('Failed to fetch roles:', res.statusText);
    }
  } catch (error) {
    console.error('Error fetching roles on server:', error);
  }

  return (
    <GestionAlumnosClient initialUsers={users} initialRoles={roles} />
  );
}
