// ── Campus roles (legacy — se mantienen mientras haya alumnos sin programa) ──────────────────────

export const DEFAULT_CAMPUS_ROLES = [
  'Año I Adultos',
  'Año II Adultos',
  'Año III Adultos',
  'Año IV Adultos',
  'Año V Adultos',
  'Nivel I Niños',
  'Nivel II Niños',
  'Curso introductorio',
  'Estudiante',
  'Profesor',
  'Particulares',
  'niños 1 er nivel ( junio)'
];

/** Carpeta de lecciones en Drive por rol (temporal hasta que todos los alumnos tengan programa). */
const ROLE_LECCIONES_FOLDER: Record<string, string> = {
  'Nivel I Niños': 'Lecciones niños',
  'Nivel II Niños': 'Lecciones niños',
  'niños 1 er nivel ( junio)': 'Lecciones niños',
  'Curso introductorio': 'Curso introductorio',
};

export function getLeccionesFolderForRole(role?: string): string {
  if (!role) return 'Lecciones';
  return ROLE_LECCIONES_FOLDER[role] ?? 'Lecciones';
}

// ── Rangos por defecto por rol (legacy fallback) ────────────────────────────────────────────────

const ROLE_DEFAULT_RANGES: Record<string, { inicio: number; fin: number }> = {
  'Año I Adultos':               { inicio: 1,  fin: 10 },
  'Año II Adultos':              { inicio: 11, fin: 20 },
  'Año III Adultos':             { inicio: 21, fin: 30 },
  'Año IV Adultos':              { inicio: 31, fin: 40 },
  'Año V Adultos':               { inicio: 41, fin: 50 },
  'Nivel I Niños':               { inicio: 1,  fin: 25 },
  'Nivel II Niños':              { inicio: 26, fin: 50 },
  'niños 1 er nivel ( junio)':   { inicio: 1,  fin: 25 },
  'Curso introductorio':         { inicio: 1,  fin: 50 },
  'Estudiante':                  { inicio: 1,  fin: 50 },
  'Alumno':                      { inicio: 1,  fin: 50 },
  'Profesor':                    { inicio: 1,  fin: 50 },
  'Directora':                   { inicio: 1,  fin: 50 },
};

export function getDefaultRangeForRole(role?: string): { inicio: number; fin: number } {
  if (!role) return { inicio: 1, fin: 50 };
  return ROLE_DEFAULT_RANGES[role] ?? { inicio: 1, fin: 50 };
}

// ── LevelConfig — tipo unificado para ambos sistemas ───────────────────────────────────────────
//
// Este tipo abstrae tanto el flujo legacy (rol) como el nuevo (programa).
// Todas las funciones de google-drive.ts y el layout lo usan para determinar:
//   · qué carpeta de Drive buscar
//   · qué rango de lecciones mostrar
//   · cómo etiquetar el nivel en la UI

export interface LevelConfig {
  /** Nombre visible del nivel (equivale al rol legacy o al campo "nombre" del programa). */
  nombre: string;
  /** Carpeta raíz de lecciones en Drive (ej. "Lecciones niños", "Lecciones", "Curso introductorio"). */
  folder: string;
  /** Primera lección del rango visible. */
  leccionInicio: number;
  /** Última lección del rango visible. */
  leccionFin: number;
  /**
   * Indica el origen de la configuración.
   * - "programa": vino del campo `programa` del usuario en Strapi (nuevo sistema).
   * - "rol":      vino del rol de Strapi del usuario (legacy).
   */
  source: 'programa' | 'rol';
  /**
   * documentId del registro en mapeo-lecciones de Strapi (si se obtuvo vía programa
   * y existe la relación directa). Útil para futuras ediciones.
   */
  mapeoDocumentId?: string;
}

/**
 * Construye un `LevelConfig` a partir del usuario y del rol efectivo.
 *
 * Prioridad:
 *   1. Si el usuario tiene un `programa` con `mapeo_lecciones` → usa el programa (nuevo sistema).
 *   2. Si el usuario es "Particulares" con rango personalizado → usa ese rango (caso especial legacy).
 *   3. Fallback: usa el rol efectivo con los rangos de Strapi o los hardcodeados (legacy).
 *
 * @param user           Objeto devuelto por `getMe()` (puede ser null).
 * @param effectiveRole  Rol efectivo devuelto por `getEffectiveRole()` (puede ser null).
 * @param strapiRange    Rango dinámico ya cargado de Strapi para el rol (opcional, pasa-a-través).
 */
export function buildLevelConfig(
  user: any | null,
  effectiveRole: string | null,
  strapiRange?: { inicio: number; fin: number } | null
): LevelConfig {
  const roleName = effectiveRole || 'Alumno';

  // ── 1. Nuevo sistema: el usuario tiene un programa con mapeo de lecciones ──────────────────
  const programa = user?.programa;
  if (programa) {
    const nombre = programa.Nombre ?? programa.nombre ?? roleName;
    // Si folder está vacío, el default es 'Lecciones' (regla de negocio acordada)
    const rawFolder = programa.Folder ?? programa.folder ?? '';
    const folder = rawFolder.trim() || 'Lecciones';

    // El programa puede tener su mapeo_lecciones relacionado directamente
    // Handle both flattened structure and nested Strapi v5 .data.attributes structure
    let mapeo = programa.mapeo_lecciones;
    if (mapeo && mapeo.data && mapeo.data.attributes) {
      mapeo = { ...mapeo.data.attributes, id: mapeo.data.id, documentId: mapeo.data.documentId };
    } else if (mapeo && mapeo.attributes) {
      mapeo = { ...mapeo.attributes, id: mapeo.id, documentId: mapeo.documentId };
    }

    const mapeoDoc = mapeo?.documentId ?? mapeo?.id?.toString();
    const inicio = Number(mapeo?.LeccionInicio ?? mapeo?.leccionInicio ?? 1);
    const fin    = Number(mapeo?.LeccionFin    ?? mapeo?.leccionFin    ?? 50);

    return {
      nombre,
      folder,
      leccionInicio: inicio,
      leccionFin: fin,
      source: 'programa',
      mapeoDocumentId: mapeoDoc,
    };
  }

  // ── 2. Caso especial legacy: Particulares con rango por usuario ───────────────────────────
  if (roleName === 'Particulares' && user) {
    const inicio = Number(user.LeccionInicio ?? user.leccionInicio ?? 1);
    const fin    = Number(user.LeccionFin    ?? user.leccionFin    ?? 50);
    return {
      nombre: 'Particulares',
      folder: 'Lecciones',
      leccionInicio: inicio,
      leccionFin: fin,
      source: 'rol',
    };
  }

  // ── 3. Legacy: rol con rango de Strapi o hardcodeado ─────────────────────────────────────
  const defaults = getDefaultRangeForRole(roleName);
  const inicio = strapiRange?.inicio ?? defaults.inicio;
  const fin    = strapiRange?.fin    ?? defaults.fin;

  return {
    nombre: roleName,
    folder: getLeccionesFolderForRole(roleName),
    leccionInicio: inicio,
    leccionFin: fin,
    source: 'rol',
  };
}
