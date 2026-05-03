import { NextRequest, NextResponse } from 'next/server';
import { getLessonMeta, uploadFile } from '@/lib/google-drive';

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Also allow Word docs in case needed
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

/**
 * POST /api/drive/upload
 * Accepts a multipart/form-data with:
 *   - file: File
 *   - leccion: string  (lesson number, e.g. "1")
 *   - alumno: string   (student name, used to label the file)
 *
 * Uploads the file to the lesson's "Tareas" folder on Drive.
 */
export async function POST(req: NextRequest) {
  if (!process.env.DRIVE_ROOT_FOLDER_ID) {
    return NextResponse.json({ error: 'Drive not configured' }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const leccion = formData.get('leccion') as string | null;
  const alumno = (formData.get('alumno') as string | null) ?? 'Alumno';

  if (!file || !leccion) {
    return NextResponse.json({ error: 'Missing file or leccion' }, { status: 400 });
  }

  // ── Validate file type ────────────────────────────────────────────────────
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Tipo de archivo no permitido. Solo PDF, PPT y PPTX.' },
      { status: 422 }
    );
  }

  // ── Validate file size ────────────────────────────────────────────────────
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'El archivo supera el límite de 50 MB.' },
      { status: 422 }
    );
  }

  // ── Get Tareas folder for this lesson ────────────────────────────────────
  const meta = await getLessonMeta(leccion);
  if (!meta.folderIds.tareas) {
    return NextResponse.json(
      { error: `No se encontró la carpeta Tareas para la Lección ${leccion}.` },
      { status: 404 }
    );
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  const buffer = Buffer.from(await file.arrayBuffer());
  // Prefix filename with alumno + timestamp for easy identification
  const timestamp = new Date().toISOString().slice(0, 10);
  const safeName = file.name.replace(/[^a-zA-Z0-9._\-\s]/g, '_');
  const finalName = `${timestamp}_${alumno}_${safeName}`;

  try {
    const fileId = await uploadFile({
      folderId: meta.folderIds.tareas,
      fileName: finalName,
      mimeType: file.type,
      buffer,
      description: `Tarea subida por ${alumno} — Lección ${leccion}`,
    });

    return NextResponse.json({ success: true, fileId, name: finalName });
  } catch (err) {
    console.error('[drive/upload] error:', err);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
