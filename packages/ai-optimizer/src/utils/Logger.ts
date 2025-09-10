/**
 * Enterprise-grade Logger for AI Optimizer
 * Provides structured logging with different levels and proper error handling
 */

/* eslint-disable no-unused-vars */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}
/* eslint-enable no-unused-vars */

// Note: Use LogLevel enum values directly (e.g., LogLevel.DEBUG) instead of exported constants

// Constants for magic numbers
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB; // 1MB in bytes
const DEFAULT_MAX_FILES = 5;

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  context?: string;
}

export class Logger {
  private config: LoggerConfig;
  private context: string;

  constructor(context: string = 'AIOptimizer', config?: Partial<LoggerConfig>) {
    this.context = context;
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      maxFileSize: DEFAULT_MAX_FILE_SIZE_MB * BYTES_PER_MB, // 10MB
      maxFiles: DEFAULT_MAX_FILES,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatLogEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error : undefined,
    };
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const context = entry.context;
    const message = entry.message;
    const metadata = entry.metadata ? JSON.stringify(entry.metadata, null, 2) : '';
    const error = entry.error ? `\nError: ${entry.error.name}: ${entry.error.message}\n${entry.error.stack}` : '';

    const logMessage = `[${timestamp}] ${levelName} [${context}] ${message}${metadata ? `\n${metadata}` : ''}${error}`;

    // Use proper console methods based on log level
    switch (entry.level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        // eslint-disable-next-line no-console
        console.error(logMessage);
        break;
    }
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.config.enableFile || !this.config.filePath) return;

    try {
      const fs = await import('fs/promises');
      const logLine = `${JSON.stringify(entry)}\n`;
      await fs.appendFile(this.config.filePath, logLine);
    } catch (error) {
      // Fallback to console if file writing fails
      // eslint-disable-next-line no-console
      console.error('Failed to write to log file:', error);
    }
  }

  private async log(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): Promise<void> {
    if (!this.shouldLog(level)) return;

    const entry = this.formatLogEntry(level, message, metadata, error);
    
    this.writeToConsole(entry);
    
    if (this.config.enableFile) {
      await this.writeToFile(entry);
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata).catch(() => {
      // Silently handle logging errors
    });
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata).catch(() => {
      // Silently handle logging errors
    });
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata).catch(() => {
      // Silently handle logging errors
    });
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, metadata, error).catch(() => {
      // Silently handle logging errors
    });
  }

  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, metadata, error).catch(() => {
      // Silently handle logging errors
    });
  }

  // Performance logging methods
  time(label: string): void {
    // eslint-disable-next-line no-console
    console.time(`[${this.context}] ${label}`);
  }

  timeEnd(label: string): void {
    // eslint-disable-next-line no-console
    console.timeEnd(`[${this.context}] ${label}`);
  }

  // Group logging methods
  group(label: string): void {
    // eslint-disable-next-line no-console
    console.group(`[${this.context}] ${label}`);
  }

  groupEnd(): void {
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  // Table logging for structured data
  table(data: unknown[]): void {
    // eslint-disable-next-line no-console
    console.table(data);
  }

  // Trace logging for debugging
  trace(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.trace(`[${this.context}] ${message}`, metadata);
    }
  }

  // Create a child logger with additional context
  child(additionalContext: string): Logger {
    return new Logger(`${this.context}:${additionalContext}`, this.config);
  }

  // Update logger configuration
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Default logger instance
export const logger = new Logger();

// Utility functions for common logging patterns
export const createLogger = (context: string, config?: Partial<LoggerConfig>): Logger => {
  return new Logger(context, config);
};

export const setGlobalLogLevel = (level: LogLevel): void => {
  logger.updateConfig({ level });
};

export const enableFileLogging = (filePath: string): void => {
  logger.updateConfig({ enableFile: true, filePath });
};

export const disableConsoleLogging = (): void => {
  logger.updateConfig({ enableConsole: false });
};
