import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/user';
import { cookies } from 'next/headers';
import { fetchStrapi } from '@/lib/strapi';
import MapeoLeccionesClient from './MapeoLeccionesClient';

export const metadata = {
  title: 'Mapeo de Lecciones - Campus Haru',
  description: 'Gestión y emparentamiento de roles de estudiantes con rangos de lecciones de Haru Yo Koi.',
};

export default async function MapeoLeccionesPage() {
  const actualRole = await getUserRole() || 'Alumno';

  if (actualRole !== 'Directora' && actualRole !== 'Profesor') {
    console.warn(`SECURITY: Role "${actualRole}" tried to access /campus/mapeo-lecciones`);
    redirect('/campus');
  }

  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) redirect('/login');

  let mappings: {
    id?: number;
    documentId?: string;
    Rol: string;
    LeccionInicio: number;
    LeccionFin: number;
  }[] = [];
  let isStrapiDown = false;

  try {
    const res = await fetchStrapi("mapeo-lecciones", "populate=*&pagination[limit]=100", jwt);

    if (res && !res.error && (!res.statusCode || res.statusCode < 400)) {
      const rawData: any[] = Array.isArray(res.data)
        ? res.data
        : res.data
        ? [res.data]
        : [];

      mappings = rawData.map((item: any) => {
        // Strapi v5: flat data, no attributes wrapper; v4 keeps attributes
        const attrs = item.attributes || item;
        return {
          id: item.id,
          documentId: item.documentId || String(item.id), // v5 key
          Rol: attrs.Rol ?? attrs.rol ?? '',
          LeccionInicio: Number(attrs.LeccionInicio ?? attrs.leccionInicio ?? attrs.Inicio ?? attrs.inicio ?? 1),
          LeccionFin: Number(attrs.LeccionFin ?? attrs.leccionFin ?? attrs.Fin ?? attrs.fin ?? 50),
        };
      });
    } else {
      console.warn("DEBUG MapeoLeccionesPage: Strapi error or unconfigured:", res);
      isStrapiDown = true;
    }
  } catch (error) {
    console.error("DEBUG MapeoLeccionesPage: fetch failed:", error);
    isStrapiDown = true;
  }

  return (
    <MapeoLeccionesClient
      initialMappings={mappings}
      initialIsStrapiDown={isStrapiDown}
    />
  );
}
