'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { DriveFile } from '@/lib/google-drive';

interface Props {
  workshopName: string;
  files: DriveFile[];
}

function isPdf(mime: string) {
  return mime === 'application/pdf' || mime.includes('pdf');
}

function isVideo(mime: string) {
  return mime.startsWith('video/');
}

function isImage(mime: string) {
  return mime.startsWith('image/');
}

export default function TallerMaterialView({ workshopName, files }: Props) {
  const searchParams = useSearchParams();
  const archivoId = searchParams.get('archivo');

  const selected = useMemo(() => {
    if (archivoId) {
      return files.find((f) => f.id === archivoId) ?? files[0] ?? null;
    }
    return files[0] ?? null;
  }, [archivoId, files]);

  if (files.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-serif text-text">{workshopName}</h1>
        <div className="bg-white rounded-[24px] border border-zinc-100 p-12 text-center shadow-sm">
          <p className="text-text-muted">
            No encontramos archivos en la carpeta{' '}
            <span className="font-semibold text-text">&quot;{workshopName}&quot;</span> de Google
            Drive. Creá la carpeta en{' '}
            <span className="font-semibold text-text">&quot;Talleres adicionales&quot;</span> (raíz del campus,
            al lado de las carpetas de año) o dentro de tu año, al mismo nivel que{' '}
            <span className="font-semibold text-text">&quot;Lecciones&quot;</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <a
          href="/campus"
          className="text-sm text-primary hover:underline font-medium w-fit"
        >
          ← Volver al campus
        </a>
        <h1 className="text-3xl font-serif text-text">{workshopName}</h1>
        <p className="text-text-muted font-medium">
          Material del curso — elegí un archivo en el menú lateral.
        </p>
      </div>

      {selected && (
        <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
            <h2 className="font-bold text-text truncate">{selected.name}</h2>
            {selected.webViewLink && (
              <a
                href={selected.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-primary shrink-0 hover:underline"
              >
                Abrir en Drive
              </a>
            )}
          </div>

          <div className="p-4">
            {(isPdf(selected.mimeType) || isVideo(selected.mimeType) || isImage(selected.mimeType)) ? (
              <div className="w-full min-h-[480px] bg-zinc-100 rounded-2xl overflow-hidden">
                <iframe
                  src={`https://drive.google.com/file/d/${selected.id}/preview`}
                  className="w-full h-[min(70vh,640px)]"
                  title={selected.name}
                />
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-text-muted mb-4">
                  Vista previa no disponible para este tipo de archivo.
                </p>
                {selected.webViewLink && (
                  <a
                    href={selected.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Ver en Google Drive
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
