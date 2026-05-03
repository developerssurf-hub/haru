'use client';

import { useEffect, useState, useRef } from 'react';
import type { DriveFile, LessonMeta } from '@/lib/google-drive';

// ── Types ─────────────────────────────────────────────────────────────────────

type TabKey = 'grabaciones' | 'guias' | 'audios' | 'tareas';

interface Props {
  leccion: string;
  meta: LessonMeta;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: string | null): string {
  if (!bytes) return '';
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Video player list for Grabaciones */
function GrabacionesList({ files }: { files: DriveFile[] }) {
  const [selected, setSelected] = useState<DriveFile | null>(files[0] ?? null);

  if (files.length === 0) {
    return <EmptyState msg="No hay grabaciones disponibles aún." />;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Player */}
      {selected && (
        <div className="flex-1">
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-md">
            <iframe
              src={`https://drive.google.com/file/d/${selected.id}/preview`}
              allow="autoplay"
              className="w-full h-full"
              title={selected.name}
            />
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-[var(--neutral-900)] text-base">
              {selected.name.replace(/\.[^.]+$/, '')}
            </h3>
            {selected.description && (
              <p className="text-sm text-zinc-500 mt-1">{selected.description}</p>
            )}
            <p className="text-xs text-zinc-400 mt-1" suppressHydrationWarning>{formatDate(selected.modifiedTime)}</p>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="lg:w-72 flex flex-col gap-2 shrink-0">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
          {files.length} grabación{files.length !== 1 ? 'es' : ''}
        </p>
        {files.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(f)}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${selected?.id === f.id
              ? 'bg-primary/10 border border-primary/20'
              : 'bg-zinc-50 hover:bg-zinc-100 border border-transparent'
              }`}
          >
            {/* Thumbnail or icon */}
            <div className="w-12 h-9 rounded-lg bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
              {f.thumbnailLink ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.thumbnailLink} alt="" className="w-full h-full object-cover" />
              ) : (
                <VideoIcon />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`text-sm font-medium truncate ${selected?.id === f.id ? 'text-primary' : 'text-[var(--neutral-900)]'
                  }`}
              >
                {f.name.replace(/\.[^.]+$/, '')}
              </p>
              <p className="text-xs text-zinc-400" suppressHydrationWarning>{formatDate(f.modifiedTime)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** PDF list for Guías */
function GuiasList({ files }: { files: DriveFile[] }) {
  const [selected, setSelected] = useState<DriveFile | null>(files[0] ?? null);

  if (files.length === 0) {
    return <EmptyState msg="No hay guías disponibles aún." />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* PDF viewer */}
      {selected && (
        <div className="flex-1">
          <div className="w-full h-[600px] bg-zinc-100 rounded-2xl overflow-hidden shadow-md border border-zinc-200">
            <iframe
              src={`https://drive.google.com/file/d/${selected.id}/preview`}
              className="w-full h-full"
              title={selected.name}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[var(--neutral-900)] text-base">
                {selected.name.replace(/\.pdf$/i, '')}
              </h3>
              {selected.description && (
                <p className="text-sm text-zinc-500 mt-0.5">{selected.description}</p>
              )}
            </div>
            {selected.webContentLink && (
              <a
                href={selected.webContentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                <DownloadIcon /> Descargar
              </a>
            )}
          </div>
        </div>
      )}

      {/* Sidebar list */}
      <div className="lg:w-64 flex flex-col gap-2 shrink-0">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
          {files.length} guía{files.length !== 1 ? 's' : ''}
        </p>
        {files.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(f)}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${selected?.id === f.id
              ? 'bg-primary/10 border border-primary/20'
              : 'bg-zinc-50 hover:bg-zinc-100 border border-transparent'
              }`}
          >
            <PdfIcon active={selected?.id === f.id} />
            <div className="min-w-0">
              <p
                className={`text-sm font-medium truncate ${selected?.id === f.id ? 'text-primary' : 'text-[var(--neutral-900)]'
                  }`}
              >
                {f.name.replace(/\.pdf$/i, '')}
              </p>
              <p className="text-xs text-zinc-400">{formatBytes(f.size)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Audio player list for Audios */
function AudiosList({ files }: { files: DriveFile[] }) {
  if (files.length === 0) {
    return <EmptyState msg="No hay audios disponibles aún." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        {files.length} audio{files.length !== 1 ? 's' : ''}
      </p>
      {files.map((f) => (
        <div
          key={f.id}
          className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <AudioIcon />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-[var(--neutral-900)] text-sm truncate">
                {f.name.replace(/\.[^.]+$/, '')}
              </h4>
              {f.description && (
                <p className="text-xs text-zinc-500 mt-0.5">{f.description}</p>
              )}
              <p className="text-xs text-zinc-400" suppressHydrationWarning>{formatDate(f.modifiedTime)}</p>
            </div>
          </div>
          {/* Embed Drive audio player */}
          <iframe
            src={`https://drive.google.com/file/d/${f.id}/preview`}
            className="w-full h-14 rounded-xl"
            title={f.name}
            allow="autoplay"
          />
        </div>
      ))}
    </div>
  );
}

/** Tareas upload panel */
function TareasPanel({ leccion }: { leccion: string }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alumno, setAlumno] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = '.pdf,.ppt,.pptx';
  const ACCEPTED_LABEL = 'PDF, PPT o PPTX';

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setErrorMsg('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('leccion', leccion);
    fd.append('alumno', alumno || 'Alumno');

    try {
      const res = await fetch('/api/drive/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido');
      setStatus('success');
      setFile(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al subir');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckIcon />
        </div>
        <h3 className="text-lg font-semibold text-[var(--neutral-900)]">¡Tarea entregada!</h3>
        <p className="text-sm text-zinc-500 text-center max-w-sm">
          Tu archivo fue subido correctamente. El docente lo revisará pronto.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-700)] transition-colors"
        >
          Subir otra entrega
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      <div>
        <label className="block text-sm font-semibold text-[var(--neutral-900)] mb-2">
          Tu nombre (para identificar la entrega)
        </label>
        <input
          type="text"
          value={alumno}
          onChange={(e) => setAlumno(e.target.value)}
          placeholder="Ej: María García"
          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
        />
      </div>

      {/* Drop zone */}
      <div>
        <label className="block text-sm font-semibold text-[var(--neutral-900)] mb-2">
          Archivo ({ACCEPTED_LABEL} · máx. 50 MB)
        </label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors cursor-pointer ${dragging
            ? 'border-primary bg-primary/5'
            : file
              ? 'border-green-400 bg-green-50'
              : 'border-zinc-200 hover:border-primary/40 hover:bg-zinc-50'
            }`}
        >
          {file ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <FileIcon color="#16a34a" />
              </div>
              <p className="text-sm font-semibold text-green-700">{file.name}</p>
              <p className="text-xs text-zinc-400">{formatBytes(String(file.size))}</p>
              <span className="text-xs text-zinc-400 mt-1">Clic para cambiar el archivo</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                <UploadIcon />
              </div>
              <p className="text-sm font-semibold text-[var(--neutral-900)]">
                Arrastrá tu archivo aquí
              </p>
              <p className="text-xs text-zinc-400">o hacé clic para seleccionar</p>
              <p className="text-xs text-zinc-400">{ACCEPTED_LABEL}</p>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={!file || status === 'uploading'}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {status === 'uploading' ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Subiendo…
          </>
        ) : (
          'Entregar tarea'
        )}
      </button>
    </form>
  );
}

/** Empty state helper */
function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
        <span className="text-2xl">📂</span>
      </div>
      <p className="text-sm text-zinc-500">{msg}</p>
    </div>
  );
}

// ── Micro-icons ───────────────────────────────────────────────────────────────

function VideoIcon() {
  return (
    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );
}

function PdfIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-primary/20' : 'bg-red-50'}`}>
      <span className={`text-xs font-bold ${active ? 'text-primary' : 'text-red-500'}`}>PDF</span>
    </div>
  );
}

function AudioIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function FileIcon({ color }: { color: string }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={color}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-48 bg-zinc-100 rounded-2xl" />
      <div className="h-4 bg-zinc-100 rounded w-2/3" />
      <div className="h-4 bg-zinc-100 rounded w-1/2" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'grabaciones', label: 'Grabaciones' },
  { key: 'guias', label: 'Guías' },
  { key: 'audios', label: 'Audios' },
  { key: 'tareas', label: 'Tareas' },
];

export default function LeccionTabs({ leccion, meta }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('grabaciones');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);

  const folderMap: Record<TabKey, string | null> = {
    grabaciones: meta.folderIds.grabaciones,
    guias: meta.folderIds.guias,
    audios: meta.folderIds.audios,
    tareas: meta.folderIds.tareas,
  };

  useEffect(() => {
    if (activeTab === 'tareas') return;
    const folderId = folderMap[activeTab];
    if (!folderId) {
      setFiles([]);
      return;
    }

    setLoading(true);
    fetch(`/api/drive/files/${folderId}`)
      .then((r) => r.json())
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-0 -m-8">
      {/* Tab bar */}
      <div className="bg-white border-b border-zinc-200 px-8 flex gap-1 pt-4 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.key
              ? 'bg-primary text-white shadow-sm'
              : 'text-zinc-600 hover:bg-zinc-100'
              }`}
          >
            {tab.label}
            {tab.key === 'tareas' && (
              <span className="ml-2 text-xs bg-white/20 rounded-full px-1.5 py-0.5">↑</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-8 bg-[var(--neutral-main)] flex-1 min-h-[400px]">
        {activeTab === 'tareas' ? (
          <TareasPanel leccion={leccion} />
        ) : loading ? (
          <Skeleton />
        ) : (
          <>
            {activeTab === 'grabaciones' && <GrabacionesList files={files} />}
            {activeTab === 'guias' && <GuiasList files={files} />}
            {activeTab === 'audios' && <AudiosList files={files} />}
          </>
        )}
      </div>
    </div>
  );
}
