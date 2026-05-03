import { NextResponse } from 'next/server';
import { getDriveClient } from '@/lib/google-drive';

/**
 * GET /api/drive/test
 * Verifica que las credenciales de Drive están correctas.
 * SOLO para uso en desarrollo — eliminar antes de producción.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const checks: Record<string, string> = {};

  // 1. Variables de entorno
  checks.GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    ? `✅ ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
    : '❌ No configurado';

  checks.GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
    ? `✅ ${process.env.GOOGLE_PRIVATE_KEY.slice(0, 40)}…`
    : '❌ No configurado';

  checks.DRIVE_ROOT_FOLDER_ID = process.env.DRIVE_ROOT_FOLDER_ID
    ? `✅ ${process.env.DRIVE_ROOT_FOLDER_ID}`
    : '❌ No configurado';

  // 2. Conexión real con Drive
  try {
    const drive = getDriveClient();
    const res = await drive.files.get({
      fileId: process.env.DRIVE_ROOT_FOLDER_ID!,
      fields: 'id,name,mimeType',
    });

    checks.driveConnection = `✅ Conectado — carpeta encontrada: "${res.data.name}"`;
    checks.folderType = res.data.mimeType === 'application/vnd.google-apps.folder'
      ? '✅ Es una carpeta válida'
      : `⚠️ El ID apunta a: ${res.data.mimeType}`;

    // 3. Listar subcontenido de la carpeta raíz
    const children = await drive.files.list({
      q: `'${process.env.DRIVE_ROOT_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id,name,mimeType)',
      pageSize: 20,
    });

    const items = children.data.files ?? [];
    checks.rootContents = items.length > 0
      ? `✅ ${items.length} elemento(s):\n` + items.map(f =>
          `  • ${f.name} (${f.mimeType === 'application/vnd.google-apps.folder' ? '📁' : '📄'})`
        ).join('\n')
      : '⚠️ La carpeta raíz está vacía (acordate de crear las subcarpetas Leccion-01/, etc.)';

    return NextResponse.json({ ok: true, checks }, { status: 200 });
  } catch (err: unknown) {
    const error = err as { message?: string; code?: number };
    checks.driveConnection = `❌ Error: ${error.message}`;

    if (error.code === 404) {
      checks.hint = 'El DRIVE_ROOT_FOLDER_ID no existe o no fue compartido con la service account';
    } else if (error.message?.includes('invalid_grant') || error.message?.includes('DECODER')) {
      checks.hint = 'El GOOGLE_PRIVATE_KEY tiene formato incorrecto. Asegurate de que los \\n estén dentro de comillas dobles en .env.local';
    } else if (error.message?.includes('accessNotConfigured')) {
      checks.hint = 'La Google Drive API no está habilitada en tu proyecto de Google Cloud';
    }

    return NextResponse.json({ ok: false, checks }, { status: 500 });
  }
}
