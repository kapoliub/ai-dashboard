import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email } = await request.json();

  // ⚠️ mock‑перевірка: якщо email уже «зайнятий»
  if (email === 'user@mail.com') {
    return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
  }

  // у реальному бек‑енді тут — створення користувача + видача JWT
  const token = 'mock-jwt-token';
  const user  = { name, email };

  const res = NextResponse.json({ user });
  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
