import { ResponsiveConfig, ComponentUsageData, OptimizationSuggestions, StreamingStatus, StreamingMetrics } from '../types/index.js';
import { StreamingAPIManager, OptimizationStream, ConnectionStatus, PerformanceMetrics as StreamingAPIPerformanceMetrics } from '../utils/StreamingAPI.js';

/**
 * Manages streaming features for AI Optimizer
 */
export class StreamingManager {
  private streamingAPI: StreamingAPIManager;
  private optimizationStream: OptimizationStream;

  constructor() {
    this.streamingAPI = new StreamingAPIManager({
      protocol: 'websocket',
      url: 'ws://localhost:8080/optimization',
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      messageBufferSize: 1000,
      compressionEnabled: true,
      rateLimit: {
        requestsPerSecond: 10,
        burstLimit: 50
      },
      authentication: {
        type: 'token',
        credentials: 'your-auth-token'
      }
    });

    this.optimizationStream = new OptimizationStream({
      protocol: 'websocket',
      url: 'ws://localhost:8080/stream',
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      messageBufferSize: 1000,
      compressionEnabled: true,
      rateLimit: {
        requestsPerSecond: 10,
        burstLimit: 50
      },
      authentication: {
        type: 'token',
        credentials: 'your-auth-token'
      }
    });
  }

  /**
   * Connect to streaming API
   */
  async connectStreaming(): Promise<void> {
    await this.streamingAPI.connect();
  }

  /**
   * Disconnect from streaming API
   */
  disconnectStreaming(): void {
    this.streamingAPI.disconnect();
  }

  /**
   * Get streaming connection status
   */
  getStreamingStatus(): StreamingStatus {
    const connectionStatus = this.streamingAPI.getConnectionStatus();
    return this.convertConnectionStatusToStreamingStatus(connectionStatus);
  }

  /**
   * Get streaming performance metrics
   */
  getStreamingMetrics(): StreamingMetrics {
    const performanceMetrics = this.streamingAPI.getPerformanceMetrics();
    return this.convertPerformanceMetricsToStreamingMetrics(performanceMetrics);
  }

  /**
   * Stream optimization request
   */
  async streamOptimization(
    requestId: string,
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    callback: (_result: OptimizationSuggestions) => void
  ): Promise<void> {
    const wrappedCallback = (result: unknown) => {
      callback(result as OptimizationSuggestions);
    };
    await this.optimizationStream.streamOptimization(requestId, config, usageData, wrappedCallback);
  }

  /**
   * Cancel streaming optimization
   */
  async cancelStreamingOptimization(requestId: string): Promise<void> {
    await this.optimizationStream.cancelOptimization(requestId);
  }

  /**
   * Update streaming configuration
   */
  updateStreamingConfig(config: Partial<Record<string, unknown>>): void {
    this.streamingAPI.updateConfig(config);
  }

  /**
   * Dispose streaming resources
   */
  dispose(): void {
    this.streamingAPI.dispose();
    this.optimizationStream.dispose();
  }

  /**
   * Convert ConnectionStatus to StreamingStatus
   */
  private convertConnectionStatusToStreamingStatus(connectionStatus: ConnectionStatus): StreamingStatus {
    return {
      connected: connectionStatus.connected,
      lastHeartbeat: connectionStatus.lastConnected,
      messageCount: connectionStatus.messageCount,
      errorCount: connectionStatus.errorCount,
      latency: connectionStatus.latency
    };
  }

  /**
   * Convert PerformanceMetrics to StreamingMetrics
   */
  private convertPerformanceMetricsToStreamingMetrics(performanceMetrics: StreamingAPIPerformanceMetrics): StreamingMetrics {
    return {
      messagesPerSecond: performanceMetrics.messagesReceived / (performanceMetrics.connectionUptime / 1000),
      averageLatency: performanceMetrics.averageLatency,
      errorRate: performanceMetrics.errorRate,
      throughput: performanceMetrics.bytesReceived / (performanceMetrics.connectionUptime / 1000),
      memoryUsage: 0 // Not available in StreamingAPIPerformanceMetrics
    };
  }
}
