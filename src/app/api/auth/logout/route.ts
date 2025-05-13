import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'logged out' });
  res.cookies.set('token', '', { path: '/', maxAge: 0 });   // видалити cookie
  return res;
}
