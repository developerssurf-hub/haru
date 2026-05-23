import { NextRequest, NextResponse } from 'next/server';
import { getWorkshopFiles } from '@/lib/google-drive';
import { getEffectiveRole, getMe } from '@/lib/user';

/**
 * GET /api/drive/taller/[nombre]
 * Lista archivos del taller (carpeta compartida del campus o del año del usuario).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const { nombre } = await params;
  const workshopName = decodeURIComponent(nombre);

  if (!workshopName) {
    return NextResponse.json({ error: 'Missing workshop name' }, { status: 400 });
  }

  if (!process.env.DRIVE_ROOT_FOLDER_ID) {
    return NextResponse.json({ error: 'Drive not configured' }, { status: 503 });
  }

  const user = await getMe();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = await getEffectiveRole();

  try {
    const files = await getWorkshopFiles(workshopName, role ?? undefined);
    return NextResponse.json({ nombre: workshopName, files });
  } catch (err) {
    console.error('[drive/taller] error:', err);
    return NextResponse.json({ error: 'Failed to list workshop files' }, { status: 500 });
  }
}
