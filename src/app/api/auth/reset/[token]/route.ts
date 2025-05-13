import { NextResponse } from 'next/server';

// ── MOCK ──────────────────────────────────────────────────────────
// valid token = будь‑який, крім "invalid"; пароль ≥ 6 символів
export async function POST(
    request: Request,
    context: { params: { token: string } }
  ) {
    // ⬇️ витягуємо params через await
    const { token } = await context.params;   // «правильний» спосіб
  
    const { password } = await request.json();
  if (token === 'invalid' || password.length < 6) {
    return NextResponse.json({ message: 'Invalid token or weak password' }, { status: 400 });
  }

  console.log('Password updated for token:', token);       // ← тут буде реальне оновлення

  return NextResponse.json({ message: 'Password updated' });
}
