import { ChatProvider } from '@/components/providers/chat-provider';

export default function AIAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}