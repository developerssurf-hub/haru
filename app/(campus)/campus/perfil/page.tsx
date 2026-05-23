import { redirect } from 'next/navigation';
import { getMe } from '@/lib/user';
import PerfilClient, { type ProfileUser } from './PerfilClient';

export default async function PerfilPage() {
  const user = await getMe();

  if (!user) {
    redirect('/login');
  }

  const profileUser: ProfileUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    EDAD: user.EDAD ?? null,
    Documento: user.Documento ?? null,
    PROVINCIA: user.PROVINCIA ?? null,
    CELULAR: user.CELULAR ?? null,
    MenorDeEdad: user.MenorDeEdad ?? null,
    MAYORACARGO: user.MAYORACARGO ?? null,
    role: user.role ? { name: user.role.name } : null,
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-text">Mi Perfil</h1>
        <p className="text-text-muted font-medium">
          Actualizá tus datos personales y de contacto.
        </p>
      </div>

      <PerfilClient user={profileUser} />
    </div>
  );
}
