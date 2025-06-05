import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'
import { getAIResponse } from './services/aiService'
import type { Chat, Message, ChatState } from './types'

const DEFAULT_AI_AVATAR = 'https://api.dicebear.com/7.x/bottts/svg?seed=ai';
const DEFAULT_USER_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user';

function App() {
  const [state, setState] = useState<ChatState>(() => {
    const savedState = localStorage.getItem('chatState')
    return savedState ? JSON.parse(savedState) : {
      chats: [],
      currentChatId: null,
      searchQuery: '',
    }
  })

  useEffect(() => {
    localStorage.setItem('chatState', JSON.stringify(state))
  }, [state])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Chat ${state.chats.length + 1}`,
      messages: [],
      avatar: DEFAULT_AI_AVATAR,
    }
    setState(prev => ({
      ...prev,
      chats: [...prev.chats, newChat],
      currentChatId: newChat.id,
    }))
  }

  const handleSendMessage = async (content: string) => {
    if (!state.currentChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      avatar: DEFAULT_USER_AVATAR,
    };

    setState(prev => {
      const updatedChats = prev.chats.map(chat => {
        if (chat.id === state.currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            lastMessage: userMessage,
          };
        }
        return chat;
      });

      return {
        ...prev,
        chats: updatedChats,
      };
    });

    try {
      // Get AI response
      const aiResponse = await getAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now(),
        avatar: DEFAULT_AI_AVATAR,
      };

      setState(prev => {
        const updatedChats = prev.chats.map(chat => {
          if (chat.id === state.currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, aiMessage],
              lastMessage: aiMessage,
            };
          }
          return chat;
        });

        return {
          ...prev,
          chats: updatedChats,
        };
      });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Failed to get AI response. Please try again.',
        sender: 'ai',
        timestamp: Date.now(),
        avatar: DEFAULT_AI_AVATAR,
      };

      setState(prev => {
        const updatedChats = prev.chats.map(chat => {
          if (chat.id === state.currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              lastMessage: errorMessage,
            };
          }
          return chat;
        });

        return {
          ...prev,
          chats: updatedChats,
        };
      });
    }
  };

  const currentChat = state.chats.find(chat => chat.id === state.currentChatId)

  return (
    <div className="flex h-screen">
      <ChatList
        chats={state.chats}
        currentChatId={state.currentChatId}
        searchQuery={state.searchQuery}
        onChatSelect={(chatId) => setState(prev => ({ ...prev, currentChatId: chatId }))}
        onSearchChange={(query) => setState(prev => ({ ...prev, searchQuery: query }))}
        onNewChat={createNewChat}
      />
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ChatWindow
            messages={currentChat.messages}
            onSendMessage={handleSendMessage}
            onNewChat={createNewChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={createNewChat}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
