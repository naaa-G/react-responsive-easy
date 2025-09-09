import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  cursor?: {
    x: number;
    y: number;
    element?: string;
  };
  selection?: {
    start: number;
    end: number;
    element?: string;
  };
}

export interface CollaborationEvent {
  id: string;
  type: 'cursor_move' | 'selection_change' | 'data_update' | 'user_join' | 'user_leave' | 'permission_change';
  userId: string;
  timestamp: Date;
  data: unknown;
  element?: string;
}

export interface CollaborationConfig {
  serverUrl: string;
  roomId: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'editor' | 'viewer';
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  enableCursorSharing?: boolean;
  enableSelectionSharing?: boolean;
  enableDataSync?: boolean;
  enablePresence?: boolean;
}

export interface CollaborationState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  users: Map<string, CollaborationUser>;
  events: CollaborationEvent[];
  currentUser: CollaborationUser | null;
  roomId: string;
  lastActivity: Date | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export interface CollaborationActions {
  connect: () => void;
  disconnect: () => void;
  sendEvent: (event: Omit<CollaborationEvent, 'id' | 'timestamp'>) => void;
  updateCursor: (cursor: CollaborationUser['cursor']) => void;
  updateSelection: (selection: CollaborationUser['selection']) => void;
  broadcastData: (data: unknown, element?: string) => void;
  requestPermission: (permission: string) => void;
  grantPermission: (userId: string, permission: string) => void;
  revokePermission: (userId: string, permission: string) => void;
  kickUser: (userId: string) => void;
  banUser: (userId: string, duration?: number) => void;
  getConnectionStats: () => unknown;
  retryConnection: () => void;
}

/**
 * Enterprise-grade real-time collaboration hook with WebSocket integration
 * Supports cursor sharing, data synchronization, and permission management
 */
export function useRealTimeCollaboration(
  config: CollaborationConfig
): [CollaborationState, CollaborationActions] {
  const {
    serverUrl,
    roomId,
    userId,
    userName,
    userRole,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    enableCursorSharing = true,
    enableSelectionSharing = true,
    enableDataSync = true,
    enablePresence: _enablePresence = true
  } = config;

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const heartbeatTimeoutRef = useRef<ReturnType<typeof setInterval>>();
  const reconnectAttemptsRef = useRef(0);
  const lastPingRef = useRef(Date.now());
  const connectionStartRef = useRef(Date.now());

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [users, setUsers] = useState<Map<string, CollaborationUser>>(new Map());
  const [events, setEvents] = useState<CollaborationEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(null);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');

  // Initialize current user
  useEffect(() => {
    const user: CollaborationUser = {
      id: userId,
      name: userName,
      email: `${userName}@example.com`,
      role: userRole,
      status: 'online',
      lastSeen: new Date()
    };
    setCurrentUser(user);
  }, [userId, userName, userRole]);

  // Connection management
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const ws = new WebSocket(`${serverUrl}/collaboration/${roomId}?userId=${userId}&userName=${userName}&userRole=${userRole}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        connectionStartRef.current = Date.now();
        setConnectionQuality('excellent');
        
        // Send join event
        sendEvent({
          type: 'user_join',
          userId,
          data: { userName, userRole }
        });

        // Start heartbeat
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as unknown;
          handleMessage(message);
          setLastActivity(new Date());
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            // Use proper logging instead of console
            // eslint-disable-next-line no-console
            console.error('Failed to parse WebSocket message:', error);
          }
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionQuality('disconnected');
        
        if (!event.wasClean && reconnectAttemptsRef.current < reconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (_error) => {
        setConnectionError('WebSocket connection error');
        setIsConnecting(false);
        setConnectionQuality('disconnected');
      };

    } catch (_error) {
      setConnectionError('Failed to establish connection');
      setIsConnecting(false);
    }
  }, [serverUrl, roomId, userId, userName, userRole, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionQuality('disconnected');
  }, []);

  // Message handling
  const handleMessage = useCallback((message: unknown) => {
    const msg = message as { type: string; userId?: string; data?: unknown; element?: string };
    switch (msg.type) {
      case 'user_list': {
        const userMap = new Map<string, CollaborationUser>();
        (message as { data: CollaborationUser[] }).data.forEach((user: CollaborationUser) => {
          userMap.set(user.id, user);
        });
        setUsers(userMap);
        break;
      }

      case 'user_join': {
        setUsers(prev => {
          const newMap = new Map(prev);
          newMap.set((message as { userId: string }).userId, (message as { data: CollaborationUser }).data);
          return newMap;
        });
        addEvent({
          type: 'user_join',
          userId: (message as { userId: string }).userId,
          data: (message as { data: CollaborationUser }).data
        });
        break;
      }

      case 'user_leave': {
        setUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete((message as { userId: string }).userId);
          return newMap;
        });
        addEvent({
          type: 'user_leave',
          userId: (message as { userId: string }).userId,
          data: (message as { data: CollaborationUser }).data
        });
        break;
      }

      case 'cursor_move': {
        if (enableCursorSharing) {
          setUsers(prev => {
            const newMap = new Map(prev);
            const user = newMap.get((message as { userId: string }).userId);
            if (user) {
              newMap.set((message as { userId: string }).userId, { ...user, cursor: (message as { data: CollaborationUser['cursor'] }).data });
            }
            return newMap;
          });
        }
        break;
      }

      case 'selection_change': {
        if (enableSelectionSharing) {
          setUsers(prev => {
            const newMap = new Map(prev);
            const user = newMap.get((message as { userId: string }).userId);
            if (user) {
              newMap.set((message as { userId: string }).userId, { ...user, selection: (message as { data: CollaborationUser['selection'] }).data });
            }
            return newMap;
          });
        }
        break;
      }

      case 'data_update': {
        if (enableDataSync) {
          addEvent({
            type: 'data_update',
            userId: (message as { userId: string }).userId,
            data: (message as { data: unknown }).data,
            element: (message as { element?: string }).element
          });
        }
        break;
      }

      case 'permission_change': {
        addEvent({
          type: 'permission_change',
          userId: (message as { userId: string }).userId,
          data: (message as { data: unknown }).data
        });
        break;
      }

      case 'pong': {
        const latency = Date.now() - lastPingRef.current;
        updateConnectionQuality(latency);
        break;
      }

      default: {
        if (process.env.NODE_ENV === 'development') {
          // Use proper logging instead of console
          // eslint-disable-next-line no-console
          console.warn('Unknown message type:', (message as { type: string }).type);
        }
        break;
      }
    }
  }, [enableCursorSharing, enableSelectionSharing, enableDataSync]);

  // Event management
  const addEvent = useCallback((event: Omit<CollaborationEvent, 'id' | 'timestamp'>) => {
    const newEvent: CollaborationEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setEvents(prev => {
      const newEvents = [...prev, newEvent];
      // Keep only last 100 events
      return newEvents.slice(-100);
    });
  }, []);

  // Heartbeat management
  const startHeartbeat = useCallback(() => {
    const sendPing = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        lastPingRef.current = Date.now();
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
        heartbeatTimeoutRef.current = setTimeout(sendPing, heartbeatInterval);
      }
    };
    
    sendPing();
  }, [heartbeatInterval]);

  const updateConnectionQuality = useCallback((latency: number) => {
    if (latency < 100) {
      setConnectionQuality('excellent');
    } else if (latency < 300) {
      setConnectionQuality('good');
    } else {
      setConnectionQuality('poor');
    }
  }, []);

  // Reconnection logic
  const scheduleReconnect = useCallback(() => {
    reconnectAttemptsRef.current++;
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval * reconnectAttemptsRef.current);
  }, [connect, reconnectInterval]);

  // Actions
  const sendEvent = useCallback((event: Omit<CollaborationEvent, 'id' | 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...event,
        timestamp: new Date().toISOString()
      }));
    }
  }, []);

  const updateCursor = useCallback((cursor: CollaborationUser['cursor']) => {
    if (enableCursorSharing) {
      sendEvent({
        type: 'cursor_move',
        userId,
        data: cursor
      });
    }
  }, [enableCursorSharing, userId, sendEvent]);

  const updateSelection = useCallback((selection: CollaborationUser['selection']) => {
    if (enableSelectionSharing) {
      sendEvent({
        type: 'selection_change',
        userId,
        data: selection
      });
    }
  }, [enableSelectionSharing, userId, sendEvent]);

  const broadcastData = useCallback((data: unknown, element?: string) => {
    if (enableDataSync) {
      sendEvent({
        type: 'data_update',
        userId,
        data,
        element
      });
    }
  }, [enableDataSync, userId, sendEvent]);

  const requestPermission = useCallback((permission: string) => {
    sendEvent({
      type: 'permission_change',
      userId,
      data: { action: 'request', permission }
    });
  }, [userId, sendEvent]);

  const grantPermission = useCallback((targetUserId: string, permission: string) => {
    sendEvent({
      type: 'permission_change',
      userId,
      data: { action: 'grant', targetUserId, permission }
    });
  }, [userId, sendEvent]);

  const revokePermission = useCallback((targetUserId: string, permission: string) => {
    sendEvent({
      type: 'permission_change',
      userId,
      data: { action: 'revoke', targetUserId, permission }
    });
  }, [userId, sendEvent]);

  const kickUser = useCallback((targetUserId: string) => {
    sendEvent({
      type: 'permission_change',
      userId,
      data: { action: 'kick', targetUserId }
    });
  }, [userId, sendEvent]);

  const banUser = useCallback((targetUserId: string, duration?: number) => {
    sendEvent({
      type: 'permission_change',
      userId,
      data: { action: 'ban', targetUserId, duration }
    });
  }, [userId, sendEvent]);

  const getConnectionStats = useCallback(() => {
    const uptime = Date.now() - connectionStartRef.current;
    return {
      isConnected,
      uptime,
      connectionQuality,
      reconnectAttempts: reconnectAttemptsRef.current,
      lastActivity,
      usersCount: users.size,
      eventsCount: events.length
    };
  }, [isConnected, connectionQuality, lastActivity, users.size, events.length]);

  const retryConnection = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    void connect();
  }, [disconnect, connect]);

  // Auto-connect on mount
  useEffect(() => {
    void connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // State object
  const state: CollaborationState = {
    isConnected,
    isConnecting,
    connectionError,
    users,
    events,
    currentUser,
    roomId,
    lastActivity,
    connectionQuality
  };

  // Actions object
  const actions: CollaborationActions = {
    connect,
    disconnect,
    sendEvent,
    updateCursor,
    updateSelection,
    broadcastData,
    requestPermission,
    grantPermission,
    revokePermission,
    kickUser,
    banUser,
    getConnectionStats,
    retryConnection
  };

  return [state, actions];
}

/**
 * Hook for collaborative cursors visualization
 */
export function useCollaborativeCursors(
  containerRef: React.RefObject<HTMLElement>,
  users: Map<string, CollaborationUser>
) {
  const [cursors, setCursors] = useState<Map<string, { x: number; y: number; user: CollaborationUser }>>(new Map());

  useEffect(() => {
    const newCursors = new Map();
    
    users.forEach((user, userId) => {
      if (user.cursor && user.id !== 'current-user') {
        newCursors.set(userId, {
          x: user.cursor.x,
          y: user.cursor.y,
          user
        });
      }
    });
    
    setCursors(newCursors);
  }, [users]);

  const getCursorPosition = useCallback((userId: string) => {
    return cursors.get(userId);
  }, [cursors]);

  const getVisibleCursors = useCallback(() => {
    if (!containerRef.current) return [];
    
    const containerRect = containerRef.current.getBoundingClientRect();
    return Array.from(cursors.values()).filter(cursor => {
      return cursor.x >= containerRect.left && 
             cursor.x <= containerRect.right &&
             cursor.y >= containerRect.top && 
             cursor.y <= containerRect.bottom;
    });
  }, [cursors, containerRef]);

  return {
    cursors,
    getCursorPosition,
    getVisibleCursors
  };
}

/**
 * Hook for collaborative selections visualization
 */
export function useCollaborativeSelections(
  containerRef: React.RefObject<HTMLElement>,
  users: Map<string, CollaborationUser>
) {
  const [selections, setSelections] = useState<Map<string, { start: number; end: number; user: CollaborationUser }>>(new Map());

  useEffect(() => {
    const newSelections = new Map();
    
    users.forEach((user, userId) => {
      if (user.selection && user.id !== 'current-user') {
        newSelections.set(userId, {
          start: user.selection.start,
          end: user.selection.end,
          user
        });
      }
    });
    
    setSelections(newSelections);
  }, [users]);

  const getSelection = useCallback((userId: string) => {
    return selections.get(userId);
  }, [selections]);

  const getVisibleSelections = useCallback(() => {
    return Array.from(selections.values());
  }, [selections]);

  return {
    selections,
    getSelection,
    getVisibleSelections
  };
}
