import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  // 🔒 тут перевіряєш, чи є такий email у БД та генеруєш токен для листа
  console.log('Password reset requested for:', email);

  // Удаємо 2‑секундну обробку (видали у реальному коді)
  await new Promise((res) => setTimeout(res, 2000));

  return NextResponse.json({ message: 'Reset link sent' });
}
