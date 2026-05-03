const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function loginStrapi(identifier: string, password: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Error en el inicio de sesión');
    }

    return {
      success: true,
      jwt: data.jwt,
      user: data.user,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Login error:', error);
    return {
      success: false,
      error: message,
    };
  }
}
