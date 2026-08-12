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

    if (!res.ok) {
      console.log(`DEBUG: getMe failed. Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`DEBUG: getMe error response:`, text);
      return null;
    }

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

    // --- SUPPORT FOR MULTIPLE PROGRAMS ---
    let allPrograms: any[] = [];
    if (data.programa) {
      if (Array.isArray(data.programa)) {
        allPrograms = data.programa;
      } else if (data.programa.data && Array.isArray(data.programa.data)) {
        allPrograms = data.programa.data;
      } else {
        allPrograms = [data.programa];
      }
    }
    
    // Normalize nested attributes for each program
    allPrograms = allPrograms.map(p => {
       let normalized = p;
       if (p.attributes) {
          normalized = { id: p.id, ...p.attributes };
       }
       // Strapi fields might be capitalized, map them to lowercase for consistency
       if (normalized.Nombre && !normalized.nombre) {
          normalized.nombre = normalized.Nombre;
       }
       if (normalized.Folder && !normalized.folder) {
          normalized.folder = normalized.Folder;
       }
       return normalized;
    });

    // Remove duplicates (Strapi sometimes returns duplicates in manyToMany relations)
    const uniqueProgramsMap = new Map();
    allPrograms.forEach(p => {
      const uniqueKey = p.documentId || p.id;
      if (uniqueKey && !uniqueProgramsMap.has(uniqueKey)) {
        uniqueProgramsMap.set(uniqueKey, p);
      }
    });
    allPrograms = Array.from(uniqueProgramsMap.values());

    data.programas = allPrograms;

    // Pick the active program from cookie
    const activeProgramId = cookieStore.get("selected_program_id")?.value;
    if (activeProgramId && allPrograms.length > 0) {
      const matched = allPrograms.find(p => p.id?.toString() === activeProgramId);
      data.programa = matched || allPrograms[0];
    } else if (allPrograms.length > 0) {
      data.programa = allPrograms[0];
    } else {
      data.programa = null;
    }
    // -------------------------------------

    // Debug: escribe el usuario a un archivo para diagnóstico
    const fs = require('fs');
    fs.writeFileSync('debug_strapi.json', JSON.stringify(data, null, 2));

    // Si es Directora y está simulando, inyectamos el programa
    const simulatedRole = cookieStore.get("simulated_role")?.value;
    if (data?.role?.name === 'Directora' && simulatedRole && simulatedRole !== 'Directora') {
      try {
        const programsRes = await fetch(
          `${STRAPI_URL}/api/programas?populate[mapeo_lecciones]=true`,
          { headers: { Authorization: `Bearer ${jwt}` }, cache: 'no-store' }
        );
        if (programsRes.ok) {
          const programsData = await programsRes.json();
          const programsArray = programsData?.data || programsData || [];
          const simulatedProgram = programsArray.find(
            (p: any) => (p.Nombre || p.attributes?.Nombre) === simulatedRole
          );
          if (simulatedProgram) {
            const rawMapeo = simulatedProgram.mapeo_lecciones || simulatedProgram.attributes?.mapeo_lecciones;
            const mappedMapeo = rawMapeo?.data?.attributes || rawMapeo;
            
            data.programa = {
              id: simulatedProgram.id,
              nombre: simulatedProgram.Nombre || simulatedProgram.attributes?.Nombre,
              folder: simulatedProgram.Folder || simulatedProgram.attributes?.Folder || simulatedProgram.folder || simulatedProgram.attributes?.folder,
              Folder: simulatedProgram.Folder || simulatedProgram.attributes?.Folder,
              mapeo_lecciones: mappedMapeo
            };
            data.programas = [data.programa];
          }
        }
      } catch (err) {
        console.error("DEBUG: Failed to inject simulated program", err);
      }
    }

    console.log("DEBUG: getMe SUCCESS. User id:", data.id);
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
    return simulatedRole || 'Directora';
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
