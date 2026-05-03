const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapi(endpoint: string, query?: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ''}`, {
      cache: 'no-store', // Desactivamos caché temporalmente para ver cambios reales
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return null;
  }
}

export function getStrapiMedia(url: string | null) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  
  // Nos aseguramos de que no haya dobles barras y que empiece por /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${STRAPI_URL}${cleanUrl}`;
}
