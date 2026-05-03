import { NextRequest, NextResponse } from 'next/server';
import { getLessonMeta } from '@/lib/google-drive';

/**
 * GET /api/drive/leccion/[id]
 * Returns metadata for a lesson: portada URL, description, and subfolder IDs.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!process.env.DRIVE_ROOT_FOLDER_ID) {
    return NextResponse.json({ error: 'Drive not configured' }, { status: 503 });
  }

  try {
    const meta = await getLessonMeta(id);
    return NextResponse.json(meta);
  } catch (err) {
    console.error('[drive/leccion] error:', err);
    return NextResponse.json({ error: 'Failed to load lesson metadata' }, { status: 500 });
  }
}
