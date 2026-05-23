import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getMe } from '@/lib/user';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const ALLOWED_FIELDS = [
  'username',
  'email',
  'password',
  'EDAD',
  'Documento',
  'PROVINCIA',
  'CELULAR',
  'MenorDeEdad',
  'MAYORACARGO',
] as const;

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getMe();
    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const payload: Record<string, unknown> = {};

    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        payload[key] = body[key];
      }
    }

    if (payload.password === undefined || payload.password === null || payload.password === '') {
      delete payload.password;
    }

    if (payload.EDAD !== undefined) {
      payload.EDAD = payload.EDAD === '' || payload.EDAD === null ? null : Number(payload.EDAD);
    }

    if (payload.MenorDeEdad !== undefined) {
      payload.MenorDeEdad = Boolean(payload.MenorDeEdad);
    }

    const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData?.error?.message || 'Error al actualizar el perfil' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
