import React from 'react';
import type { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  searchQuery: string;
  onChatSelect: (chatId: string) => void;
  onSearchChange: (query: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChatId,
  searchQuery,
  onChatSelect,
  onSearchChange,
}) => {
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/4 h-screen bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              chat.id === currentChatId ? 'bg-blue-100' : ''
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <h3 className="font-medium">{chat.title}</h3>
            {chat.lastMessage && (
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 