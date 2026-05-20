import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserRole } from '@/lib/user';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const role = await getUserRole();
    if (role !== 'Directora') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    // If password is blank or empty, delete it from the payload to avoid resetting or overwriting it
    if (body.password === undefined || body.password === null || body.password === '') {
      delete body.password;
    }

    // In Strapi, user update is a flat payload (no 'data' wrapper)
    const res = await fetch(`${STRAPI_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData?.error?.message || 'Error al actualizar alumno' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const role = await getUserRole();
    if (role !== 'Directora') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${STRAPI_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData?.error?.message || 'Error al eliminar alumno' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
