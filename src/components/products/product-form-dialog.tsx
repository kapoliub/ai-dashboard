'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import { Product } from '@/utils/mock-products';

interface Props {
  open: boolean;
  initial?: Product | null;
  onClose: () => void;
  onSave: (p: Omit<Product, 'id'>) => void;
}

export default function ProductFormDialog({ open, initial, onClose, onSave }: Props) {
  const [name, setName]       = useState('');
  const [category, setCat]    = useState<Product['category']>('Phones');
  const [price, setPrice]     = useState<number>(0);
  const [stock, setStock]     = useState<number>(0);

  useEffect(() => {
    if (initial) {
      setName(initial.name); setCat(initial.category);
      setPrice(initial.price); setStock(initial.stock);
    } else {
      setName(''); setCat('Phones'); setPrice(0); setStock(0);
    }
  }, [initial]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit product' : 'Add product'}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField fullWidth label="Name" value={name}
          onChange={e => setName(e.target.value)} sx={{ mb: 2 }} />

        <TextField select fullWidth label="Category" value={category}
          onChange={e => setCat(e.target.value as Product['category'])} sx={{ mb: 2 }}>
          <MenuItem value="Phones">Phones</MenuItem>
          <MenuItem value="Laptops">Laptops</MenuItem>
          <MenuItem value="Accessories">Accessories</MenuItem>
        </TextField>

        <TextField type="number" fullWidth label="Price" value={price}
          onChange={e => setPrice(+e.target.value)} sx={{ mb: 2 }} />

        <TextField type="number" fullWidth label="Stock" value={stock}
          onChange={e => setStock(+e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ name, category, price, stock })}
                disabled={!name || price <= 0}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
