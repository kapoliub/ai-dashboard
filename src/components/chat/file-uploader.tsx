// components/FileUploader.tsx
'use client';

import { Box, Button } from '@mui/material';
import { useToast } from '@/components/providers/toast-provider';

interface Props {
  onTextExtracted: (file: { text: string, name: string } | null) => void;
}

export default function FileUploader({ onTextExtracted }: Props) {
  const { showToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/files/parse', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      showToast('Failed to parse file', 'error');
      return;
    }

    const { text } = await res.json();
    if (!text) {
      showToast('No text extracted', 'error');
      return;
    }

    onTextExtracted({ text, name: file.name });
  };

  return (
    <Box>
      <Button variant="outlined" component="label">
        Upload File
        <input hidden type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
      </Button>
    </Box>
  );
}
