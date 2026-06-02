import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Obtiene el usuario autenticado con todos los campos relevantes populados:
 * - `role`: rol de Strapi (sistema legacy)
 * - `programa`: relación 1-a-1 con la colección Programas (nuevo sistema)
 *   - `programa.mapeo_lecciones`: rango de lecciones asociado al programa
 */
export async function getMe() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) return null;

  try {
    // populate=* trae role; también populamos el programa y su mapeo de lecciones
    const res = await fetch(
      `${STRAPI_URL}/api/users/me?populate[role]=true&populate[programa][populate][mapeo_lecciones]=true`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    let data = await res.json();

    // Si el rol no vino, lo pedimos explícitamente (compatibilidad con versiones de Strapi)
    if (!data.role && data.id) {
      const userRes = await fetch(
        `${STRAPI_URL}/api/users/${data.id}?populate[role]=true&populate[programa][populate][mapeo_lecciones]=true`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          cache: 'no-store',
        }
      );
      if (userRes.ok) {
        const fullUser = await userRes.json();
        data = { ...data, ...fullUser };
      }
    }

    // Debug: escribe el usuario a un archivo para diagnóstico
    const fs = require('fs');
    fs.writeFileSync('debug_strapi.json', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("DEBUG: Error fetching user me:", error);
    return null;
  }
}

export async function getUserRole() {
  const user = await getMe();
  const roleName = user?.role?.name;
  console.log('DEBUG: Role name extracted:', roleName);
  return roleName || null;
}

export async function getEffectiveRole() {
  const user = await getMe();
  const actualRole = user?.role?.name;

  if (actualRole === 'Directora') {
    const cookieStore = await cookies();
    const simulatedRole = cookieStore.get("simulated_role")?.value;
    return simulatedRole || 'Año I Adultos';
  }

  return actualRole || null;
}

/**
 * Devuelve el programa del usuario autenticado, o null si no tiene ninguno asignado.
 * Convenience helper para cuando solo necesitas el programa sin toda la info del usuario.
 */
export async function getProgramaForUser() {
  const user = await getMe();
  return user?.programa ?? null;
}
