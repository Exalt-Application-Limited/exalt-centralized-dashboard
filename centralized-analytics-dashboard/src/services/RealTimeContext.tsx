import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

export interface RealTimeDataPoint {
  timestamp: number;
  type: string;
  domain: string;
  data: any;
  metadata?: {
    source?: string;
    priority?: 'low' | 'medium' | 'high';
    correlation?: string[];
  };
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  enableLogging: boolean;
}

export interface RealTimeContextValue {
  // Connection status
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected: Date | null;
  
  // Data streams
  subscribe: (channel: string, callback: (data: RealTimeDataPoint) => void) => () => void;
  unsubscribe: (channel: string) => void;
  
  // Connection control
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  
  // Data publishing (for testing)
  publish: (channel: string, data: any) => void;
  
  // Statistics
  messageCount: number;
  errorCount: number;
  lastError: string | null;
}

const RealTimeContext = createContext<RealTimeContextValue | null>(null);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

interface RealTimeProviderProps {
  children: ReactNode;
  config: WebSocketConfig;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children, config }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef<Map<string, Set<(data: RealTimeDataPoint) => void>>>(new Map());
  const reconnectAttemptsRef = useRef(0);

  const log = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    if (config.enableLogging) {
      console[level](`[RealTime] ${message}`);
    }
  };

  const startHeartbeat = () => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, config.heartbeatInterval);
  };

  const stopHeartbeat = () => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  };

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      log('Already connected');
      return;
    }

    setConnectionStatus('connecting');
    log(`Connecting to ${config.url}`);

    try {
      wsRef.current = new WebSocket(config.url);

      wsRef.current.onopen = () => {
        log('Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        setLastConnected(new Date());
        reconnectAttemptsRef.current = 0;
        startHeartbeat();

        // Subscribe to all existing channels
        subscriptionsRef.current.forEach((callbacks, channel) => {
          if (callbacks.size > 0) {
            wsRef.current?.send(JSON.stringify({
              type: 'subscribe',
              channel,
              timestamp: Date.now(),
            }));
          }
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessageCount(prev => prev + 1);

          // Handle different message types
          switch (message.type) {
            case 'pong':
              // Heartbeat response - no action needed
              break;
            
            case 'data':
              // Real-time data update
              const { channel, data } = message;
              const callbacks = subscriptionsRef.current.get(channel);
              if (callbacks) {
                callbacks.forEach(callback => {
                  try {
                    callback(data);
                  } catch (error) {
                    log(`Error in callback for channel ${channel}: ${error}`, 'error');
                  }
                });
              }
              break;
            
            case 'error':
              log(`Server error: ${message.error}`, 'error');
              setLastError(message.error);
              setErrorCount(prev => prev + 1);
              break;
            
            case 'subscribed':
              log(`Successfully subscribed to channel: ${message.channel}`);
              break;
            
            case 'unsubscribed':
              log(`Successfully unsubscribed from channel: ${message.channel}`);
              break;
            
            default:
              log(`Unknown message type: ${message.type}`, 'warn');
          }
        } catch (error) {
          log(`Error parsing message: ${error}`, 'error');
          setErrorCount(prev => prev + 1);
        }
      };

      wsRef.current.onclose = (event) => {
        log(`Connection closed: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        stopHeartbeat();

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < config.maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        log(`WebSocket error: ${error}`, 'error');
        setConnectionStatus('error');
        setLastError('WebSocket connection error');
        setErrorCount(prev => prev + 1);
      };

    } catch (error) {
      log(`Failed to create WebSocket: ${error}`, 'error');
      setConnectionStatus('error');
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // Exponential backoff with max 30s
    log(`Scheduling reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${config.maxReconnectAttempts})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      connect();
    }, delay);
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Intentional disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    log('Disconnected');
  };

  const reconnect = () => {
    disconnect();
    setTimeout(connect, 100);
  };

  const subscribe = (channel: string, callback: (data: RealTimeDataPoint) => void) => {
    if (!subscriptionsRef.current.has(channel)) {
      subscriptionsRef.current.set(channel, new Set());
    }

    const channelCallbacks = subscriptionsRef.current.get(channel)!;
    const wasEmpty = channelCallbacks.size === 0;
    channelCallbacks.add(callback);

    // Send subscription message if this is the first subscriber for this channel
    if (wasEmpty && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        channel,
        timestamp: Date.now(),
      }));
    }

    log(`Subscribed to channel: ${channel}`);

    // Return unsubscribe function
    return () => {
      channelCallbacks.delete(callback);
      if (channelCallbacks.size === 0) {
        subscriptionsRef.current.delete(channel);
        
        // Send unsubscription message
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'unsubscribe',
            channel,
            timestamp: Date.now(),
          }));
        }
      }
      log(`Unsubscribed from channel: ${channel}`);
    };
  };

  const unsubscribe = (channel: string) => {
    const channelCallbacks = subscriptionsRef.current.get(channel);
    if (channelCallbacks) {
      channelCallbacks.clear();
      subscriptionsRef.current.delete(channel);
      
      // Send unsubscription message
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'unsubscribe',
          channel,
          timestamp: Date.now(),
        }));
      }
    }
    log(`Unsubscribed from all callbacks for channel: ${channel}`);
  };

  const publish = (channel: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'publish',
        channel,
        data,
        timestamp: Date.now(),
      }));
      log(`Published to channel: ${channel}`);
    } else {
      log(`Cannot publish to ${channel}: not connected`, 'warn');
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopHeartbeat();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const contextValue: RealTimeContextValue = {
    isConnected,
    connectionStatus,
    lastConnected,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
    reconnect,
    publish,
    messageCount,
    errorCount,
    lastError,
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Default configuration
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
  url: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080/api/websocket/dashboard',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  enableLogging: process.env.NODE_ENV === 'development',
};
