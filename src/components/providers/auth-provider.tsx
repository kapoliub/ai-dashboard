// src/components/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const EmptyCtx = { user: null, login: async () => {}, logout: async () => {} };

interface User { name: string; email: string }
interface Ctx { user: User | null; login: (e: string,p: string)=>Promise<void>; logout:()=>void }
const AuthCtx = createContext<Ctx>(EmptyCtx);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ① перевірити cookie при першому рендері (client‑side)
  useEffect(() => {
    fetch('/api/auth/me')    // зроби такий ендпоінт або пропусти
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setUser(d.user))
      .catch(() => {});
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (r.ok) {
      const data = await r.json();
      setUser(data.user);
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
