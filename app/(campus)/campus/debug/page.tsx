import { getMe } from '@/lib/user';
import { cookies } from 'next/headers';

export default async function DebugPage() {
  const user = await getMe();
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-red-500">Página de Diagnóstico (Debug)</h1>
      <p>Si estás viendo esto, estás autenticado y el layout carga. Veamos qué dice Strapi:</p>

      <div className="bg-zinc-100 p-4 rounded-xl">
        <h2 className="font-bold mb-2">1. Token JWT en tu navegador:</h2>
        <pre className="text-xs break-all bg-zinc-200 p-2 rounded">{jwt ? jwt : 'NO HAY TOKEN JWT'}</pre>
      </div>

      <div className="bg-zinc-100 p-4 rounded-xl">
        <h2 className="font-bold mb-2">2. Datos devueltos por Strapi (getMe):</h2>
        {user ? (
          <pre className="text-xs overflow-auto bg-zinc-200 p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500 font-bold">Strapi devolvió NULL. Esto significa que Strapi rechazó tu Token o la API local de Strapi falló.</p>
        )}
      </div>
    </div>
  );
}
