import { useState, useEffect, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';
type MessageHandler = (event: MessageEvent) => void;
type StatusHandler = (status: WebSocketStatus) => void;

interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: number;
}

// Singleton WebSocket manager to maintain a single connection across the app
class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 2000; // Start with 2 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private connectionStatus: WebSocketStatus = 'closed';
  private isManualClose: boolean = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.info('WebSocket connection already open');
      return;
    }

    this.url = url;
    this.isManualClose = false;
    this.reconnectAttempts = 0;
    this.establishConnection();
  }

  private establishConnection(): void {
    try {
      this.updateStatus('connecting');
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      this.updateStatus('error');
      this.scheduleReconnect();
    }
  }

  private handleOpen(event: Event): void {
    console.info('WebSocket connection established');
    this.reconnectAttempts = 0;
    this.reconnectTimeout = 2000; // Reset timeout
    this.updateStatus('open');
  }

  private handleClose(event: CloseEvent): void {
    console.info('WebSocket connection closed', event.code, event.reason);
    this.updateStatus('closed');
    
    if (!this.isManualClose) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.updateStatus('error');
  }

  private handleMessage(event: MessageEvent): void {
    try {
      // Process the message
      const data = JSON.parse(event.data);
      
      // Notify all registered handlers
      this.messageHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private scheduleReconnect(): void {
    if (this.isManualClose) return;
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts);
    console.info(`Scheduling reconnect in ${timeout}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      console.info(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.establishConnection();
    }, timeout);
  }

  private updateStatus(status: WebSocketStatus): void {
    this.connectionStatus = status;
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in status handler:', error);
      }
    });
  }

  public disconnect(): void {
    this.isManualClose = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.updateStatus('closed');
  }

  public sendMessage(message: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not open');
      return false;
    }

    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.send(messageStr);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public addStatusHandler(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    // Immediately call with current status
    handler(this.connectionStatus);
    return () => this.statusHandlers.delete(handler);
  }

  public getStatus(): WebSocketStatus {
    return this.connectionStatus;
  }
}

// React hook for using WebSocket
export const useWebSocket = (url: string | null) => {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [messages, setMessages] = useState<WebSocketEvent[]>([]);
  const wsManager = WebSocketManager.getInstance();

  useEffect(() => {
    if (!url) return;
    
    wsManager.connect(url);
    
    const statusCleanup = wsManager.addStatusHandler(setStatus);
    
    const messageCleanup = wsManager.addMessageHandler((event) => {
      try {
        const data = JSON.parse(event.data);
        const wsEvent: WebSocketEvent = {
          type: data.type || 'unknown',
          data: data,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, wsEvent].slice(-100)); // Keep last 100 messages
      } catch (error) {
        console.error('Error processing message in hook:', error);
      }
    });
    
    return () => {
      statusCleanup();
      messageCleanup();
    };
  }, [url]);

  const sendMessage = useCallback((message: any): boolean => {
    return wsManager.sendMessage(message);
  }, []);

  const disconnect = useCallback(() => {
    wsManager.disconnect();
  }, []);

  return {
    status,
    messages,
    sendMessage,
    disconnect
  };
};

export default WebSocketManager;
