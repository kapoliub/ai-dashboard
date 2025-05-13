'use client';

import { useState, useMemo } from 'react';
import {
  Typography, TextField, Select, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Button, Stack
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { mockUsers, User } from '@/utils/mock-users';
import UserFormDialog from '@/components/users/user-form-dialog';

export default function UsersPage() {
  const [rows, setRows]   = useState<User[]>(mockUsers);
  const [query, setQuery] = useState('');
  const [role,  setRole]  = useState<'All' | User['role']>('All');

  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [editingUser,  setEditingUser]  = useState<User | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(u =>
        (role === 'All' || u.role === role) &&
        u.name.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query, role]
  );

  const handleSave = (data: Omit<User, 'id'>) => {
    setRows(prev =>
      editingUser
        ? prev.map(u => (u.id === editingUser.id ? { ...u, ...data } : u))
        : [...prev, { id: prev.length + 1, ...data }]
    );
    closeDialog();
  };

  const handleDelete = (id: number) =>
    setRows(prev => prev.filter(u => u.id !== id));

  const openAdd   = () => { setEditingUser(null); setDialogOpen(true); };
  const openEdit  = (u: User) => { setEditingUser(u); setDialogOpen(true); };
  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Typography variant="h4" gutterBottom>Users</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by name"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Select value={role} onChange={e => setRole(e.target.value as User['role'])}>
          <MenuItem value="All">All roles</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Editor">Editor</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </Select>
        <Button variant="contained" onClick={openAdd}>
          Add user
        </Button>
      </Stack>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={60}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell width={120} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(u)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(u.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <UserFormDialog
        open={dialogOpen}
        initial={editingUser}
        onClose={closeDialog}
        onSave={handleSave}
      />
    </>
  );
}
