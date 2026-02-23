import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file
        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/webp', 
            'image/gif', 
            'image/svg+xml',
            'video/mp4', 
            'video/webm',
            'video/quicktime',
            'image/x-icon', 
            'image/vnd.microsoft.icon', 
            'image/ico'
          ],
          maximumSizeInBytes: 5 * 1024 * 1024 * 1024, // 5GB (Vercel Pro Limit)
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        console.log('Blob upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.log('Upload error', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
