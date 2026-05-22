const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapi(endpoint: string, query?: string, token?: string) {
  try {
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      headers,
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('fetchStrapi error HTTP ' + res.status + ':', url, data);
    }
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
    const json = await res.json();
    if (!res.ok) {
      console.error(`postStrapi ${endpoint} returned ${res.status}:`, json);
    }
    return json;
  } catch (error) {
    console.error('Error posting to Strapi:', error);
    return null;
  }
}

// Note: Strapi v5 uses documentId (string) as the primary update/delete key.
// Pass documentId when available, numeric id is kept for backward compat.
export async function putStrapi(endpoint: string, documentId: string | number, data: any, token: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}/${documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error(`putStrapi ${endpoint}/${documentId} returned ${res.status}:`, json);
    }
    return json;
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
