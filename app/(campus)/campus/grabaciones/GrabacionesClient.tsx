'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Search,
  Calendar,
  ArrowUpDown,
  ExternalLink,
  FileVideo,
  Info,
  Clock
} from 'lucide-react';
import { DriveFile } from '@/lib/google-drive';

interface GrabacionesClientProps {
  recordings: DriveFile[];
  effectiveRole: string;
}

export default function GrabacionesClient({ recordings, effectiveRole }: GrabacionesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Helper to format file size
  const formatSize = (sizeStr: string | null) => {
    if (!sizeStr) return 'Desconocido';
    const bytes = parseInt(sizeStr, 10);
    if (isNaN(bytes)) return sizeStr;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper to format time
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' hs';
  };

  // Filter and Sort recordings
  const filteredRecordings = recordings
    .filter(rec =>
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.description && rec.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      const timeA = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
      const timeB = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Container motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Card motion animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 text-reveal mt-10 md:mt-0">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif text-[var(--neutral-900)]">
              Grabaciones de Clase
            </h1>
            <span className="px-2.5 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[var(--primary-300)] shadow-sm">
              {effectiveRole}
            </span>
          </div>
          <p className="text-[var(--neutral-500)] font-medium">
            Accede y repasa los videos de las clases en vivo grabadas para tu grupo.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm w-full">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o palabra clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto text-sm px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--primary-500)] transition-all font-medium text-[var(--neutral-700)] cursor-pointer"
          >
            <option value="newest">Más recientes primero</option>
            <option value="oldest">Más antiguos primero</option>
            <option value="name">Alfabético (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ── Dynamic Content / 3-Column Grid ──────────────────── */}
      <AnimatePresence mode="wait">
        {filteredRecordings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecordings.map((rec) => (
              <motion.div
                key={rec.id}
                variants={cardVariants}
                className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-[var(--primary-300)] shadow-sm hover:shadow-md transition-all group duration-300 flex flex-col justify-between h-full"
              >
                {/* Visual Thumbnail / Icon Header */}
                <div className="p-6 pb-4 flex flex-col gap-4 relative overflow-hidden shrink-0">
                  {/* Decorative background radial circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-100)] rounded-full translate-x-12 -translate-y-12 opacity-50 group-hover:scale-110 transition-transform duration-500 ease-out" />

                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)] shadow-sm group-hover:bg-[var(--primary-700)] group-hover:text-white transition-all duration-300">
                      <FileVideo className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-md">
                      {formatSize(rec.size)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[var(--neutral-900)] leading-snug group-hover:text-[var(--primary-700)] transition-colors line-clamp-2" title={rec.name}>
                      {rec.name}
                    </h3>
                    {rec.description && (
                      <p className="text-xs text-[var(--neutral-500)] mt-1.5 line-clamp-2">
                        {rec.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata & Actions Footer */}
                <div className="p-6 pt-2 flex flex-col gap-4 border-t border-zinc-50 mt-auto">
                  <div className="flex items-center justify-between text-xs text-[var(--neutral-500)] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{formatDate(rec.modifiedTime)}</span>
                    </div>
                    {rec.modifiedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formatTime(rec.modifiedTime)}</span>
                      </div>
                    )}
                  </div>

                  {rec.webViewLink ? (
                    <a
                      href={rec.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--primary-700)] hover:bg-[var(--primary-900)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Reproducir grabación</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 text-zinc-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed">
                      <Info className="w-4 h-4" />
                      <span>Enlace no disponible</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-zinc-100 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-2xl text-[var(--primary-700)] mb-5 shadow-sm">
              🎬
            </div>
            <h3 className="text-xl font-serif font-bold text-[var(--neutral-900)] mb-2">
              No se encontraron grabaciones
            </h3>
            <p className="text-sm text-[var(--neutral-500)] max-w-md leading-relaxed">
              {searchQuery
                ? 'No hay clases grabadas que coincidan con tu búsqueda. Intenta con otros términos.'
                : `Aún no hay videos cargados en la carpeta de "Grabaciones" para tu nivel (${effectiveRole}) en Google Drive.`
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-xs font-bold uppercase tracking-wider text-[var(--primary-700)] bg-[var(--primary-100)] hover:bg-[var(--primary-300)] px-4 py-2 rounded-xl transition-all"
              >
                Limpiar búsqueda
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
