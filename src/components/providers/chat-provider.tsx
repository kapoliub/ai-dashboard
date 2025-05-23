'use client';
import { useState, useEffect, createContext, useCallback, useMemo, useContext } from 'react';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '@/utils/helpers';
import { useToast } from '@/components/providers/toast-provider';

export interface Message {
    role: 'user' | 'ai' | 'system';
    text: string;
    time: string;
  }

  export interface UploadedFile {
    text: string;
    name: string;
  }
  
  interface ChatContextType {
    sessionId: string | null;
    messages: Message[];
    input: string;
    isTyping: boolean;
    uploadedFileName: string | null;
    setInput: (val: string) => void;
    send: () => void;
    resetSession: () => void;
    setSessionId: (id: string) => void;
    setUploadedFile: (file: UploadedFile | null) => void;
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

  function isValidMessageArray(arr: unknown): arr is Message[] {
    if (!Array.isArray(arr)) return false;
  
    return arr.every((msg) =>
      msg &&
      typeof msg.role === 'string' &&
      ['user', 'ai', 'system'].includes(msg.role) &&
      typeof msg.text === 'string' &&
      typeof msg.time === 'string'
    );
  }
  
  const ChatContext = createContext<ChatContextType | undefined>(undefined);

  export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
  };

  export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  
    const { showToast } = useToast();

    const persist = useCallback((id: string, msgs: Message[]) => {
    localStorage.setItem(`chat_${id}`, JSON.stringify(msgs));
    }, []);

    const send = useCallback(async () => {
        if (!input.trim() || !sessionId) return;
        
        const prompt: Message = {
            role: 'user',
            text: uploadedFile
            ? `${input}\n\n📎 File attached: ${uploadedFile.name}`
            : input,
            time: getCurrentTime()
        };
        
        const contextMsg: Message | null = uploadedFile
            ? {
                role: 'system',
                text: `The user uploaded a file. Use this content as context:\n\n${uploadedFile}`,
                time: getCurrentTime()
            }
            : null;
        
        const requestMessages = contextMsg
            ? [...messages, contextMsg, prompt]
            : [...messages, prompt];
        
        const displayMessages = [...messages, prompt]; // 🟡 system msg НЕ включаємо в UI
        
        if (!isValidMessageArray(requestMessages)) {
            console.error('Invalid messages:', requestMessages);
            showToast('Message structure is invalid. Please try again.', 'error');
            return;
        }
        
        // оновлюємо label, якщо це перше повідомлення
        if (messages.length === 0) {
            const sessions = getSessionList();
            const updatedSessions = sessions.map((s) =>
                s.id === sessionId ? { ...s, label: prompt.text.slice(0, 20) } : s
            );
            localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
        }
        
        setMessages(displayMessages);      // 🟢 в UI тільки prompt
        setInput('');
        persist(sessionId, displayMessages);
        setIsTyping(true);
        setUploadedFile(null);       // після відправки — очищаємо
        
        try {
            const res = await fetch('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ messages: requestMessages }),
            headers: { 'Content-Type': 'application/json' }
            });
        
            if (!res.ok) throw new Error('Failed to fetch AI response');
        
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let buffer = '';
        
            const aiMsg: Message = { role: 'ai', text: '', time: getCurrentTime() };
            const withAI = [...displayMessages, aiMsg];
            setMessages(withAI);
            persist(sessionId, withAI);
        
            while (!done && reader) {
              const { value, done: d } = await reader.read();
              
              if(!value) {
                done = true;
                showToast('Error getting response from AI.', 'error');
                break;
              }
              
              done = d;
              const chunk = decoder.decode(value);
              buffer += chunk;
          
              setMessages((prev) =>
                  prev.map((m, i) =>
                  i === prev.length - 1 && m.role === 'ai' ? { ...m, text: buffer } : m
                  )
              );
            }
        
            persist(sessionId, [...displayMessages, { ...aiMsg, text: buffer }]);
        } catch (err) {
            console.error('AI error:', err);
            showToast('Error getting response from AI.', 'error');
        } finally {
            setIsTyping(false);
        }
    }, [input, messages, persist, sessionId, showToast, uploadedFile]);

    const resetSession = useCallback(() => {
        const sessions = getSessionList();
        const emptySession = sessions.find(s => s.label === '(No message)');
        let newId = emptySession?.id || '';
        
        if (!emptySession) {
            newId = nanoid();

            localStorage.setItem(`chat_${newId}`, JSON.stringify([]));
            localStorage.setItem(
                'chat_sessions',
                JSON.stringify([...sessions, { id: newId, label: '(No message)' }])
            );
        }

        localStorage.setItem('session_id', newId);

        setSessionId(newId);
        setMessages([]);
        setUploadedFile(null);
    }, []);

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

        localStorage.setItem('session_id', sessionId);
        setMessages(msgs);
    }, [sessionId]);

    const value = useMemo<ChatContextType>(() => ({
        sessionId,
        messages,
        input,
        isTyping,
        uploadedFileName: uploadedFile?.name || null,
        setInput,
        send,
        resetSession,
        setSessionId,
        setUploadedFile,
    }), [sessionId, messages, input, isTyping, uploadedFile?.name, send, resetSession]);

    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    );
  }  