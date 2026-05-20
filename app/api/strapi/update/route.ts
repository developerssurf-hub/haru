import { cookies } from 'next/headers';
import { putStrapi } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, id, data } = body;

    const result = await putStrapi(endpoint, id, data, jwt);

    if (result && result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
