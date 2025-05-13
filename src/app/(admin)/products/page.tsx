'use client';

import { useState, useMemo } from 'react';
import {
  Typography, TextField, Select, MenuItem, Stack,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { mockProducts, Product } from '@/utils/mock-products';
import ProductFormDialog from '@/components/products/product-form-dialog';

export default function ProductsPage() {
  const [rows, setRows]   = useState<Product[]>(mockProducts);
  const [query, setQuery] = useState('');
  const [cat,   setCat]   = useState<'All' | Product['category']>('All');

  const [open, setOpen]   = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);

  const data = useMemo(
    () =>
      rows.filter(p =>
        (cat === 'All' || p.category === cat) &&
        p.name.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query, cat]
  );

  const save = (p: Omit<Product, 'id'>) => {
    setRows(prev =>
      editItem ? prev.map(r => (r.id === editItem.id ? { ...r, ...p } : r))
               : [...prev, { id: prev.length + 1, ...p }]
    );
    setOpen(false);
  };

  const del = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <>
      <Typography variant="h4" gutterBottom>Products</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="Search by name" value={query}
                   onChange={e => setQuery(e.target.value)} />
        <Select value={cat} onChange={e => setCat(e.target.value as Product['category'])}>
          <MenuItem value="All">All categories</MenuItem>
          <MenuItem value="Phones">Phones</MenuItem>
          <MenuItem value="Laptops">Laptops</MenuItem>
          <MenuItem value="Accessories">Accessories</MenuItem>
        </Select>
        <Button variant="contained" onClick={() => { setEditItem(null); setOpen(true); }}>
          Add product
        </Button>
      </Stack>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={60}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price, $</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell width={120} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell align="right">{p.price}</TableCell>
                <TableCell align="right">{p.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditItem(p); setOpen(true); }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => del(p.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <ProductFormDialog
        open={open}
        initial={editItem}
        onClose={() => setOpen(false)}
        onSave={save}
      />
    </>
  );
}
