'use client';

import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #1f2937)',
            color: 'var(--toast-color, #f9fafb)',
            border: '1px solid var(--toast-border, #374151)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f9fafb',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6b7280',
              secondary: '#f9fafb',
            },
          },
        }}
      />
    </>
  );
}
