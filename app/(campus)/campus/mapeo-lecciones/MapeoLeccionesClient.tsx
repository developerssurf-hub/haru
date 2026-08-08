'use client';

import { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Sliders,
  GraduationCap,
  Info,
  RefreshCw,
  Plus,
  FolderOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProgramaAction, createProgramaAction } from '@/app/actions/mapeo';

interface Programa {
  id?: number | string;
  documentId?: string;
  nombre: string;
  folder: string;
  mapeoLecciones?: {
    id?: number | string;
    documentId?: string;
    LeccionInicio: number;
    LeccionFin: number;
  } | null;
  isLocalOnly?: boolean;
}

interface MapeoLeccionesClientProps {
  initialMappings?: any[];
  programas?: Programa[];
  initialIsStrapiDown: boolean;
}

const LOCAL_STORAGE_KEY = 'haru-programas-local';

export default function MapeoLeccionesClient({
  programas: initialProgramas = [],
  initialIsStrapiDown,
}: MapeoLeccionesClientProps) {
  const [isStrapiDown, setIsStrapiDown] = useState(initialIsStrapiDown);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  // Form para nuevo programa
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProg, setNewProg] = useState({ nombre: '', folder: '', LeccionInicio: 1, LeccionFin: 50 });
  const [newProgState, setNewProgState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newProgError, setNewProgError] = useState('');

  useEffect(() => {
    let activeList = [...initialProgramas];

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Programa[];
        if (parsed && Array.isArray(parsed)) {
          if (isStrapiDown) {
            activeList = parsed;
          } else {
            const localOnly = parsed.filter(m => m.isLocalOnly);
            localOnly.forEach(localM => {
              const idx = activeList.findIndex(m => m.documentId === localM.documentId || m.nombre === localM.nombre);
              if (idx !== -1) {
                activeList[idx] = { ...activeList[idx], ...localM };
              } else {
                activeList.push(localM);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }

    setProgramas(activeList);
  }, [initialProgramas, isStrapiDown]);

  const handleRangeChange = (progId: string | number, field: 'LeccionInicio' | 'LeccionFin' | 'folder', value: any) => {
    setProgramas(prev => prev.map(p => {
      const identifier = p.documentId || p.id || p.nombre;
      if (identifier === progId) {
        let updated = { ...p };
        if (field === 'folder') {
          updated.folder = value;
        } else {
          updated.mapeoLecciones = {
            ...(updated.mapeoLecciones || { LeccionInicio: 1, LeccionFin: 50 }),
            [field]: value
          };
        }
        
        const inicio = updated.mapeoLecciones?.LeccionInicio || 1;
        const fin = updated.mapeoLecciones?.LeccionFin || 50;
        
        if (inicio <= fin) {
          setErrorMessages(errs => ({ ...errs, [String(progId)]: '' }));
        }
        return updated;
      }
      return p;
    }));
    setLoadingStates(prev => ({ ...prev, [String(progId)]: 'idle' }));
  };

  const handleSave = async (prog: Programa) => {
    const identifier = String(prog.documentId || prog.id || prog.nombre);
    const inicio = prog.mapeoLecciones?.LeccionInicio || 1;
    const fin = prog.mapeoLecciones?.LeccionFin || 50;

    if (inicio > fin) {
      setErrorMessages(prev => ({ ...prev, [identifier]: 'La lección de inicio no puede ser mayor que la lección de fin.' }));
      setLoadingStates(prev => ({ ...prev, [identifier]: 'error' }));
      return;
    }

    setLoadingStates(prev => ({ ...prev, [identifier]: 'loading' }));
    setErrorMessages(prev => ({ ...prev, [identifier]: '' }));

    if (isStrapiDown) {
      await new Promise(resolve => setTimeout(resolve, 600));
      saveToLocalStorage(prog);
      setLoadingStates(prev => ({ ...prev, [identifier]: 'success' }));
      setTimeout(() => setLoadingStates(prev => ({ ...prev, [identifier]: 'idle' })), 3000);
      return;
    }

    try {
      const res = await updateProgramaAction({
        documentId: prog.documentId,
        id: prog.id,
        nombre: prog.nombre,
        folder: prog.folder,
        mapeoDocumentId: prog.mapeoLecciones?.documentId,
        LeccionInicio: inicio,
        LeccionFin: fin,
      });

      if (res.success && res.data) {
        setProgramas(prev => prev.map(p => (p.documentId === prog.documentId || p.id === prog.id) ? { ...p, ...res.data, isLocalOnly: false } : p));
        setLoadingStates(prev => ({ ...prev, [identifier]: 'success' }));
        setTimeout(() => setLoadingStates(prev => ({ ...prev, [identifier]: 'idle' })), 3000);
      } else {
        if (res.isStrapiDown) {
          setIsStrapiDown(true);
          saveToLocalStorage(prog);
          setLoadingStates(prev => ({ ...prev, [identifier]: 'success' }));
          setTimeout(() => setLoadingStates(prev => ({ ...prev, [identifier]: 'idle' })), 3000);
        } else {
          setErrorMessages(prev => ({ ...prev, [identifier]: res.error || 'Ocurrió un error al guardar.' }));
          setLoadingStates(prev => ({ ...prev, [identifier]: 'error' }));
        }
      }
    } catch (err: any) {
      setErrorMessages(prev => ({ ...prev, [identifier]: err.message || 'Error de conexión.' }));
      setLoadingStates(prev => ({ ...prev, [identifier]: 'error' }));
    }
  };

  const handleCreatePrograma = async () => {
    if (!newProg.nombre) {
      setNewProgError('El nombre del programa es obligatorio.');
      return;
    }
    if (newProg.LeccionInicio > newProg.LeccionFin) {
      setNewProgError('La lección de inicio no puede ser mayor que la de fin.');
      return;
    }

    setNewProgState('loading');
    setNewProgError('');

    if (isStrapiDown) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newP: Programa = {
        documentId: `local-${Date.now()}`,
        nombre: newProg.nombre,
        folder: newProg.folder,
        mapeoLecciones: { LeccionInicio: newProg.LeccionInicio, LeccionFin: newProg.LeccionFin },
        isLocalOnly: true,
      };
      setProgramas(prev => [...prev, newP]);
      saveToLocalStorage(newP);
      setNewProgState('success');
      setTimeout(() => {
        setNewProgState('idle');
        setShowNewForm(false);
        setNewProg({ nombre: '', folder: '', LeccionInicio: 1, LeccionFin: 50 });
      }, 1500);
      return;
    }

    try {
      const res = await createProgramaAction(newProg);
      if (res.success && res.data) {
        setProgramas(prev => [...prev, res.data]);
        setNewProgState('success');
        setTimeout(() => {
          setNewProgState('idle');
          setShowNewForm(false);
          setNewProg({ nombre: '', folder: '', LeccionInicio: 1, LeccionFin: 50 });
        }, 1500);
      } else {
        if (res.isStrapiDown) {
          setIsStrapiDown(true);
        }
        setNewProgError(res.error || 'Ocurrió un error al crear.');
        setNewProgState('error');
      }
    } catch (err: any) {
      setNewProgError(err.message || 'Error de conexión.');
      setNewProgState('error');
    }
  };

  const saveToLocalStorage = (prog: Programa) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: Programa[] = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(m => m.documentId === prog.documentId || m.nombre === prog.nombre);
      const payload = { ...prog, isLocalOnly: true };

      if (idx !== -1) {
        list[idx] = payload;
      } else {
        list.push(payload);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('¿Estás seguro de que quieres restablecer los datos locales? Esto puede borrar programas simulados.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-md p-8 border border-zinc-200/60 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-pink-50 text-[var(--primary-700)] shadow-sm border border-pink-100">
              <Sliders className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-[var(--neutral-900)]">
              Mapeo de Programas
            </h1>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Crea y gestiona programas académicos. Asigna el rango de lecciones visibles y vincula la carpeta de Google Drive correspondiente a cada programa.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white premium-gradient shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-200"
          >
            {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showNewForm ? 'Cancelar' : 'Nuevo Programa'}
          </button>
          
          <button
            onClick={handleResetDefaults}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-xl transition-all duration-200"
            title="Recargar datos del servidor"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recargar
          </button>
        </div>
      </div>

      {/* ── Strapi Offline Alert ────────────────────────────── */}
      <AnimatePresence>
        {isStrapiDown && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-2xl bg-amber-50/90 backdrop-blur-md border border-amber-200/80 shadow-sm flex items-start gap-4"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">
                Modo de Simulación Activo
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                No logramos comunicarnos con la base de datos. Se ha habilitado el almacenamiento simulado.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create New Form ────────────────────────────── */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-md relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[var(--primary-700)]" />
                Crear Nuevo Programa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Nombre del Programa</label>
                  <input
                    type="text"
                    value={newProg.nombre}
                    onChange={e => setNewProg({ ...newProg, nombre: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-colors"
                    placeholder="Ej. Curso Intensivo 2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Nombre de la Carpeta Drive</label>
                  <input
                    type="text"
                    value={newProg.folder}
                    onChange={e => setNewProg({ ...newProg, folder: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-colors"
                    placeholder="Ej. Lecciones avanzado"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Inicio</label>
                    <input
                      type="number"
                      min="1"
                      value={newProg.LeccionInicio}
                      onChange={e => setNewProg({ ...newProg, LeccionInicio: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-100 focus:border-[var(--primary-700)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Fin</label>
                    <input
                      type="number"
                      min="1"
                      value={newProg.LeccionFin}
                      onChange={e => setNewProg({ ...newProg, LeccionFin: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-100 focus:border-[var(--primary-700)]"
                    />
                  </div>
                </div>
              </div>
              
              {newProgError && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newProgError}</span>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreatePrograma}
                  disabled={newProgState === 'loading'}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    newProgState === 'loading'
                      ? 'bg-zinc-100 text-zinc-500 cursor-wait'
                      : newProgState === 'success'
                        ? 'bg-emerald-500 text-white'
                        : 'premium-gradient text-white hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  {newProgState === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {newProgState === 'success' && <CheckCircle2 className="w-4 h-4 animate-bounce" />}
                  {newProgState === 'idle' && <Save className="w-4 h-4" />}
                  {newProgState === 'loading' ? 'Creando...' : newProgState === 'success' ? '¡Creado!' : 'Guardar Programa'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mappings Cards Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programas.map((prog) => {
          const identifier = String(prog.documentId || prog.id || prog.nombre);
          const errorMsg = errorMessages[identifier];
          const loadState = loadingStates[identifier] || 'idle';

          const inicio = prog.mapeoLecciones?.LeccionInicio || 1;
          const fin = prog.mapeoLecciones?.LeccionFin || 50;
          const isValid = inicio <= fin;

          const trackLeft = ((inicio - 1) / 49) * 100;
          const trackWidth = ((fin - inicio) / 49) * 100;

          return (
            <motion.div
              key={identifier}
              layout
              className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/5 to-purple-500/0 rounded-full blur-xl pointer-events-none"></div>

              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-pink-50 text-[var(--primary-700)]">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-[var(--neutral-900)] tracking-tight">
                        {prog.nombre}
                      </h3>
                    </div>
                    {prog.isLocalOnly && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">
                        <Info className="w-2.5 h-2.5" />
                        Simulado
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" /> Nombre de la Carpeta Drive
                  </label>
                  <input
                    type="text"
                    value={prog.folder || ''}
                    onChange={(e) => handleRangeChange(identifier, 'folder', e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700 focus:ring-2 focus:ring-pink-100"
                    placeholder="Ej. Lecciones avanzado"
                  />
                </div>

                {/* Range Visualizer Track */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                    <span>L-{inicio}</span>
                    <span className="text-zinc-500">Total: {fin - inicio + 1}</span>
                    <span>L-{fin}</span>
                  </div>

                  <div className="relative h-2.5 bg-zinc-100 border border-zinc-200/50 rounded-full overflow-visible">
                    {isValid && (
                      <div
                        className="absolute h-full bg-gradient-to-r from-pink-500 to-[var(--primary-700)] rounded-full transition-all duration-300 shadow-sm"
                        style={{ left: `${trackLeft}%`, width: `${trackWidth}%` }}
                      />
                    )}
                    <div
                      className="absolute w-2.5 h-2.5 bg-white border border-pink-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 shadow-sm z-10"
                      style={{ left: `${trackLeft}%` }}
                    />
                    <div
                      className="absolute w-2.5 h-2.5 bg-white border border-[var(--primary-700)] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 shadow-sm z-10"
                      style={{ left: `${trackLeft + trackWidth}%` }}
                    />
                  </div>
                </div>

                {/* Dropdowns Selector Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Inicio</label>
                    <input
                      type="number"
                      min="1"
                      value={inicio}
                      onChange={(e) => handleRangeChange(identifier, 'LeccionInicio', parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Fin</label>
                    <input
                      type="number"
                      min="1"
                      value={fin}
                      onChange={(e) => handleRangeChange(identifier, 'LeccionFin', parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="leading-snug">{errorMsg}</span>
                  </div>
                )}
                {!isValid && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 p-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>El inicio no puede superar el fin.</span>
                  </div>
                )}

                <button
                  disabled={!isValid || loadState === 'loading'}
                  onClick={() => handleSave(prog)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    !isValid
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200/50'
                    : loadState === 'loading'
                      ? 'bg-zinc-100 text-zinc-500 cursor-wait border border-zinc-200/50'
                      : loadState === 'success'
                        ? 'bg-emerald-500 text-white shadow-sm border border-emerald-500 scale-[0.98]'
                        : loadState === 'error'
                          ? 'bg-red-500 text-white shadow-sm border border-red-500'
                          : 'premium-gradient text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] border border-transparent'
                  }`}
                >
                  {loadState === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loadState === 'success' && <CheckCircle2 className="w-4 h-4 animate-bounce" />}
                  {loadState === 'error' && <AlertCircle className="w-4 h-4" />}
                  {loadState === 'idle' && <Save className="w-4 h-4" />}

                  {loadState === 'loading' && 'Guardando...'}
                  {loadState === 'success' && '¡Programa Guardado!'}
                  {loadState === 'error' && 'Error al Guardar'}
                  {loadState === 'idle' && 'Guardar Cambios'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
