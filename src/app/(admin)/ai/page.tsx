'use client';

import { Box, Typography, TextField } from '@mui/material';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Message, useChat } from '@/components/providers/chat-provider';
// import 'highlight.js/styles/github.css';
import { DownloadChatButton, ChatSelect, ChatWindow, InputArea } from '@/components/chat';
import { Dialog, DialogType } from '@/components/ui';
interface Session {
  id: string;
  label: string;
}

export default function AIPage() {
  const {
    sessionId,
    messages,
    resetSession,
    setSessionId,
  } = useChat();

  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedKeys = Object.keys(localStorage).filter((k) => k.startsWith('chat_') && k !== 'chat_sessions');
    const parsed = storedKeys.map((k) => {
      const id = k.replace('chat_', '');
      try {
        const data = JSON.parse(localStorage.getItem(k) || '[]');
        const label = data?.find((m: Message) => m.role === 'user')?.text?.slice(0, 20) || '(No message)';
        return { id, label };
      } catch {
        return { id, label: '(Invalid)' };
      }
    });

    setSessionList(parsed);
  }, [sessionId, messages]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [messages]);

  const handleDeleteConfirmed = useCallback(() => {
    if (!sessionToDelete) return;
    
    const updatedList = sessionList.filter((s) => s.id !== sessionToDelete);
    localStorage.removeItem(`chat_${sessionToDelete}`);
    localStorage.setItem(
      'chat_sessions',
      JSON.stringify(updatedList)
  );
    if (sessionToDelete === sessionId) {
      if (updatedList.length > 0) {
        const firstId = updatedList[0].id;     
        localStorage.setItem('session_id', firstId);
        setSessionId(firstId);

      } else {
        resetSession();
      }
    } else {
      setSessionList(updatedList);
    }

    setDialogOpen(false);
    setSessionToDelete(null);
  }, [resetSession, sessionId, sessionList, sessionToDelete, setSessionId]);

  const currentSessionLabel = useMemo(() => sessionList.find((s) => s.id === sessionId)?.label || '+ New Session', [sessionList, sessionId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{whiteSpace: 'nowrap'}}>AI Assistant</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search sessions"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{ mx: 1 }}
          />
          <ChatSelect 
            setSessionToDelete={setSessionToDelete}
            setDialogOpen={setDialogOpen}
            sessionList={sessionList}
            currentSessionLabel={currentSessionLabel}
            filter={filter}
            setSessionList={setSessionList} />
          <DownloadChatButton messages={messages} chatLabel={currentSessionLabel} />
        </Box>
      </Box>
      <ChatWindow />
      <InputArea />
      <Dialog
        dialogOpen={dialogOpen}
        title="Delete Session"
        content={`Are you sure you want to delete the session "${currentSessionLabel}"? This action cannot be undone.`}
        dialogType={DialogType.DELETE}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDeleteConfirmed} />
    </Box>
  );
}
