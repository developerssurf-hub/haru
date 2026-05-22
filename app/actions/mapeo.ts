"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getMe } from "@/lib/user";
import { fetchStrapi, postStrapi, putStrapi } from "@/lib/strapi";

// Helper to check if role is authorized (Directora or Profesor only)
async function isAuthorized() {
  const user = await getMe();
  const roleName = user?.role?.name;
  return roleName === 'Directora' || roleName === 'Profesor';
}

// Parse a raw Strapi v5 item (flat data, no attributes wrapper)
// Strapi v5: { id, documentId, Rol, LeccionInicio, LeccionFin, ... }
// Strapi v4: { id, attributes: { Rol, LeccionInicio, LeccionFin, ... } }
function parseMapeoItem(item: any) {
  const attrs = item.attributes || item; // v4 fallback
  return {
    id: item.id,
    documentId: item.documentId || String(item.id), // v5 primary key
    Rol: attrs.Rol ?? attrs.rol ?? '',
    LeccionInicio: Number(attrs.LeccionInicio ?? attrs.leccionInicio ?? attrs.Inicio ?? attrs.inicio ?? 1),
    LeccionFin: Number(attrs.LeccionFin ?? attrs.leccionFin ?? attrs.Fin ?? attrs.fin ?? 50),
  };
}

export async function getMapeosAction() {
  try {
    if (!(await isAuthorized())) {
      return { success: false, error: "No autorizado." };
    }

    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) {
      return { success: false, error: "Sesión no válida o expirada." };
    }

    const res = await fetchStrapi("mapeo-lecciones", "populate=*&pagination[limit]=100", jwt);

    if (!res) {
      return { success: false, error: "No se pudo conectar con Strapi.", isStrapiDown: true };
    }
    if (res.error || (res.statusCode && res.statusCode >= 400)) {
      console.error("DEBUG getMapeosAction: Strapi error:", res);
      return {
        success: false,
        error: res?.error?.message || res?.message || "Error del servidor Strapi.",
        isStrapiDown: true,
      };
    }

    const rawData: any[] = Array.isArray(res.data)
      ? res.data
      : res.data
      ? [res.data]
      : [];

    const mappings = rawData.map(parseMapeoItem);
    return { success: true, data: mappings };
  } catch (error: any) {
    console.error("DEBUG getMapeosAction error:", error);
    return { success: false, error: error.message || "Error al obtener mapeos.", isStrapiDown: true };
  }
}

export async function saveMapeoAction(data: {
  documentId?: string;   // Strapi v5 primary key (string)
  id?: number | string;  // numeric fallback
  Rol: string;
  LeccionInicio: number;
  LeccionFin: number;
}) {
  try {
    if (!(await isAuthorized())) {
      return { success: false, error: "No autorizado." };
    }

    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) {
      return { success: false, error: "Sesión no válida o expirada." };
    }

    const { Rol, LeccionInicio, LeccionFin } = data;

    // Validations
    if (!Rol) return { success: false, error: "El rol es requerido." };
    if (!Number.isInteger(LeccionInicio) || !Number.isInteger(LeccionFin)) {
      return { success: false, error: "Las lecciones deben ser números enteros." };
    }
    if (LeccionInicio < 1 || LeccionInicio > 50 || LeccionFin < 1 || LeccionFin > 50) {
      return { success: false, error: "Las lecciones deben estar entre 1 y 50." };
    }
    if (LeccionInicio > LeccionFin) {
      return { success: false, error: "La lección de inicio no puede ser mayor que la de fin." };
    }

    const payload = { Rol, LeccionInicio, LeccionFin };

    // Resolve the documentId to use for the PUT request
    let targetDocumentId = data.documentId;

    // If we don't have a documentId, search for an existing entry by Rol
    if (!targetDocumentId) {
      const existing = await fetchStrapi(
        "mapeo-lecciones",
        `filters[Rol][$eq]=${encodeURIComponent(Rol)}&pagination[limit]=1`,
        jwt
      );
      const existingItems: any[] = Array.isArray(existing?.data)
        ? existing.data
        : existing?.data
        ? [existing.data]
        : [];

      if (existingItems.length > 0) {
        const parsed = parseMapeoItem(existingItems[0]);
        targetDocumentId = parsed.documentId;
      }
    }

    let result;
    if (targetDocumentId) {
      // Update existing entry using documentId (Strapi v5 requirement)
      result = await putStrapi("mapeo-lecciones", targetDocumentId, payload, jwt);
    } else {
      // Create new entry
      result = await postStrapi("mapeo-lecciones", payload, jwt);
    }

    if (!result) {
      return { success: false, error: "Sin respuesta del servidor.", isStrapiDown: true };
    }
    if (result.error || (result.statusCode && result.statusCode >= 400)) {
      console.error("DEBUG saveMapeoAction Strapi error result:", result);
      return {
        success: false,
        error: result?.error?.message || result?.message || "Error al guardar en Strapi.",
        isStrapiDown: true,
      };
    }

    // Revalidate sidebar and lesson caches
    revalidatePath("/campus");
    revalidatePath("/campus/mapeo-lecciones");

    const saved = result.data ? parseMapeoItem(result.data) : { documentId: targetDocumentId, Rol, LeccionInicio, LeccionFin };
    return { success: true, data: saved };
  } catch (error: any) {
    console.error("DEBUG saveMapeoAction error:", error);
    return { success: false, error: error.message || "Error interno al guardar mapeo.", isStrapiDown: true };
  }
}
