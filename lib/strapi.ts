const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapi(endpoint: string, query?: string, token?: string) {
  try {
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ''}`, {
      headers,
      cache: 'no-store',
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

export async function postStrapi(endpoint: string, data: any, token: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error posting to Strapi:', error);
    return null;
  }
}

export async function putStrapi(endpoint: string, id: string | number, data: any, token: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error putting to Strapi:', error);
    return null;
  }
}

export async function uploadStrapi(formData: FormData, token: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error('Error uploading to Strapi:', error);
    return null;
  }
}
