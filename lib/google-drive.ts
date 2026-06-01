import { google, drive_v3 } from 'googleapis';
import { cookies } from 'next/headers';
import { fetchStrapi } from './strapi';
import { DEFAULT_CAMPUS_ROLES, getLeccionesFolderForRole } from './roles';

// ── Auth ──────────────────────────────────────────────────────────────────────

function getAuth() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

  // Limpieza agresiva: quitar comillas dobles o simples al inicio/fin y espacios
  privateKey = privateKey.replace(/^["']|["']$/g, '').trim();
  // Reemplazar saltos de línea escapados por reales (soporta doble escape de Hostinger)
  privateKey = privateKey.replace(/\\+n/g, '\n');

  console.log('DEBUG: Private Key format check ->', JSON.stringify(privateKey.substring(0, 40)));

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
}

export function getDriveClient(): drive_v3.Drive {
  return google.drive({ version: 'v3', auth: getAuth() });
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string | null;
  modifiedTime: string | null;
  description: string | null;
  /** Direct URL for embedding (video/pdf iframe). Requires "anyone with link" sharing on the file. */
  webViewLink: string | null;
  /** Direct download link. Requires "anyone with link" sharing on the file. */
  webContentLink: string | null;
  thumbnailLink: string | null;
}

export interface LessonMeta {
  leccion: string;
  description: string | null;
  portadaId: string | null;
  portadaLink: string | null;
  folderIds: {
    grabaciones: string | null;
    guias: string | null;
    audios: string | null;
    tareas: string | null;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FILE_FIELDS =
  'id,name,mimeType,size,modifiedTime,description,webViewLink,webContentLink,thumbnailLink';

/**
 * Find the folder for a given lesson number inside a specific level folder or the root.
 * Folder naming convention: "Leccion-01", "Leccion-02", ...
 */
export async function getLessonFolder(leccionNum: string, levelName?: string): Promise<drive_v3.Schema$File | null> {
  const drive = getDriveClient();
  const padded = leccionNum.padStart(2, '0');
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID!;

  console.log(`DEBUG: Searching for lesson folder for number: ${leccionNum}`);

  // We'll search for both Leccion-XX and Lección-XX (and also handle non-padded versions)
  const namePatterns = [`Leccion-${leccionNum}`, `Lección-${leccionNum}`, `Leccion-${padded}`, `Lección-${padded}`];

  // Construct a query that checks for any of these names
  const nameQuery = namePatterns.map(n => `name = '${n}'`).join(' or ');

  const leccionesFolderName = getLeccionesFolderForRole(levelName);
  const leccionesFolderId = await getSubfolder(rootId, leccionesFolderName);
  const parentId = leccionesFolderId || rootId;

  const res = await drive.files.list({
    q: `'${parentId}' in parents and (${nameQuery}) and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id,name,description)',
    pageSize: 1,
  });

  if (res.data.files?.[0]) {
    console.log(`DEBUG: Found lesson folder: ${res.data.files[0].name} in folder ID: ${parentId}`);
    return res.data.files[0];
  }

  // If not found and we used the "Lecciones" folder, check the root folder just in case
  if (parentId !== rootId) {
    const resRoot = await drive.files.list({
      q: `'${rootId}' in parents and (${nameQuery}) and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id,name,description)',
      pageSize: 1,
    });
    if (resRoot.data.files?.[0]) return resRoot.data.files[0];
  }

  return null;
}

/**
 * List all lesson folders inside a specific level folder (e.g. "Nivel I").
 */
export async function getAvailableLessons(levelName?: string): Promise<{ label: string; href: string }[]> {
  let inicio = 1;
  let fin = 50;

  // Default fallback ranges to make sure it is fully robust
  const fallbackRanges: Record<string, { inicio: number; fin: number }> = {
    'Año I Adultos': { inicio: 1, fin: 10 },
    'Año II Adultos': { inicio: 11, fin: 20 },
    'Año III Adultos': { inicio: 21, fin: 30 },
    'Año IV Adultos': { inicio: 31, fin: 40 },
    'Año V Adultos': { inicio: 41, fin: 50 },
    'Nivel I Niños': { inicio: 1, fin: 25 },
    'Nivel II Niños': { inicio: 26, fin: 50 },
    'niños 1 er nivel ( junio)': { inicio: 1, fin: 25 },
    'Curso introductorio': { inicio: 1, fin: 50 },
    'Estudiante': { inicio: 1, fin: 50 },
    'Alumno': { inicio: 1, fin: 50 },
    'Profesor': { inicio: 1, fin: 50 },
    'Directora': { inicio: 1, fin: 50 },
  };

  let leccionesFolderName = getLeccionesFolderForRole(levelName);

  if (levelName) {
    if (fallbackRanges[levelName]) {
      inicio = fallbackRanges[levelName].inicio;
      fin = fallbackRanges[levelName].fin;
    }

    try {
      const cookieStore = await cookies();
      const jwt = cookieStore.get('jwt')?.value;

      // Fetch mapping from Strapi (query mapeo-lecciones dynamically)
      const resMapping = await fetchStrapi('mapeo-lecciones', `filters[Rol][$eq]=${encodeURIComponent(levelName)}&populate=*`, jwt);

      if (resMapping && resMapping.data) {
        const items = Array.isArray(resMapping.data) ? resMapping.data : [resMapping.data];
        if (items.length > 0) {
          const item = items[0];
          const fields = item.attributes || item;
          const leccionInicio = fields.LeccionInicio || fields.leccionInicio || fields.Inicio || fields.inicio;
          const leccionFin = fields.LeccionFin || fields.leccionFin || fields.Fin || fields.fin;
          const carpetaEspecifica = fields.CarpetaEspecifica || fields.carpetaEspecifica || fields.Carpeta || fields.carpeta;

          if (typeof leccionInicio === 'number' && typeof leccionFin === 'number') {
            inicio = leccionInicio;
            fin = leccionFin;
            console.log(`DEBUG: Strapi dynamic range loaded for role ${levelName}: [${inicio}, ${fin}]`);
          }
          if (carpetaEspecifica && typeof carpetaEspecifica === 'string' && carpetaEspecifica.trim().length > 0) {
            leccionesFolderName = carpetaEspecifica.trim();
            console.log(`DEBUG: Strapi mapping provides CarpetaEspecifica='${leccionesFolderName}' for role ${levelName}`);
          }
        }
      }
    } catch (err) {
      console.error(`DEBUG: Error fetching mapeo-lecciones for role ${levelName}, using fallback range:`, err);
    }
  }

  console.log(`DEBUG: Listing lessons within range [${inicio}, ${fin}] for role: ${levelName}`);

  const drive = getDriveClient();
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID!;

  try {
    console.log(`DEBUG: Attempting to find lessons folder name='${leccionesFolderName}' for role='${levelName}'`);
    const leccionesFolderId = await getSubfolder(rootId, leccionesFolderName);
    const parentId = leccionesFolderId || rootId;
    console.log(`DEBUG: Using parentId='${parentId}' (folder='${leccionesFolderName}')`);

    const res = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'files(id,name,mimeType)',
      pageSize: 100,
    });

    let files = res.data.files ?? [];

    // Filter folders matching "Leccion-XX" / "Lección-XX"
    let lessons = files.filter(f =>
      (f.name?.toLowerCase().includes('leccion-') || f.name?.toLowerCase().includes('lección-')) &&
      f.mimeType === 'application/vnd.google-apps.folder'
    );

    // If no lessons found inside "Lecciones" folder, check the root folder as fallback
    if (lessons.length === 0 && parentId !== rootId) {
      const resRoot = await drive.files.list({
        q: `'${rootId}' in parents and trashed = false`,
        fields: 'files(id,name,mimeType)',
        pageSize: 100,
      });
      lessons = (resRoot.data.files ?? []).filter(f =>
        (f.name?.toLowerCase().includes('leccion-') || f.name?.toLowerCase().includes('lección-')) &&
        f.mimeType === 'application/vnd.google-apps.folder'
      );
    }

    return lessons
      .map(f => {
        const name = f.name || '';
        const match = name.match(/Lecci[oó]n-(\d+)/i);
        const numStr = match ? match[1] : '';
        const num = parseInt(numStr, 10);
        return {
          label: `Lección ${num || numStr}`,
          href: `/campus/curso/${num || numStr}`,
          num: num || 0
        };
      })
      .filter(item => item.num >= inicio && item.num <= fin)
      .sort((a, b) => a.num - b.num)
      .map(({ label, href }) => ({ label, href }));

  } catch (error) {
    console.error('DEBUG: Error listing lessons:', error);
    return [];
  }
}

/**
 * Find a named subfolder inside a given parent folder.
 */
export async function getSubfolder(
  parentId: string,
  name: string
): Promise<string | null> {
  const drive = getDriveClient();

  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id)',
    pageSize: 1,
  });

  return res.data.files?.[0]?.id ?? null;
}

/**
 * Find the "portada" image in the lesson root folder (portada.jpg / portada.png / etc.)
 */
export async function getPortada(
  lessonFolderId: string
): Promise<{ id: string; link: string | null } | null> {
  const drive = getDriveClient();

  const res = await drive.files.list({
    q: `'${lessonFolderId}' in parents and name contains 'portada' and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id,webContentLink)',
    pageSize: 1,
  });

  const file = res.data.files?.[0];
  if (!file?.id) return null;
  return { id: file.id, link: file.webContentLink ?? null };
}

/**
 * Get all metadata for a lesson (portada, description, subfolder IDs).
 */
export async function getLessonMeta(leccion: string, levelName?: string): Promise<LessonMeta> {
  const folder = await getLessonFolder(leccion, levelName);

  if (!folder?.id) {
    return {
      leccion,
      description: null,
      portadaId: null,
      portadaLink: null,
      folderIds: { grabaciones: null, guias: null, audios: null, tareas: null },
    };
  }

  // 1. Fetch portada, guias, audios, tareas from the unified lesson folder
  const [portada, guiasId, audiosId, tareasId] = await Promise.all([
    getPortada(folder.id),
    getSubfolder(folder.id, 'Guias'),
    getSubfolder(folder.id, 'Audios'),
    getSubfolder(folder.id, 'Tareas'),
  ]);

  // 2. Fetch grabaciones folder from the role folder
  let grabacionesId: string | null = null;
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID!;
  if (levelName) {
    const levelFolderId = await getSubfolder(rootId, levelName);
    if (levelFolderId) {
      grabacionesId = await getSubfolder(levelFolderId, 'Grabaciones');
      console.log(`DEBUG: Found level-specific recordings folder for role ${levelName} -> ${grabacionesId}`);
    }
  }

  // 3. Backward compatibility fallback: look inside the lesson folder
  if (!grabacionesId) {
    grabacionesId = await getSubfolder(folder.id, 'Grabaciones');
    if (grabacionesId) {
      console.log(`DEBUG: Level-specific recordings folder not found, using lesson-level recordings -> ${grabacionesId}`);
    }
  }

  return {
    leccion,
    description: folder.description ?? null,
    portadaId: portada?.id ?? null,
    portadaLink: portada?.link ?? null,
    folderIds: {
      grabaciones: grabacionesId,
      guias: guiasId,
      audios: audiosId,
      tareas: tareasId,
    },
  };
}

/**
 * List all non-folder files inside a Drive folder.
 */
export async function listFiles(folderId: string): Promise<DriveFile[]> {
  const drive = getDriveClient();

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: `files(${FILE_FIELDS})`,
    orderBy: 'name',
    pageSize: 100,
  });

  return (res.data.files ?? []).map((f) => ({
    id: f.id ?? '',
    name: f.name ?? '',
    mimeType: f.mimeType ?? '',
    size: f.size ?? null,
    modifiedTime: f.modifiedTime ?? null,
    description: f.description ?? null,
    webViewLink: f.webViewLink ?? null,
    webContentLink: f.webContentLink ?? null,
    thumbnailLink: f.thumbnailLink ?? null,
  }));
}

/**
 * Get a readable stream for a Drive file (used for proxying portada images).
 */
export async function getFileStream(fileId: string) {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  return res;
}

/**
 * Upload a file buffer to a Drive folder.
 */
export async function uploadFile(params: {
  folderId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  description?: string;
}): Promise<string> {
  const drive = getDriveClient();
  const { Readable } = await import('stream');

  const res = await drive.files.create({
    requestBody: {
      name: params.fileName,
      parents: [params.folderId],
      description: params.description,
    },
    media: {
      mimeType: params.mimeType,
      body: Readable.from(params.buffer),
    },
    fields: 'id',
  });

  return res.data.id ?? '';
}

export interface AdditionalMaterialItem {
  label: string;
  href: string;
  isFolder: boolean;
  folderId?: string;
}

/** Carpeta contenedora de talleres en la raíz de Drive (compartida por todo el campus). */
export const CAMPUS_WORKSHOPS_FOLDER = 'Talleres adicionales';

/** Subcarpetas del año/nivel que no son talleres (mismo nivel que Lecciones). */
const LEVEL_SYSTEM_FOLDERS = new Set([
  'Lecciones',
  'Lecciones niños',
  'Grabaciones',
  'Material adicional',
  CAMPUS_WORKSHOPS_FOLDER,
]);

/** Carpetas en la raíz de Drive que no son talleres. */
const ROOT_SYSTEM_FOLDERS = new Set([
  ...DEFAULT_CAMPUS_ROLES,
  ...LEVEL_SYSTEM_FOLDERS,
  'Particulares',
  'Directora',
  'Profesor',
  'Estudiante',
  'Alumno',
]);

function escapeDriveName(name: string): string {
  return name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function isLessonFolder(name: string): boolean {
  return /lecci[oó]n-/i.test(name);
}

function isSystemLevelFolder(name: string): boolean {
  return LEVEL_SYSTEM_FOLDERS.has(name) || isLessonFolder(name);
}

function isSystemRootFolder(name: string): boolean {
  return ROOT_SYSTEM_FOLDERS.has(name) || isLessonFolder(name);
}

async function findNamedFolder(parentId: string, folderName: string): Promise<string | null> {
  const drive = getDriveClient();
  const escaped = escapeDriveName(folderName);

  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${escaped}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id)',
    pageSize: 1,
  });

  return res.data.files?.[0]?.id ?? null;
}

/** Carpeta del año/nivel del usuario (ej. "Año I Adultos"). */
export async function getLevelFolderId(levelName: string): Promise<string | null> {
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;
  if (!levelName || !rootId) return null;
  return getSubfolder(rootId, levelName);
}

/**
 * Carpeta padre de talleres: raíz del campus → "Talleres adicionales", o la raíz misma.
 */
export async function getCampusWorkshopsParentId(): Promise<string | null> {
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;
  if (!rootId) return null;

  const containerId = await getSubfolder(rootId, CAMPUS_WORKSHOPS_FOLDER);
  return containerId ?? rootId;
}

/**
 * Busca el taller por nombre: primero en campus (raíz), luego como hermano de Lecciones en el año del usuario.
 */
export async function getWorkshopFolderByName(
  workshopName: string,
  levelName?: string
): Promise<string | null> {
  const campusParentId = await getCampusWorkshopsParentId();
  if (campusParentId) {
    const inCampus = await findNamedFolder(campusParentId, workshopName);
    if (inCampus) return inCampus;
  }

  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;
  if (rootId && !isSystemRootFolder(workshopName)) {
    const atRoot = await findNamedFolder(rootId, workshopName);
    if (atRoot) return atRoot;
  }

  if (levelName) {
    const levelFolderId = await getLevelFolderId(levelName);
    if (levelFolderId) {
      const inLevel = await findNamedFolder(levelFolderId, workshopName);
      if (inLevel) return inLevel;
    }
  }

  return null;
}

/**
 * Lista archivos dentro de la carpeta del taller (campus o año del usuario).
 */
export async function getWorkshopFiles(
  workshopName: string,
  levelName?: string
): Promise<DriveFile[]> {
  const folderId = await getWorkshopFolderByName(workshopName, levelName);
  if (!folderId) return [];
  return listFiles(folderId);
}

/**
 * Talleres visibles para todo el campus (carpetas en raíz / "Talleres adicionales").
 */
export async function getCampusWorkshops(): Promise<AdditionalMaterialItem[]> {
  const drive = getDriveClient();
  const parentId = await getCampusWorkshopsParentId();
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;

  if (!parentId || !rootId) return [];

  try {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name, webViewLink, mimeType)',
      orderBy: 'name',
      pageSize: 100,
    });

    const fromContainer = (res.data.files ?? [])
      .filter((f) => f.name && !isSystemRootFolder(f.name))
      .map((f) => ({
        label: f.name!,
        href: `/campus/taller/${encodeURIComponent(f.name!)}`,
        isFolder: true,
        folderId: f.id ?? undefined,
      }));

    if (fromContainer.length > 0 || parentId !== rootId) {
      return fromContainer;
    }

    const resRoot = await drive.files.list({
      q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      orderBy: 'name',
      pageSize: 100,
    });

    return (resRoot.data.files ?? [])
      .filter((f) => f.name && !isSystemRootFolder(f.name))
      .map((f) => ({
        label: f.name!,
        href: `/campus/taller/${encodeURIComponent(f.name!)}`,
        isFolder: true,
        folderId: f.id ?? undefined,
      }));
  } catch (error) {
    console.error('DEBUG: Error fetching campus workshops:', error);
    return [];
  }
}

/**
 * Material adicional por nivel (PDFs/enlaces en carpeta "Material adicional" del año).
 */
export async function getAdditionalMaterial(levelName?: string): Promise<AdditionalMaterialItem[]> {
  const drive = getDriveClient();
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;

  if (!levelName || !rootId) return [];

  try {
    const levelFolderId = await getLevelFolderId(levelName);
    if (!levelFolderId) return [];

    const materialFolderId = await getSubfolder(levelFolderId, 'Material adicional');
    if (!materialFolderId) return [];

    const res = await drive.files.list({
      q: `'${materialFolderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, mimeType)',
      orderBy: 'name',
      pageSize: 100,
    });

    return (res.data.files ?? []).map((f) => {
      const name = f.name || 'Sin nombre';
      const isFolder = f.mimeType === 'application/vnd.google-apps.folder';

      return {
        label: name,
        href: isFolder
          ? `/campus/taller/${encodeURIComponent(name)}`
          : f.webViewLink || '#',
        isFolder,
        folderId: isFolder ? f.id ?? undefined : undefined,
      };
    });
  } catch (error) {
    console.error('DEBUG: Error fetching additional material:', error);
    return [];
  }
}

/**
 * Fetch all files inside the "Grabaciones" subfolder of a level folder.
 * For "Particulares" role, searches inside /Particulares/{username} instead.
 */
export async function getRecordingsForRole(levelName?: string, username?: string): Promise<DriveFile[]> {
  if (!levelName) return [];
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID!;

  console.log('DEBUG: Fetching class recordings for level:', levelName);

  try {
    let grabacionesFolderId: string | null = null;

    // Special handling for "Particulares" role
    if (levelName === 'Particulares' && username) {
      console.log('DEBUG: Special handling for Particulares - searching in /Particulares/', username);

      // Find the "Particulares" folder
      const particularesFolderId = await getSubfolder(rootId, 'Particulares');
      if (!particularesFolderId) {
        console.warn(`DEBUG: "Particulares" folder not found.`);
        return [];
      }

      // Find the username folder inside Particulares
      grabacionesFolderId = await getSubfolder(particularesFolderId, username);
      if (!grabacionesFolderId) {
        console.warn(`DEBUG: Username folder "${username}" not found inside Particulares.`);
        return [];
      }
    } else {
      // Default behavior: look inside level folder
      // 1. Find level folder
      const levelFolderId = await getSubfolder(rootId, levelName);
      if (!levelFolderId) {
        console.warn(`DEBUG: Level folder "${levelName}" not found.`);
        return [];
      }

      // 2. Find "Grabaciones" subfolder
      grabacionesFolderId = await getSubfolder(levelFolderId, 'Grabaciones');
      if (!grabacionesFolderId) {
        console.warn(`DEBUG: "Grabaciones" folder not found inside ${levelName}.`);
        return [];
      }
    }

    // 3. List all files inside
    return await listFiles(grabacionesFolderId);

  } catch (error) {
    console.error('DEBUG: Error fetching recordings for role:', error);
    return [];
  }
}
