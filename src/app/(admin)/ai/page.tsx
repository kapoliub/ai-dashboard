'use client';

import { useState, useRef } from 'react';
import {
  Typography, TextField, IconButton, CircularProgress, Box, Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from '@/components/ui/chat-message';

interface Msg { role: 'user' | 'ai'; content: string }

export default function AiPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    setLoading(false);

    // автоскрол до останнього повідомлення
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>AI Chat</Typography>

      {/* чат‑вікно */}
      <Paper sx={{ p: 2, height: 400, overflowY: 'auto' }}>
        {messages.map((m, idx) => (
          <ChatMessage key={idx} role={m.role} content={m.content} />
        ))}
        {/* refs для автоскролу */}
        <div ref={listRef} />
      </Paper>

      {/* ввід */}
      <Box display="flex" mt={2}>
        <TextField
          fullWidth
          placeholder="Ask me anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <IconButton color="primary" onClick={sendMessage} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </>
  );
}
