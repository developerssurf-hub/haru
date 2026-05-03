import { getAvailableLessons, getDriveClient, getSubfolder, getLessonFolder, getLessonMeta } from './lib/google-drive.ts';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: '.env.local' });

async function debugDrive() {
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;
  console.log('Root Folder ID:', rootId);

  const drive = getDriveClient();
  const res = await drive.files.list({
    q: `'${rootId}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType)',
  });

  console.log('Files in root:');
  res.data.files?.forEach(f => {
    console.log(`- ${f.name} (${f.mimeType}) [${f.id}]`);
  });

  const levelName = 'Año I Adultos';
  console.log(`--- Testing Level: ${levelName} ---`);
  
  const folderId = await getSubfolder(rootId!, levelName);
  console.log(`${levelName} Folder ID:`, folderId);
  
  const lessons = await getAvailableLessons(levelName);
  console.log(`Lessons in ${levelName}:`, lessons);

  if (lessons.length > 0) {
    const firstLesson = lessons[0].href.split('/').pop()!;
    console.log(`Testing getLessonFolder for Lesson ${firstLesson} in ${levelName}...`);
    const lessonFolder = await getLessonFolder(firstLesson, levelName);
    console.log(`Found Lesson Folder:`, lessonFolder?.name, 'ID:', lessonFolder?.id);
  }
}

debugDrive().catch(console.error);
