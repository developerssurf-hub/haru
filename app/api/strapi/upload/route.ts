import { cookies } from 'next/headers';
import { uploadStrapi } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const result = await uploadStrapi(formData, jwt);

    // If it's an array and has an id, it was successful
    if (Array.isArray(result) && result[0]?.id) {
      return NextResponse.json(result);
    }
    
    // Check if error is returned
    if (result && result.error) {
       return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
