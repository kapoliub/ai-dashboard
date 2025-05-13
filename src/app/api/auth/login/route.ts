import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
    console.log({email, password})
  // 🔒 mock перевірка
  if (email === 'user@mail.com' && password === '123456') {
    const token = 'mock-jwt-token';
    const user  = { name: 'Demo User', email };

    const res = NextResponse.json({ user });
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
