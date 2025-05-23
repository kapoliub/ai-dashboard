import { TextField, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from "@/components/providers/chat-provider";
import { FileUploader } from "@/components/chat";
import { useCallback } from "react";

export default function InputArea() {
    const { input, uploadedFileName, isTyping, setUploadedFile, send, setInput } = useChat();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 500) {
            setInput(e.target.value);
        }
    }, [setInput]);

    return (
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 1,
          bgcolor: 'background.paper'
        }}
      >
        {/* Input */}
        <TextField
          value={input}
          onChange={handleInputChange}
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          inputProps={{
            rows: 1
          }}
          placeholder="Ask something..."
          helperText={`${input.length}/500`}
          FormHelperTextProps={{ sx: { position: 'absolute', top: 0, right: 0 } }}
          error={input.length > 500}
        />
        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
          <FileUploader onTextExtracted={setUploadedFile} />
          {uploadedFileName && (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'info.light',
              borderRadius: 1,
              pl: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'info.light',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '200px',
            }}
          >
            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {uploadedFileName}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setUploadedFile(null)}
              title="Remove file"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        </Box>
          <IconButton onClick={send} color="primary" sx={{ ml: 'auto' }} disabled={isTyping}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    );
}