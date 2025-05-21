'use client';

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '@/utils/helpers';

export interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

export function getSessionList(): { id: string; label: string }[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('chat_sessions');
  return raw ? JSON.parse(raw) : [];
}

const getMessagesFromStorage = (id: string): Message[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`chat_${id}`);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let stored = localStorage.getItem('session_id');
    if (!stored) {
      stored = nanoid();
      localStorage.setItem('session_id', stored);
      localStorage.setItem(`chat_${stored}`, JSON.stringify([]));
      const sessions = getSessionList();
      localStorage.setItem(
        'chat_sessions',
        JSON.stringify([...sessions, { id: stored, label: '(No message)' }])
      );
    }

    setSessionId(stored);
    setMessages(getMessagesFromStorage(stored));
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const msgs = getMessagesFromStorage(sessionId);
    setMessages(msgs);
  }, [sessionId]);

  const persist = (id: string, msgs: Message[]) => {
    localStorage.setItem(`chat_${id}`, JSON.stringify(msgs));
  };

  const send = async () => {
    if (!input.trim() || !sessionId) return;

    const newMsg: Message = {
      role: 'user',
      text: input,
      time: getCurrentTime()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput('');
    persist(sessionId, updated);

    // оновлюємо label, якщо це перше повідомлення
    if (updated.length === 1) {
      const sessions = getSessionList();
      const updatedSessions = sessions.map((s) =>
        s.id === sessionId ? { ...s, label: newMsg.text.slice(0, 20) } : s
      );
      localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
    }

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: updated }),
      headers: { 'Content-Type': 'application/json' }
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';

    const aiMsg: Message = { role: 'ai', text: '', time: getCurrentTime() };
    const withAI = [...updated, aiMsg];
    setMessages(withAI);
    persist(sessionId, withAI);

    while (!done && reader) {
      const { value, done: d } = await reader.read();
      done = d;
      const chunk = decoder.decode(value);
      buffer += chunk;

      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.role === 'ai' ? { ...m, text: buffer } : m
        )
      );
    }

    persist(sessionId, [...updated, { ...aiMsg, text: buffer }]);
  };

  const resetSession = () => {
    const newId = nanoid();
    localStorage.setItem('session_id', newId);
    localStorage.setItem(`chat_${newId}`, JSON.stringify([]));

    const sessions = getSessionList();
    localStorage.setItem(
      'chat_sessions',
      JSON.stringify([...sessions, { id: newId, label: '(No message)' }])
    );

    setSessionId(newId);
    setMessages([]);
  };

  return {
    sessionId,
    messages,
    input,
    setInput,
    send,
    resetSession,
    setSessionId
  };
}
