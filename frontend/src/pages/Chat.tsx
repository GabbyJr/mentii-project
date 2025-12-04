import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Send, Paperclip, Phone, Video } from 'lucide-react';

interface Conversation {
  id: number;
  user_name: string;
  user_avatar: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  is_own: boolean;
}

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data?.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data?.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://127.0.0.1:8000/chat/conversations/${selectedConversation.id}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewMessage('');
      fetchMessages(selectedConversation.id);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-mentii-gray`}>
        {/* Header */}
        <div className="p-4 border-b border-mentii-gray">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-mentii-blue">Chat</h1>
            <button className="bg-mentii-mint text-mentii-blue p-2 rounded-full hover:shadow-md transition">
              <Plus size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mentii-mint"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-600 p-4">
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full p-4 border-b border-mentii-gray hover:bg-mentii-gray transition text-left ${
                  selectedConversation?.id === conversation.id ? 'bg-mentii-gray' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conversation.user_avatar}
                    alt={conversation.user_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-mentii-mint"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-mentii-blue">{conversation.user_name}</h3>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-mentii-mint rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      {selectedConversation ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="p-4 border-b border-mentii-gray flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-mentii-gray rounded-full"
              >
                ←
              </button>
              <img
                src={selectedConversation.user_avatar}
                alt={selectedConversation.user_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-mentii-mint"
              />
              <h2 className="font-bold text-mentii-blue">{selectedConversation.user_name}</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-mentii-gray rounded-full transition">
                <Phone size={20} className="text-mentii-mint" />
              </button>
              <button className="p-2 hover:bg-mentii-gray rounded-full transition">
                <Video size={20} className="text-mentii-mint" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-mentii-gray">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.is_own
                        ? 'bg-mentii-mint text-mentii-blue'
                        : 'bg-white text-gray-700 border border-mentii-gray'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.is_own ? 'text-mentii-blue/70' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-mentii-gray">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-mentii-gray rounded-full transition">
                <Paperclip size={20} className="text-mentii-mint" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-mentii-gray rounded-full focus:outline-none focus:ring-2 focus:ring-mentii-mint"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-mentii-mint text-mentii-blue rounded-full hover:shadow-md transition disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-600">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}