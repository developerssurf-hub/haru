import { google, drive_v3 } from 'googleapis';

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

  console.log(`DEBUG: Searching for lesson folder for number: ${leccionNum}${levelName ? ` in level: ${levelName}` : ''}`);

  // We'll search for both Leccion-XX and Lección-XX (and also handle non-padded versions)
  const namePatterns = [`Leccion-${leccionNum}`, `Lección-${leccionNum}`, `Leccion-${padded}`, `Lección-${padded}`];
  
  // Construct a query that checks for any of these names
  const nameQuery = namePatterns.map(n => `name = '${n}'`).join(' or ');

  // 1. If a level is specified, look inside that folder first
  if (levelName) {
    const levelId = await getSubfolder(rootId, levelName);
    if (levelId) {
      const res = await drive.files.list({
        q: `'${levelId}' in parents and (${nameQuery}) and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id,name,description)',
        pageSize: 1,
      });
      if (res.data.files?.[0]) {
        console.log(`DEBUG: Found lesson folder inside level folder: ${levelName} -> ${res.data.files[0].name}`);
        return res.data.files[0];
      }
    }
  }

  // 2. Try Root
  const res = await drive.files.list({
    q: `'${rootId}' in parents and (${nameQuery}) and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id,name,description)',
    pageSize: 1,
  });

  if (res.data.files?.[0]) return res.data.files[0];

  // 3. Fallback: Search in ALL first-level subfolders of Root
  console.log('DEBUG: Lesson not found in root or specified level, searching in all subfolders...');
  const subfoldersRes = await drive.files.list({
    q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id,name)',
  });

  for (const folder of (subfoldersRes.data.files ?? [])) {
    // Avoid re-searching the level we already checked
    if (levelName && folder.name === levelName) continue;

    const subRes = await drive.files.list({
      q: `'${folder.id}' in parents and (${nameQuery}) and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id,name,description)',
      pageSize: 1,
    });
    if (subRes.data.files?.[0]) {
      console.log(`DEBUG: Found lesson folder inside ${folder.name} -> ${subRes.data.files[0].name}`);
      return subRes.data.files[0];
    }
  }

  return null;
}

/**
 * List all lesson folders inside a specific level folder (e.g. "Nivel I").
 */
export async function getAvailableLessons(levelName?: string): Promise<{ label: string; href: string }[]> {
  const drive = getDriveClient();
  let parentId = process.env.DRIVE_ROOT_FOLDER_ID;

  // If a level is specified, find its folder ID first
  if (levelName) {
    console.log('DEBUG: Searching for level folder:', levelName);
    const levelFolderId = await getSubfolder(parentId!, levelName);
    if (levelFolderId) {
      console.log('DEBUG: Level folder found ID:', levelFolderId);
      parentId = levelFolderId;
    } else {
      console.warn(`DEBUG: Level folder "${levelName}" not found in Drive. Falling back to root.`);
    }
  }

  console.log('DEBUG: Listing files in parentId:', parentId);

  try {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'files(id,name,mimeType)',
      pageSize: 100,
    });

    const allFiles = res.data.files ?? [];
    console.log('DEBUG: All files in folder:', allFiles.map(f => f.name).join(', '));

    let files = allFiles.filter(f => 
      (f.name?.toLowerCase().includes('leccion-') || f.name?.toLowerCase().includes('lección-')) && 
      f.mimeType === 'application/vnd.google-apps.folder'
    );

    // Aggressive Fallback: If no lessons found, check if they are in "Nivel I", "Nivel II" or other subfolders
    if (files.length === 0) {
      const levelFolders = allFiles.filter(f => 
        (f.name === 'Nivel I' || f.name === 'Nivel II' || f.name === 'Año I Adultos') && 
        f.mimeType === 'application/vnd.google-apps.folder'
      );
      for (const folder of levelFolders) {
        console.log(`DEBUG: Aggressive search checking subfolder: ${folder.name}`);
        const subRes = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false`,
          fields: 'files(id,name,mimeType)',
        });
        const subFiles = (subRes.data.files ?? []).filter(f => 
          (f.name?.toLowerCase().includes('leccion-') || f.name?.toLowerCase().includes('lección-')) && 
          f.mimeType === 'application/vnd.google-apps.folder'
        );
        files = [...files, ...subFiles];
      }
    }

    // Root Fallback: If we still have nothing and we weren't searching the root
    if (files.length === 0 && parentId !== process.env.DRIVE_ROOT_FOLDER_ID) {
      console.log('DEBUG: Final fallback, checking root directly.');
      const rootRes = await drive.files.list({
        q: `'${process.env.DRIVE_ROOT_FOLDER_ID}' in parents and (name contains 'Leccion-' or name contains 'Lección-') and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id,name)',
      });
      files = rootRes.data.files ?? [];
    }

    return files
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
      .filter(item => item.num > 0)
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

  const [portada, grabacionesId, guiasId, audiosId, tareasId] = await Promise.all([
    getPortada(folder.id),
    getSubfolder(folder.id, 'Grabaciones'),
    getSubfolder(folder.id, 'Guias'),
    getSubfolder(folder.id, 'Audios'),
    getSubfolder(folder.id, 'Tareas'),
  ]);

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
