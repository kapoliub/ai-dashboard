import { Message } from '@/hooks';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';

interface DownloadChatButtonProps {
    messages: Message[];
    chatLabel: string;
}

export default function DownloadChatButton({ messages, chatLabel }: DownloadChatButtonProps) {
    const handleExport = () => {
        if (!messages.length) return;
      
        const content = messages
          .map((msg) => {
            const role = msg.role === 'user' ? 'You' : 'AI';
            return `[${msg.time}] ${role}: ${msg.text}`;
          })
          .join('\n\n');
      
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
      
        const a = document.createElement('a');
        const label = chatLabel.replace(/ /g, '_');
        
        a.href = url;
        a.download = `${label}.txt`;
        a.click();
      
        URL.revokeObjectURL(url); // clean up
      };

  return (
    <IconButton onClick={handleExport} title="Export Chat">
      <DownloadIcon />
    </IconButton>
  );
}