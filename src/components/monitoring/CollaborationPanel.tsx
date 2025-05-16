import React, { useState, useEffect, useRef } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';

interface CollaboratorUser {
  id: string;
  name: string;
  avatar?: string;
  lastActive: number;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

interface CollaborationPanelProps {
  jobId?: string;
  className?: string;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  jobId,
  className = '',
  currentUser
}) => {
  const { sendCommand } = useMonitoring();
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock user data - in real implementation, this would come from the WebSocket
  useEffect(() => {
    // Add current user to collaborators
    setCollaborators([
      {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        lastActive: Date.now(),
        isActive: true
      },
      // These would typically come from the server in a real implementation
      {
        id: 'user-1',
        name: 'Team Member 1',
        lastActive: Date.now() - 120000, // 2 minutes ago
        isActive: true
      },
      {
        id: 'user-2',
        name: 'Team Member 2',
        lastActive: Date.now() - 3600000, // 1 hour ago
        isActive: false
      }
    ]);

    // Mock initial chat messages
    setChatMessages([
      {
        id: 'msg-1',
        userId: 'user-1',
        userName: 'Team Member 1',
        message: 'I started this scraper job on e-commerce sites',
        timestamp: Date.now() - 3600000 // 1 hour ago
      },
      {
        id: 'msg-2',
        userId: 'user-2',
        userName: 'Team Member 2',
        message: 'Looking at the results now, seeing some rate limiting errors',
        timestamp: Date.now() - 1800000 // 30 minutes ago
      }
    ]);
  }, [currentUser]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format "last active" time
  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return `${Math.floor(diff / 86400000)}d ago`;
    }
  };

  // Send a chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      message: messageInput.trim(),
      timestamp: Date.now()
    };
    
    // Add message to local state
    setChatMessages(prev => [...prev, newMessage]);
    
    // Send message to server via WebSocket
    sendCommand('send_chat_message', {
      jobId,
      message: messageInput.trim()
    });
    
    // Clear input
    setMessageInput('');
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div 
        className="p-4 border-b flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">Collaboration</h3>
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {collaborators.slice(0, 3).map(user => (
              <div 
                key={user.id} 
                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${user.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}
                title={user.name}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {user.name.substring(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold">
                  +{collaborators.length - 3}
                </span>
              </div>
            )}
          </div>
          <svg 
            className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-3 divide-x">
          {/* Active Users Column */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Active Users</h4>
            <ul>
              {collaborators.map(user => (
                <li 
                  key={user.id}
                  className="flex items-center py-2"
                >
                  <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${user.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {user.name.substring(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user.name}
                      {user.id === currentUser.id && ' (you)'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.isActive ? (
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          Online
                        </span>
                      ) : (
                        `Last active: ${formatLastActive(user.lastActive)}`
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Chat Column */}
          <div className="col-span-2 flex flex-col h-80">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Be the first to send a message!</p>
                </div>
              ) : (
                chatMessages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.userId !== currentUser.id && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-sm font-semibold">
                          {message.userName.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.userId === currentUser.id 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.userId !== currentUser.id && `${message.userName} • `}
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form 
              onSubmit={sendMessage}
              className="p-3 border-t flex"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-blue-600 transition-colors"
                disabled={!messageInput.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;
