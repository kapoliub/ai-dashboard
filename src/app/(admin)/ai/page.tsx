'use client';

import {
  Box, Typography, TextField, IconButton, Paper, List, ListItem,
  Avatar, MenuItem, Select, IconButton as MIconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  InputBase
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useEffect, useState } from 'react';
import { Message, useChatSession } from '@/hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function AIPage() {
  const {
    sessionId,
    messages,
    input,
    setInput,
    send,
    resetSession,
    setSessionId
  } = useChatSession();

  const [sessionList, setSessionList] = useState<{ id: string, label: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedKeys = Object.keys(localStorage).filter((k) => k.startsWith('chat_'));
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
    }, 200);
  }, [messages]);

  const confirmDelete = (id: string) => {
    setSessionToDelete(id);
    setDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!sessionToDelete) return;

    const updatedList = sessionList.filter((s) => s.id !== sessionToDelete);
    localStorage.removeItem(`chat_${sessionToDelete}`);

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
  };

  const currentSessionLabel = sessionList.find((s) => s.id === sessionId)?.label || '+ New Session';
  const isOnlyEmptySession = sessionList.length === 1 && sessionList[0].id === sessionId && currentSessionLabel === '(No message)';
  const filteredSessions = sessionList.filter((s) => s.label.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">AI Assistant</Typography>
        <Box>
          <InputBase
            placeholder="Search sessions"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mr: 2, border: '1px solid', px: 1, borderRadius: 1 }}
          />
          <Select
            size="small"
            value={sessionId || ''}
            sx={{ width: '350px' }}
            displayEmpty
            renderValue={() => currentSessionLabel}
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              localStorage.setItem('session_id', id);
              setSessionId(id);
            }}
          >
            {filteredSessions.map(({ id, label }) => (
              <MenuItem key={id} value={id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingLabel === id ? (
                  <TextField
                    value={label}
                    onChange={(e) => {
                      const updated = sessionList.map(s => s.id === id ? { ...s, label: e.target.value } : s);
                      setSessionList(updated);
                      localStorage.setItem(`chat_${id}`, JSON.stringify([{ role: 'user', text: e.target.value, time: new Date().toISOString() }]));
                    }}
                    onBlur={() => setEditingLabel(null)}
                    size="small"
                    autoFocus
                  />
                ) : (
                  <span onDoubleClick={() => setEditingLabel(id)}>{label}</span>
                )}
                <MIconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(id);
                  }}
                  disabled={isOnlyEmptySession && id === sessionId}
                >
                  <DeleteIcon fontSize="small" />
                </MIconButton>
              </MenuItem>
            ))}
            <MenuItem
              value=""
              onClick={(e) => {
                e.stopPropagation();
                resetSession();
              }}
            >
              + New Session
            </MenuItem>
          </Select>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2, overflowY: 'auto', flex: 1 }}>
        <List>
          {messages.map((msg, i) => (
            <ListItem key={i} disableGutters sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box sx={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '100%',
              }}>
                <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.500' }}>
                  {msg.role === 'user' ? 'U' : 'A'}
                </Avatar>
                <Box sx={{
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.300',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '45vw',
                  wordBreak: 'break-word'
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {msg.text}
                  </ReactMarkdown>
                </Box>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          label="Ask something…"
        />
        <IconButton onClick={send} color="primary">
          <SendIcon />
        </IconButton>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Delete Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this session? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
