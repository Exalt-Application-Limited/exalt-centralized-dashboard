import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // For now, we'll simulate WebSocket connection
    // In production, this would connect to actual WebSocket server
    const mockConnection = () => {
      setConnectionStatus('connecting');
      
      setTimeout(() => {
        setConnectionStatus('connected');
        // Mock socket for development
        const mockSocket = {
          send: (data: string) => console.log('Mock WebSocket send:', data),
          close: () => setConnectionStatus('disconnected'),
        } as WebSocket;
        setSocket(mockSocket);
      }, 1000);
    };

    mockConnection();

    return () => {
      setConnectionStatus('disconnected');
      setSocket(null);
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not connected, message queued:', message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, connectionStatus, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};