import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';

const BLOB_PATH = 'registry/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      try {
        const { blobs } = await list({ prefix: BLOB_PATH });
        const exactBlob = blobs.find(b => b.pathname === BLOB_PATH) || blobs[0];

        if (exactBlob && exactBlob.url) {
          // Fetch with no-cache to always retrieve the newest registry state
          const remoteRes = await fetch(exactBlob.url, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          });
          if (remoteRes.ok) {
            const data = await remoteRes.json();
            return res.status(200).json({ success: true, data, source: 'cloud' });
          }
        }

        return res.status(200).json({ success: true, data: null, source: 'cloud-empty' });
      } catch (blobErr) {
        console.error('Blob GET error:', blobErr);
        return res.status(200).json({ 
          success: false, 
          error: blobErr instanceof Error ? blobErr.message : 'Blob read failed',
          data: null 
        });
      }
    }

    if (req.method === 'POST') {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload format' });
      }

      try {
        const jsonString = JSON.stringify(payload);
        const blobResult = await put(BLOB_PATH, jsonString, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
        });

        return res.status(200).json({ 
          success: true, 
          url: blobResult.url,
          timestamp: new Date().toISOString() 
        });
      } catch (blobErr) {
        console.error('Blob POST error:', blobErr);
        return res.status(500).json({ 
          success: false, 
          error: blobErr instanceof Error ? blobErr.message : 'Blob save failed' 
        });
      }
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Internal Server Error' 
    });
  }
}
