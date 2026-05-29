import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
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
 * Sends the homework file via email directly to the Directoras.
 */
export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Formulario inválido' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const leccion = formData.get('leccion') as string | null;
  const alumno = (formData.get('alumno') as string | null) ?? 'Alumno';
  const comentarios = (formData.get('comentarios') as string | null) ?? '';

  if (!file || !leccion) {
    return NextResponse.json({ error: 'Falta el archivo o la lección' }, { status: 400 });
  }

  // ── Validate file type ────────────────────────────────────────────────────
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Tipo de archivo no permitido. Solo PDF, PPT, PPTX, DOC o DOCX.' },
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

  // ── Get User JWT ──────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  let directorEmails: string[] = [];

  // ── Fetch Directoras from Strapi ──────────────────────────────────────────
  if (jwt) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users)) {
          directorEmails = users
            .filter((u: any) => u.role?.name === 'Directora' && u.email)
            .map((u: any) => u.email);
        }
      }
    } catch (err) {
      console.error('[upload-email] Error fetching directoras from Strapi:', err);
    }
  }

  // Fallback if no directoras found or API call failed
  if (directorEmails.length === 0) {
    const fallback = process.env.DIRECTORA_EMAIL || process.env.SMTP_TO || 'directora@japonesconharuyokoi.com';
    directorEmails = fallback.split(',').map(email => email.trim());
  }

  console.log('[upload-email] Sending homework to directoras:', directorEmails);

  // ── Send Email with Nodemailer ────────────────────────────────────────────
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser || 'campus@japonesconharuyokoi.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('[upload-email] SMTP configuration missing from environment variables.');
    return NextResponse.json(
      { error: 'El servicio de correo no está configurado actualmente.' },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const mailOptions = {
      from: `Campus Haru <${smtpFrom}>`,
      to: directorEmails.join(', '),
      subject: `Nueva Tarea Entregada: Lección ${leccion} - ${alumno}`,
      text: `Hola,\n\nSe ha recibido una nueva entrega de tarea a través del campus:\n\n- Alumno: ${alumno}\n- Lección: ${leccion}\n- Archivo: ${file.name}\n${comentarios ? `- Comentarios: ${comentarios}\n` : ''}\nAdjunto encontrarás el archivo correspondiente.\n\nSaludos,\nCampus Haru yo Koi`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1c1a; max-width: 600px; margin: 0 auto; border: 1px solid #f1f1ee; border-radius: 12px; background-color: #faf9f6;">
          <h2 style="color: #de4b86; border-bottom: 2px solid #ffecf0; padding-bottom: 10px; font-family: Georgia, serif;">Nueva Entrega de Tarea</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #5e5f5d;">Se ha recibido una nueva entrega de tarea a través del campus virtual:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f1ee; width: 120px; color: #1a1c1a;">Alumno:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f1f1ee; color: #1a1c1a;">${alumno}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f1ee; color: #1a1c1a;">Lección:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f1f1ee; color: #1a1c1a;">Lección ${leccion}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f1ee; color: #1a1c1a;">Archivo:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f1f1ee; color: #de4b86; font-family: monospace;">${file.name}</td>
            </tr>
            ${comentarios ? `
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f1ee; color: #1a1c1a; vertical-align: top;">Comentarios:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f1f1ee; color: #1a1c1a; white-space: pre-wrap;">${comentarios}</td>
            </tr>
            ` : ''}
          </table>
          <p style="margin-top: 25px; font-size: 12px; color: #91918e; border-top: 1px solid #f1f1ee; padding-top: 12px;">
            El archivo enviado por el alumno ha sido adjuntado automáticamente a este correo electrónico.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: file.name,
          content: fileBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Tarea enviada por correo con éxito' });
  } catch (err) {
    console.error('[upload-email] Error sending email:', err);
    return NextResponse.json(
      { error: 'Error al enviar la tarea por correo electrónico.' },
      { status: 500 }
    );
  }
}
