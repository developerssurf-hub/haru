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
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveMapeoAction } from '@/app/actions/mapeo';

interface StrapiMapping {
  id?: number | string;
  Rol: string;
  LeccionInicio: number;
  LeccionFin: number;
  isLocalOnly?: boolean;
}

interface MapeoLeccionesClientProps {
  initialMappings: StrapiMapping[];
  initialIsStrapiDown: boolean;
}

const ACADEMIC_ROLES = [
  { name: 'Año I Adultos', label: 'Año I Adultos', category: 'Adultos', defaultInicio: 1, defaultFin: 10 },
  { name: 'Año II Adultos', label: 'Año II Adultos', category: 'Adultos', defaultInicio: 11, defaultFin: 20 },
  { name: 'Año III Adultos', label: 'Año III Adultos', category: 'Adultos', defaultInicio: 21, defaultFin: 30 },
  { name: 'Año IV Adultos', label: 'Año IV Adultos', category: 'Adultos', defaultInicio: 31, defaultFin: 40 },
  { name: 'Año V Adultos', label: 'Año V Adultos', category: 'Adultos', defaultInicio: 41, defaultFin: 50 },
  { name: 'Nivel I Niños', label: 'Nivel I Niños', category: 'Niños', defaultInicio: 1, defaultFin: 25 },
  { name: 'niños 1 er nivel ( junio)', label: 'Nivel I Niños (Junio)', category: 'Niños', defaultInicio: 1, defaultFin: 25 },
  { name: 'Nivel II Niños', label: 'Nivel II Niños', category: 'Niños', defaultInicio: 26, defaultFin: 50 },
  { name: 'Particulares', label: 'Particulares (Individual)', category: 'Particulares', defaultInicio: 1, defaultFin: 50 },
  { name: 'Curso introductorio', label: 'Curso introductorio', category: 'Introductorio', defaultInicio: 1, defaultFin: 50 },
  { name: 'Alumno', label: 'Alumno (General)', category: 'General', defaultInicio: 1, defaultFin: 50 },
];

const LOCAL_STORAGE_KEY = 'haru-mapeo-lecciones-local';

export default function MapeoLeccionesClient({
  initialMappings,
  initialIsStrapiDown,
}: MapeoLeccionesClientProps) {
  const [isStrapiDown, setIsStrapiDown] = useState(initialIsStrapiDown);
  const [mappings, setMappings] = useState<StrapiMapping[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  // Compile active mappings, prioritizing: Local Storage (if Strapi is down) > Server Mappings > Standard Fallbacks
  useEffect(() => {
    let activeMappings = [...initialMappings];

    // Attempt to load from Local Storage if Strapi is down or for robust local override testing
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StrapiMapping[];
        if (parsed && Array.isArray(parsed)) {
          if (isStrapiDown) {
            // If Strapi is down, use all local storage configs
            activeMappings = parsed;
          } else {
            // If Strapi is active, merge in local overrides only if they have isLocalOnly flag
            const localOnly = parsed.filter(m => m.isLocalOnly);
            localOnly.forEach(localM => {
              const idx = activeMappings.findIndex(m => m.Rol === localM.Rol);
              if (idx !== -1) {
                activeMappings[idx] = { ...activeMappings[idx], ...localM };
              } else {
                activeMappings.push(localM);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }

    // Ensure EVERY academic role from ACADEMIC_ROLES is mapped
    const finalMappings = ACADEMIC_ROLES.map(role => {
      const existing = activeMappings.find(m => m.Rol === role.name);
      return {
        id: existing?.id,
        Rol: role.name,
        LeccionInicio: existing?.LeccionInicio ?? role.defaultInicio,
        LeccionFin: existing?.LeccionFin ?? role.defaultFin,
        isLocalOnly: existing?.isLocalOnly ?? isStrapiDown,
      };
    });

    setMappings(finalMappings);
  }, [initialMappings, isStrapiDown]);

  // Handle select range change
  const handleRangeChange = (roleName: string, field: 'LeccionInicio' | 'LeccionFin', value: number) => {
    setMappings(prev => prev.map(m => {
      if (m.Rol === roleName) {
        const updated = { ...m, [field]: value };
        // Reset error message for this card if it becomes valid
        if (field === 'LeccionInicio' && value <= m.LeccionFin) {
          setErrorMessages(errs => ({ ...errs, [roleName]: '' }));
        } else if (field === 'LeccionFin' && m.LeccionInicio <= value) {
          setErrorMessages(errs => ({ ...errs, [roleName]: '' }));
        }
        return updated;
      }
      return m;
    }));

    // Reset status on change
    setLoadingStates(prev => ({ ...prev, [roleName]: 'idle' }));
  };

  // Save specific role configuration
  const handleSave = async (roleName: string) => {
    const mapping = mappings.find(m => m.Rol === roleName);
    if (!mapping) return;

    // Client-side validations
    if (mapping.LeccionInicio > mapping.LeccionFin) {
      setErrorMessages(prev => ({
        ...prev,
        [roleName]: 'La lección de inicio no puede ser mayor que la lección de fin.'
      }));
      setLoadingStates(prev => ({ ...prev, [roleName]: 'error' }));
      return;
    }

    setLoadingStates(prev => ({ ...prev, [roleName]: 'loading' }));
    setErrorMessages(prev => ({ ...prev, [roleName]: '' }));

    // Simulation Flow
    if (isStrapiDown) {
      // Artificially wait to simulate premium server actions
      await new Promise(resolve => setTimeout(resolve, 600));
      saveToLocalStorage(mapping);
      setLoadingStates(prev => ({ ...prev, [roleName]: 'success' }));
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [roleName]: 'idle' }));
      }, 3000);
      return;
    }

    // Real Server Action Flow
    try {
      const res = await saveMapeoAction({
        id: mapping.id,
        Rol: mapping.Rol,
        LeccionInicio: mapping.LeccionInicio,
        LeccionFin: mapping.LeccionFin
      });

      if (res.success && res.data) {
        // Update local state ID in case it was newly created
        setMappings(prev => prev.map(m => {
          if (m.Rol === roleName) {
            return {
              ...m,
              id: res.data?.id,
              isLocalOnly: false
            };
          }
          return m;
        }));
        setLoadingStates(prev => ({ ...prev, [roleName]: 'success' }));
        setTimeout(() => {
          setLoadingStates(prev => ({ ...prev, [roleName]: 'idle' }));
        }, 3000);
      } else {
        // Check if database was offline
        if (res.isStrapiDown) {
          setIsStrapiDown(true);
          saveToLocalStorage(mapping);
          setLoadingStates(prev => ({ ...prev, [roleName]: 'success' }));
          setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, [roleName]: 'idle' }));
          }, 3000);
        } else {
          setErrorMessages(prev => ({
            ...prev,
            [roleName]: res.error || 'Ocurrió un error al guardar.'
          }));
          setLoadingStates(prev => ({ ...prev, [roleName]: 'error' }));
        }
      }
    } catch (err: any) {
      console.error('Save action error:', err);
      setErrorMessages(prev => ({
        ...prev,
        [roleName]: err.message || 'Error de conexión.'
      }));
      setLoadingStates(prev => ({ ...prev, [roleName]: 'error' }));
    }
  };

  // Helper to persist to Local Storage during Strapi downtime
  const saveToLocalStorage = (updatedMapping: StrapiMapping) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: StrapiMapping[] = [];
      if (stored) {
        list = JSON.parse(stored) as StrapiMapping[];
      }

      const idx = list.findIndex(m => m.Rol === updatedMapping.Rol);
      const payload = { ...updatedMapping, isLocalOnly: true };

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

  // Force local storage clear to reset to defaults
  const handleResetDefaults = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los mapeos locales a los valores estándar de Haru?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (isStrapiDown) {
        // If strapi is down, just rebuild the state
        const resetMappings = ACADEMIC_ROLES.map(role => ({
          Rol: role.name,
          LeccionInicio: role.defaultInicio,
          LeccionFin: role.defaultFin,
          isLocalOnly: true,
        }));
        setMappings(resetMappings);
      } else {
        // If strapi is active, reload page to fetch fresh server maps
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-md p-8 border border-zinc-200/60 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-pink-50 text-[var(--primary-700)] shadow-sm border border-pink-100">
              <Sliders className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-[var(--neutral-900)]">
              Mapeo de Lecciones por Rol
            </h1>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Relaciona cada uno de los roles académicos con el rango correspondiente de lecciones (de la 1 a la 50) para modularizar el contenido en el panel de lecciones del alumno.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-xl transition-all duration-200"
          title="Restaurar a los rangos por defecto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restablecer Valores
        </button>
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
                No logramos comunicarnos con la base de datos de Strapi (el servidor devolvió un error).
                Para que puedas seguir probando los cambios sin interrupciones, <strong>se ha habilitado el almacenamiento simulado en tu navegador</strong>.
                Las modificaciones que guardes se aplicarán de inmediato y persistirán en esta sesión.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mappings Cards Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mappings.map((mapping) => {
          const roleMeta = ACADEMIC_ROLES.find(r => r.name === mapping.Rol);
          const category = roleMeta?.category || 'General';
          const errorMsg = errorMessages[mapping.Rol];
          const loadState = loadingStates[mapping.Rol] || 'idle';

          const inicio = mapping.LeccionInicio;
          const fin = mapping.LeccionFin;
          const isValid = inicio <= fin;

          // Track calculation percentages (1 to 50 maps to 0% to 100%)
          const trackLeft = ((inicio - 1) / 49) * 100;
          const trackWidth = ((fin - inicio) / 49) * 100;

          // Category Badge Colors
          const badgeStyles: Record<string, string> = {
            Adultos: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            Niños: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            General: 'bg-zinc-50 text-zinc-700 border-zinc-100',
          };

          return (
            <motion.div
              key={mapping.Rol}
              layout
              className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative Glow inside cards */}
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
                        {roleMeta?.label || mapping.Rol}
                      </h3>
                    </div>
                    {mapping.isLocalOnly && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">
                        <Info className="w-2.5 h-2.5" />
                        Simulado
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${badgeStyles[category] || badgeStyles.General}`}>
                    {category}
                  </span>
                </div>

                {/* Range Visualizer Track */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                    <span>Lección {inicio}</span>
                    <span className="text-zinc-500">Mapeadas: {fin - inicio + 1}</span>
                    <span>Lección {fin}</span>
                  </div>

                  <div className="relative h-2.5 bg-zinc-100 border border-zinc-200/50 rounded-full overflow-visible">
                    {/* Active Track Highlight */}
                    {isValid && (
                      <div
                        className="absolute h-full bg-gradient-to-r from-pink-500 to-[var(--primary-700)] rounded-full transition-all duration-300 shadow-sm"
                        style={{
                          left: `${trackLeft}%`,
                          width: `${trackWidth}%`,
                        }}
                      />
                    )}

                    {/* Visual Segment Markers */}
                    <div
                      className="absolute w-2.5 h-2.5 bg-white border border-pink-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 shadow-sm z-10"
                      style={{ left: `${trackLeft}%` }}
                    />
                    <div
                      className="absolute w-2.5 h-2.5 bg-white border border-[var(--primary-700)] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 shadow-sm z-10"
                      style={{ left: `${trackLeft + trackWidth}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400/80 px-0.5">
                    <span>L-01</span>
                    <span>L-25</span>
                    <span>L-50</span>
                  </div>
                </div>

                {/* Dropdowns Selector Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                      Inicio
                    </label>
                    <select
                      value={inicio}
                      onChange={(e) => handleRangeChange(mapping.Rol, 'LeccionInicio', parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-colors"
                    >
                      {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>Lección {num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                      Fin
                    </label>
                    <select
                      value={fin}
                      onChange={(e) => handleRangeChange(mapping.Rol, 'LeccionFin', parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[var(--primary-700)] transition-colors"
                    >
                      {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>Lección {num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                {/* Real-time Inline Error Alert */}
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
                  onClick={() => handleSave(mapping.Rol)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${!isValid
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
                  {loadState === 'success' && '¡Mapeo Guardado!'}
                  {loadState === 'error' && 'Error al Guardar'}
                  {loadState === 'idle' && 'Guardar Mapeo'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
