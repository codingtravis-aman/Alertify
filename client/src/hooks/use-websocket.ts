import { useState, useEffect, useCallback } from 'react';

export type WebSocketMessage = {
  type: string;
  data?: any;
  message?: string;
};

export function useWebSocket(path: string = '/ws') {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    // Create WebSocket connection
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}${path}`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected!');
        setIsConnected(true);
        setReconnectAttempt(0);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected!');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect after delay
        const reconnectDelay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempt));
        console.log(`Attempting to reconnect in ${reconnectDelay}ms...`);
        
        setTimeout(() => {
          setReconnectAttempt(prev => prev + 1);
        }, reconnectDelay);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          console.log('WebSocket message received:', message);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(ws);
    };
    
    if (!socket && reconnectAttempt >= 0) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, reconnectAttempt, path]);
  
  // Send message to WebSocket server
  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [socket, isConnected]);
  
  return { isConnected, lastMessage, sendMessage };
}