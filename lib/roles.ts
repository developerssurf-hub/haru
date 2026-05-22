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
];

/** Carpeta de lecciones en Drive por rol (temporal hasta configurar Strapi). */
const ROLE_LECCIONES_FOLDER: Record<string, string> = {
  'Nivel I Niños': 'Lecciones niños',
  'Nivel II Niños': 'Lecciones niños',
  'Curso introductorio': 'Curso introductorio',
};

export function getLeccionesFolderForRole(role?: string): string {
  if (!role) return 'Lecciones';
  return ROLE_LECCIONES_FOLDER[role] ?? 'Lecciones';
}
