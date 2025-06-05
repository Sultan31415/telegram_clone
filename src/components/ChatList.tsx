import React from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';
import type { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  searchQuery: string;
  onChatSelect: (chatId: string) => void;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChatId,
  searchQuery,
  onChatSelect,
  onSearchChange,
  onNewChat,
}) => {
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/4 h-screen bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            onClick={onNewChat}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="New Chat"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
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
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.title}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{chat.title}</h3>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 