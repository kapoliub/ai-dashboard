import { useEffect, useRef, useState } from "react";
import { Paper, List, ListItem, Avatar, Fade, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { useChat } from "@/components/providers/chat-provider";
import { useColorMode } from "@/components/providers/theme-provider";

export default function ChatWindow() {
  const { messages } = useChat();
  const { mode } = useColorMode();

  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
  
    const handleScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setIsAutoScroll(nearBottom);
    };
  
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAutoScroll) return;
  
    const el = messagesEndRef.current;
    el?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <Paper
      ref={containerRef}
      sx={(theme) => ({
        p: 2,
        mb: 2,
        overflowY: 'auto',
        flex: 1,
        '&::-webkit-scrollbar': {
          width: 8
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.background.paper
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: mode === 'dark' ? '#555' : '#ccc',
          borderRadius: 4
        },
        scrollbarWidth: 'thin',
        scrollbarColor: `${mode === 'dark' ? '#555' : '#ccc'} ${theme.palette.background.paper}`,
      })}
    >
      <List>
        {messages.map((msg, i) => (
          <ListItem
            key={i}
            disableGutters
            sx={{
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '100%',
              }}
            >
              <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.500' }}>
                {msg.role === 'user' ? 'U' : 'A'}
              </Avatar>
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? 'primary.main' : mode === 'dark' ? 'grey.800' : 'grey.300',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '45vw',
                  wordBreak: 'break-word',
                  '& p': {
                    '&:first-of-type': { mt: 0 },
                    '&:last-of-type': { mb: 0 }
                  }
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {msg.text}
                </ReactMarkdown>
              </Box>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Fade in={!isAutoScroll}>
        <IconButton
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            setIsAutoScroll(true);
          }}
          sx={{
            position: 'absolute',
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) - 50,
            left: (containerRef.current?.getBoundingClientRect().right || 0) - 50,
            bgcolor: 'background.paper',
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'divider',
            zIndex: 10,
            '&:hover': {
              bgcolor: 'background.default'
            }
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Fade>
    </Paper>
  );
}
