import { NextRequest, NextResponse } from 'next/server';
import { getFileStream } from '@/lib/google-drive';

/**
 * GET /api/drive/portada/[fileId]
 * Proxies the portada image from Drive so it can be used in <img> tags
 * without needing the file to be publicly shared.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
  }

  try {
    const res = await getFileStream(fileId);
    const contentType =
      (res.headers as Record<string, string>)['content-type'] ?? 'image/jpeg';

    // Convert the Node.js readable stream to a Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        (res.data as NodeJS.ReadableStream).on('data', (chunk: Buffer) =>
          controller.enqueue(chunk)
        );
        (res.data as NodeJS.ReadableStream).on('end', () => controller.close());
        (res.data as NodeJS.ReadableStream).on('error', (e: Error) =>
          controller.error(e)
        );
      },
    });

    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache 24h
      },
    });
  } catch (err) {
    console.error('[drive/portada] error:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
