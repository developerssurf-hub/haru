import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserRole } from '@/lib/user';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET() {
  try {
    const role = await getUserRole();
    if (role !== 'Directora') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData?.error?.message || 'Error al obtener alumnos' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    
    // In Strapi, user creation is a flat payload (no 'data' wrapper)
    const res = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData?.error?.message || 'Error al crear alumno' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
