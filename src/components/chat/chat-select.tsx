import { IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useChat } from "@/components/providers/chat-provider";
import { useCallback, useMemo, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

interface Session {
    id: string;
    label: string;
  }

interface ChatSelectProps {
    sessionList: Session[];
    currentSessionLabel: string;
    filter: string;
    setSessionToDelete: (id: string) => void;
    setDialogOpen: (open: boolean) => void;
    setSessionList: (list: Session[]) => void;
}

export default function ChatSelect({ setSessionToDelete, setDialogOpen, sessionList, currentSessionLabel, filter, setSessionList }: ChatSelectProps) {
    const {sessionId, setSessionId, resetSession} = useChat();

    const [editingLabel, setEditingLabel] = useState<string | null>(null);

    const confirmDelete = useCallback((id: string) => {
        setSessionToDelete(id);
        setDialogOpen(true);
      }, [setDialogOpen, setSessionToDelete]);

    const handleChange = useCallback((e: SelectChangeEvent<string>) => {
        const id = e.target.value;
        if (!id) return;
        localStorage.setItem('session_id', id);
        setSessionId(id);
    }, [setSessionId]);

    const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = sessionList.map(s => s.id === sessionId ? { ...s, label: e.target.value } : s);
        setSessionList(updated);
        localStorage.setItem(`chat_${sessionId}`, JSON.stringify([{ role: 'user', text: e.target.value, time: new Date().toISOString() }]));
    }, [sessionId, sessionList, setSessionList]);

    const filteredSessions = useMemo(() => sessionList.filter((s) => s.label.toLowerCase().includes(filter.toLowerCase())), [sessionList, filter]);
    const isOnlyEmptySession = useMemo(() => sessionList.length === 1 && sessionList[0].label === '(No message)', [sessionList]);
    
    return (
      <Select
        size="small"
        value={sessionId || ''}
        sx={{ width: '100%' }}
        displayEmpty
        renderValue={() => currentSessionLabel}
        onChange={handleChange}
        >
        {filteredSessions.map(({ id, label }) => (
            <MenuItem key={id} value={id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingLabel === id ? (
                <TextField
                value={label}
                onChange={handleLabelChange}
                onBlur={() => setEditingLabel(null)}
                size="small"
                autoFocus
                />
            ) : (
                <span onDoubleClick={() => setEditingLabel(id)}>{label}</span>
            )}
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(id);
                }}
                disabled={isOnlyEmptySession && id === sessionId}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
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
        </Select>)
}