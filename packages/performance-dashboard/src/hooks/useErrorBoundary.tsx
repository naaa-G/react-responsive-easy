import React, { useState, useCallback, useEffect } from 'react';

interface _CustomErrorInfo {
  error: Error;
  errorInfo: React.ErrorInfo;
  timestamp: number;
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

/**
 * Custom hook for error boundary functionality
 */
export function useErrorBoundary() {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  });

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  }, []);

  const captureError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setErrorState({
      hasError: true,
      error,
      errorInfo,
      errorId
    });

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error Boundary caught an error:', {
        error,
        errorInfo,
        errorId,
        timestamp: new Date().toISOString()
      });
    }

    // Report error to monitoring service (if available)
    if (typeof window !== 'undefined' && (window as unknown as { errorReporting?: { captureException: (error: Error, context: unknown) => void } }).errorReporting) {
      (window as unknown as { errorReporting: { captureException: (error: Error, context: unknown) => void } }).errorReporting.captureException(error, {
        extra: {
          errorInfo,
          errorId,
          componentStack: errorInfo.componentStack
        }
      });
    }
  }, []);

  return {
    ...errorState,
    resetError,
    captureError
  };
}

/**
 * Higher-order component for error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  return function ErrorBoundaryWrapper(props: P) {
    const { hasError, error, resetError, captureError } = useErrorBoundary();

    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        captureError(new Error(event.message), {
          componentStack: event.filename ? `${event.filename}:${event.lineno}` : 'Unknown'
        } as React.ErrorInfo);
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        captureError(
          event.reason instanceof Error 
            ? event.reason 
            : new Error(String(event.reason)),
          {
            componentStack: 'Unhandled Promise Rejection'
          } as React.ErrorInfo
        );
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, [captureError]);

    if (hasError && error) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent error={error} resetError={resetError} />;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>An error occurred while rendering this component.</p>
            <details>
              <summary>Error Details</summary>
              <pre>{error.message}</pre>
              {error.stack && (
                <pre>{error.stack}</pre>
              )}
            </details>
            <button onClick={resetError} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Default error fallback component
 */
export const DefaultErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <div className="error-fallback">
    <div className="error-fallback-content">
      <h3>⚠️ Component Error</h3>
      <p>The component encountered an unexpected error.</p>
      <details className="error-details">
        <summary>Error Information</summary>
        <div className="error-message">
          <strong>Message:</strong> {error.message}
        </div>
        {error.stack && (
          <div className="error-stack">
            <strong>Stack Trace:</strong>
            <pre>{error.stack}</pre>
          </div>
        )}
      </details>
      <div className="error-actions">
        <button onClick={resetError} className="btn btn-primary">
          Retry
        </button>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-secondary"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);
