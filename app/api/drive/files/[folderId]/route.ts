import { NextRequest, NextResponse } from 'next/server';
import { listFiles } from '@/lib/google-drive';

/**
 * GET /api/drive/files/[folderId]
 * Returns the list of files inside a Drive folder.
 * The folderId is the raw Google Drive folder ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  const { folderId } = await params;

  if (!folderId) {
    return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
  }

  if (!process.env.DRIVE_ROOT_FOLDER_ID) {
    return NextResponse.json({ error: 'Drive not configured' }, { status: 503 });
  }

  try {
    const files = await listFiles(folderId);
    return NextResponse.json(files);
  } catch (err) {
    console.error('[drive/files] error:', err);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
