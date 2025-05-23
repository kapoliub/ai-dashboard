import { NextRequest } from 'next/server';
import { parsePdf, parseDocx, parseTxt } from '@/utils/parseFile';

export const runtime = 'nodejs'; // бо pdf-parse не підтримується на edge

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop()?.toLowerCase();

  try {
    let text = '';

    if (ext === 'txt') {
      text = await parseTxt(buffer);
    } else if (ext === 'pdf') {
      text = await parsePdf(buffer);
    } else if (ext === 'docx') {
      text = await parseDocx(buffer);
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), { status: 400 });
    }

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err: unknown) {
    console.error('Parse error:', err);
    return new Response(JSON.stringify({ error: 'Failed to parse file' }), { status: 500 });
  }
}
