import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';          // ← щоб не кешувався

// ⬇️ ЄДИНИЙ потрібний експортуємий метод
export async function POST(request: Request) {
  const { messages } = await request.json();     // [{ role, content }]
  const last = messages.at(-1)?.content || '';

  // mock‑затримка (2 с) — забери у production
  await new Promise((res) => setTimeout(res, 2000));

  const reply = `You said: "${last}". (This is a mock AI response.)`;
  return NextResponse.json({ reply });
}
