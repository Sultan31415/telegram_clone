export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: Message;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  searchQuery: string;
} 