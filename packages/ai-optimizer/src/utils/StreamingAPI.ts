/**
 * Streaming API for AI Optimizer
 * 
 * Features:
 * - Real-time WebSocket communication
 * - Server-Sent Events (SSE) support
 * - Message queuing and buffering
 * - Connection management and reconnection
 * - Rate limiting and throttling
 * - Message compression and serialization
 * - Authentication and authorization
 * - Performance monitoring
 */

import { EventEmitter } from 'events';

export interface StreamingConfig {
  protocol: 'websocket' | 'sse' | 'polling';
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  messageBufferSize: number;
  compressionEnabled: boolean;
  rateLimit: {
    requestsPerSecond: number;
    burstLimit: number;
  };
  authentication: {
    type: 'token' | 'api-key' | 'oauth';
    credentials: string;
  };
}

export interface StreamingMessage {
  id: string;
  type: 'request' | 'response' | 'event' | 'error' | 'heartbeat';
  timestamp: number;
  data: any;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
  };
}

export interface ConnectionStatus {
  connected: boolean;
  protocol: string;
  url: string;
  reconnectAttempts: number;
  lastConnected: number;
  lastError?: string;
  latency: number;
  messageCount: number;
  errorCount: number;
}

export interface RateLimitInfo {
  requestsPerSecond: number;
  currentRequests: number;
  windowStart: number;
  burstLimit: number;
  currentBurst: number;
  isThrottled: boolean;
}

export interface PerformanceMetrics {
  messagesSent: number;
  messagesReceived: number;
  bytesSent: number;
  bytesReceived: number;
  averageLatency: number;
  connectionUptime: number;
  errorRate: number;
  compressionRatio: number;
}

/**
 * Streaming API Manager
 */
export class StreamingAPIManager extends EventEmitter {
  private config: StreamingConfig;
  private connection: WebSocket | EventSource | null = null;
  private status: ConnectionStatus;
  private messageQueue: StreamingMessage[] = [];
  private messageBuffer: Map<string, StreamingMessage> = new Map();
  private rateLimiter: RateLimitInfo;
  private performanceMetrics: PerformanceMetrics;
  private reconnectTimer?: NodeJS.Timeout;
  private heartbeatTimer?: NodeJS.Timeout;
  private isConnecting = false;
  private messageIdCounter = 0;
  private compressionWorker?: Worker;

  constructor(config: StreamingConfig) {
    super();
    
    this.config = config;
    
    this.status = {
      connected: false,
      protocol: config.protocol,
      url: config.url,
      reconnectAttempts: 0,
      lastConnected: 0,
      latency: 0,
      messageCount: 0,
      errorCount: 0
    };

    this.rateLimiter = {
      requestsPerSecond: config.rateLimit.requestsPerSecond,
      currentRequests: 0,
      windowStart: Date.now(),
      burstLimit: config.rateLimit.burstLimit,
      currentBurst: 0,
      isThrottled: false
    };

    this.performanceMetrics = {
      messagesSent: 0,
      messagesReceived: 0,
      bytesSent: 0,
      bytesReceived: 0,
      averageLatency: 0,
      connectionUptime: 0,
      errorRate: 0,
      compressionRatio: 0
    };

    this.initializeCompressionWorker();
    this.startRateLimitReset();
  }

  /**
   * Connect to streaming endpoint
   */
  async connect(): Promise<void> {
    if (this.isConnecting || this.status.connected) {
      return;
    }

    this.isConnecting = true;

    try {
      switch (this.config.protocol) {
        case 'websocket':
          await this.connectWebSocket();
          break;
        case 'sse':
          await this.connectSSE();
          break;
        case 'polling':
          await this.connectPolling();
          break;
        default:
          throw new Error(`Unsupported protocol: ${this.config.protocol}`);
      }

      this.status.connected = true;
      this.status.lastConnected = Date.now();
      this.status.reconnectAttempts = 0;
      this.isConnecting = false;

      this.startHeartbeat();
      this.processMessageQueue();

      this.emit('connected', { status: this.status });
    } catch (error) {
      this.isConnecting = false;
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * Disconnect from streaming endpoint
   */
  disconnect(): void {
    this.status.connected = false;
    
    if (this.connection) {
      if (this.connection instanceof WebSocket) {
        this.connection.close();
      } else if (this.connection instanceof EventSource) {
        this.connection.close();
      }
      this.connection = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.emit('disconnected', { status: this.status });
  }

  /**
   * Send message through streaming connection
   */
  async sendMessage(
    type: StreamingMessage['type'],
    data: any,
    metadata?: StreamingMessage['metadata']
  ): Promise<string> {
    const message: StreamingMessage = {
      id: this.generateMessageId(),
      type,
      timestamp: Date.now(),
      data,
      metadata
    };

    // Check rate limiting
    if (!this.checkRateLimit()) {
      this.messageQueue.push(message);
      this.emit('messageQueued', { message });
      return message.id;
    }

    return await this.sendMessageImmediate(message);
  }

  /**
   * Send message immediately (bypass queue)
   */
  private async sendMessageImmediate(message: StreamingMessage): Promise<string> {
    if (!this.status.connected || !this.connection) {
      throw new Error('Not connected to streaming endpoint');
    }

    try {
      const serializedMessage = await this.serializeMessage(message);
      const compressedMessage = this.config.compressionEnabled 
        ? await this.compressMessage(serializedMessage)
        : serializedMessage;

      if (this.connection instanceof WebSocket) {
        this.connection.send(compressedMessage);
      } else if (this.connection instanceof EventSource) {
        // SSE doesn't support sending messages, use fetch instead
        await this.sendSSEMessage(compressedMessage);
      }

      this.updatePerformanceMetrics('sent', compressedMessage.length);
      this.performanceMetrics.messagesSent++;
      this.status.messageCount++;

      this.emit('messageSent', { message });
      return message.id;
    } catch (error) {
      this.handleSendError(error as Error, message);
      throw error;
    }
  }

  /**
   * Subscribe to specific message types
   */
  subscribe(messageTypes: string[], callback: (message: StreamingMessage) => void): void {
    for (const messageType of messageTypes) {
      this.on(`message:${messageType}`, callback);
    }
  }

  /**
   * Unsubscribe from message types
   */
  unsubscribe(messageTypes: string[], callback: (message: StreamingMessage) => void): void {
    for (const messageType of messageTypes) {
      this.off(`message:${messageType}`, callback);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.status };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(): RateLimitInfo {
    return { ...this.rateLimiter };
  }

  /**
   * Update streaming configuration
   */
  updateConfig(newConfig: Partial<StreamingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reconnect if URL or protocol changed
    if (newConfig.url || newConfig.protocol) {
      this.disconnect();
      this.connect();
    }
  }

  // Private methods

  /**
   * Connect using WebSocket
   */
  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.config.url);
      
      ws.onopen = () => {
        this.connection = ws;
        resolve();
      };

      ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      ws.onclose = (event) => {
        this.handleConnectionClose(event.code, event.reason);
      };

      ws.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * Connect using Server-Sent Events
   */
  private async connectSSE(): Promise<void> {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(this.config.url);
      
      eventSource.onopen = () => {
        this.connection = eventSource;
        resolve();
      };

      eventSource.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      eventSource.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * Connect using polling
   */
  private async connectPolling(): Promise<void> {
    // Mock implementation for polling
    this.connection = {} as any; // Placeholder
    this.startPolling();
  }

  /**
   * Start polling for messages
   */
  private startPolling(): void {
    setInterval(async () => {
      try {
        const response = await fetch(this.config.url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.authentication.credentials}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.text();
          if (data) {
            this.handleMessage(data);
          }
        }
      } catch (error) {
        this.handleConnectionError(error as Error);
      }
    }, 1000); // Poll every second
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(data: string): Promise<void> {
    try {
      const decompressedData = this.config.compressionEnabled 
        ? await this.decompressMessage(data)
        : data;

      const message = await this.deserializeMessage(decompressedData);
      
      this.updatePerformanceMetrics('received', data.length);
      this.performanceMetrics.messagesReceived++;
      this.status.messageCount++;

      // Emit specific message type event
      this.emit(`message:${message.type}`, message);
      this.emit('message', message);

      // Handle special message types
      if (message.type === 'heartbeat') {
        this.handleHeartbeat(message);
      } else if (message.type === 'error') {
        this.handleErrorMessage(message);
      }
    } catch (error) {
      this.handleMessageError(error as Error, data);
    }
  }

  /**
   * Handle connection close
   */
  private handleConnectionClose(code: number, reason: string): void {
    this.status.connected = false;
    this.status.lastError = `Connection closed: ${code} - ${reason}`;
    
    this.emit('connectionClosed', { code, reason, status: this.status });
    
    // Attempt reconnection
    if (this.status.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    } else {
      this.emit('reconnectFailed', { status: this.status });
    }
  }

  /**
   * Handle connection error
   */
  private handleConnectionError(error: Error): void {
    this.status.connected = false;
    this.status.lastError = error.message;
    this.status.errorCount++;
    this.performanceMetrics.errorRate = this.status.errorCount / this.status.messageCount;

    this.emit('connectionError', { error, status: this.status });
    
    // Attempt reconnection
    if (this.status.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.status.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.pow(2, this.status.reconnectAttempts - 1);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);

    this.emit('reconnecting', { 
      attempt: this.status.reconnectAttempts, 
      delay,
      status: this.status 
    });
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendMessage('heartbeat', { timestamp: Date.now() });
    }, this.config.heartbeatInterval);
  }

  /**
   * Handle heartbeat response
   */
  private handleHeartbeat(message: StreamingMessage): void {
    const latency = Date.now() - message.data.timestamp;
    this.status.latency = latency;
    this.updateAverageLatency(latency);
  }

  /**
   * Handle error message
   */
  private handleErrorMessage(message: StreamingMessage): void {
    this.status.errorCount++;
    this.emit('error', { message });
  }

  /**
   * Handle send error
   */
  private handleSendError(error: Error, message: StreamingMessage): void {
    this.status.errorCount++;
    this.messageQueue.push(message); // Requeue message
    this.emit('sendError', { error, message });
  }

  /**
   * Handle message parsing error
   */
  private handleMessageError(error: Error, data: string): void {
    this.status.errorCount++;
    this.emit('messageError', { error, data });
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Reset window if needed
    if (now - this.rateLimiter.windowStart >= 1000) {
      this.rateLimiter.currentRequests = 0;
      this.rateLimiter.windowStart = now;
    }

    // Check per-second limit
    if (this.rateLimiter.currentRequests >= this.rateLimiter.requestsPerSecond) {
      this.rateLimiter.isThrottled = true;
      return false;
    }

    // Check burst limit
    if (this.rateLimiter.currentBurst >= this.rateLimiter.burstLimit) {
      this.rateLimiter.isThrottled = true;
      return false;
    }

    this.rateLimiter.currentRequests++;
    this.rateLimiter.currentBurst++;
    this.rateLimiter.isThrottled = false;
    
    return true;
  }

  /**
   * Start rate limit reset timer
   */
  private startRateLimitReset(): void {
    setInterval(() => {
      this.rateLimiter.currentBurst = Math.max(0, this.rateLimiter.currentBurst - 1);
    }, 100); // Reset burst every 100ms
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    const message = this.messageQueue.shift();
    if (message) {
      this.sendMessageImmediate(message).catch(() => {
        // Requeue if send fails
        this.messageQueue.unshift(message);
      });
    }

    // Continue processing if there are more messages
    if (this.messageQueue.length > 0) {
      setTimeout(() => this.processMessageQueue(), 100);
    }
  }

  /**
   * Serialize message
   */
  private async serializeMessage(message: StreamingMessage): Promise<string> {
    return JSON.stringify(message);
  }

  /**
   * Deserialize message
   */
  private async deserializeMessage(data: string): Promise<StreamingMessage> {
    return JSON.parse(data);
  }

  /**
   * Compress message
   */
  private async compressMessage(data: string): Promise<string> {
    if (!this.compressionWorker) {
      return data;
    }

    // Mock compression - in real implementation, use actual compression
    return data;
  }

  /**
   * Decompress message
   */
  private async decompressMessage(data: string): Promise<string> {
    if (!this.compressionWorker) {
      return data;
    }

    // Mock decompression - in real implementation, use actual decompression
    return data;
  }

  /**
   * Send SSE message (using fetch)
   */
  private async sendSSEMessage(data: string): Promise<void> {
    await fetch(this.config.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.authentication.credentials}`,
        'Content-Type': 'application/json'
      },
      body: data
    });
  }

  /**
   * Initialize compression worker
   */
  private initializeCompressionWorker(): void {
    if (this.config.compressionEnabled) {
      // Mock worker initialization - in real implementation, create Web Worker
      this.compressionWorker = {} as Worker;
    }
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(direction: 'sent' | 'received', bytes: number): void {
    if (direction === 'sent') {
      this.performanceMetrics.bytesSent += bytes;
    } else {
      this.performanceMetrics.bytesReceived += bytes;
    }

    this.performanceMetrics.connectionUptime = Date.now() - this.status.lastConnected;
  }

  /**
   * Update average latency
   */
  private updateAverageLatency(latency: number): void {
    const currentAvg = this.performanceMetrics.averageLatency;
    const messageCount = this.performanceMetrics.messagesReceived;
    
    this.performanceMetrics.averageLatency = 
      (currentAvg * (messageCount - 1) + latency) / messageCount;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${++this.messageIdCounter}`;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.disconnect();
    
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
    }
    
    this.messageQueue = [];
    this.messageBuffer.clear();
    this.removeAllListeners();
  }
}

/**
 * Real-time Optimization Stream
 */
export class OptimizationStream extends StreamingAPIManager {
  private optimizationCallbacks: Map<string, (result: any) => void> = new Map();

  constructor(config: StreamingConfig) {
    super(config);
    this.setupOptimizationHandlers();
  }

  /**
   * Stream optimization request
   */
  async streamOptimization(
    requestId: string,
    config: any,
    usageData: any[],
    callback: (result: any) => void
  ): Promise<void> {
    this.optimizationCallbacks.set(requestId, callback);

    await this.sendMessage('request', {
      type: 'optimization',
      requestId,
      config,
      usageData
    }, {
      requestId,
      priority: 'high'
    });
  }

  /**
   * Setup optimization-specific message handlers
   */
  private setupOptimizationHandlers(): void {
    this.subscribe(['response', 'event'], (message) => {
      if (message.data.requestId && this.optimizationCallbacks.has(message.data.requestId)) {
        const callback = this.optimizationCallbacks.get(message.data.requestId)!;
        callback(message.data);
        
        // Remove callback if this is the final result
        if (message.data.completed) {
          this.optimizationCallbacks.delete(message.data.requestId);
        }
      }
    });
  }

  /**
   * Cancel optimization request
   */
  async cancelOptimization(requestId: string): Promise<void> {
    await this.sendMessage('request', {
      type: 'cancel',
      requestId
    });

    this.optimizationCallbacks.delete(requestId);
  }
}
