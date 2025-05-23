import { useRef } from "react";
import { Paper, List, ListItem, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { useChat } from "@/components/providers/chat-provider";
import { useColorMode } from "@/components/providers/theme-provider";

export default function ChatWindow() {
    const { messages } = useChat();
    const { mode } = useColorMode();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    return (
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
                  bgcolor: msg.role === 'user' ? 'primary.main' : mode === 'dark' ? 'grey.800' : 'grey.300',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '45vw',
                  wordBreak: 'break-word',

                  '& p': {
                    '&:first-of-type': {
                      mt: 0
                    },
                    '&:last-of-type': {
                      mb: 0
                    }
                  }
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
    );
}