'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Configure Monaco Editor environment for web workers
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: string, label: string) {
      // Use CDN for web workers in development
      if (label === 'typescript' || label === 'javascript') {
        return `https://unpkg.com/monaco-editor@latest/min/vs/language/typescript/ts.worker.js`;
      }
      return `https://unpkg.com/monaco-editor@latest/min/vs/editor/editor.worker.js`;
    },
    getWorker: function (moduleId: string, label: string): Worker {
      // Create a minimal worker implementation for environments where web workers are not supported
      const worker = {
        postMessage: function (message: any) {},
        addEventListener: function (type: string, listener: EventListener) {},
        removeEventListener: function (type: string, listener: EventListener) {},
        terminate: function () {},
        dispatchEvent: function (event: Event) { return false; },
        onerror: null as any,
        onmessage: null as any,
        onmessageerror: null as any
      } as Worker;
      
      return worker;
    }
  };
}

// Dynamically import Monaco Editor to avoid SSR issues
let monaco: typeof import('monaco-editor') | null = null;

// Configure Monaco Editor for React/TypeScript
const configureMonaco = () => {
  if (!monaco) return;
  
  // TypeScript compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    strict: false,
    skipLibCheck: true
  });

  // JavaScript language features
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    strict: false,
    skipLibCheck: true
  });

  // Add React types
  const reactTypes = `
    declare module 'react' {
      export = React;
      export as namespace React;
      namespace React {
        type ReactElement<P = any> = {
          type: any;
          props: P;
          key: string | number | null;
        };
        type ReactNode = ReactElement | string | number | boolean | null | undefined;
        interface FunctionComponent<P = {}> {
          (props: P): ReactElement | null;
        }
        type FC<P = {}> = FunctionComponent<P>;
        function createElement<P>(
          type: any,
          props?: P,
          ...children: ReactNode[]
        ): ReactElement<P>;
        const version: string;
      }
    }
  `;

  const responsiveEasyTypes = `
    declare module '@react-responsive-easy/core' {
      export interface Breakpoint {
        name: string;
        width: number;
        height: number;
        alias: string;
      }
      
      export interface ResponsiveConfig {
        base: Breakpoint;
        breakpoints: Breakpoint[];
        strategy: {
          mode: 'scale' | 'step';
          origin: 'top-left' | 'center';
          tokens: Record<string, any>;
        };
      }
      
      export interface ResponsiveProviderProps {
        config: ResponsiveConfig;
        initialBreakpoint?: Breakpoint | string;
        debug?: boolean;
      }
      
      export const ResponsiveProvider: React.FC<React.PropsWithChildren<ResponsiveProviderProps>>;
      export function useResponsiveValue<T>(value: T): T;
      export function useScaledStyle(styles: React.CSSProperties): React.CSSProperties;
      export function useBreakpoint(): Breakpoint;
    }
  `;

  // Add type definitions
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactTypes,
    'file:///node_modules/@types/react/index.d.ts'
  );

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    responsiveEasyTypes,
    'file:///node_modules/@react-responsive-easy/core/index.d.ts'
  );
};

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  height?: string;
  className?: string;
  readOnly?: boolean;
  minimap?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  automaticLayout?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  height = '400px',
  className,
  readOnly = false,
  minimap = false,
  lineNumbers = 'on',
  wordWrap = 'on',
  automaticLayout = true,
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Load Monaco Editor dynamically
  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window !== 'undefined' && !monaco) {
        monaco = await import('monaco-editor');
        configureMonaco();
        setIsConfigured(true);
      }
    };
    
    loadMonaco();
  }, []);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || !isConfigured || !monaco) return;

    const editorInstance = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme,
      readOnly,
      minimap: { enabled: minimap },
      lineNumbers,
      wordWrap,
      automaticLayout,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      lineHeight: 1.5,
      padding: { top: 16, bottom: 16 },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorSmoothCaretAnimation: 'on',
      cursorBlinking: 'smooth',
      renderWhitespace: 'selection',
      renderLineHighlight: 'line',
      selectionHighlight: false,
      occurrencesHighlight: 'off',
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showModules: true,
        showProperties: true,
        showMethods: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true,
      },
      parameterHints: {
        enabled: true,
      },
      formatOnPaste: true,
      formatOnType: true,
    });

    setEditor(editorInstance);

    // Handle value changes
    const disposable = editorInstance.onDidChangeModelContent(() => {
      const newValue = editorInstance.getValue();
      onChange(newValue);
    });

    return () => {
      disposable.dispose();
      editorInstance.dispose();
    };
  }, [isConfigured, language, theme, readOnly, minimap, lineNumbers, wordWrap, automaticLayout]);

  // Update value when prop changes
  useEffect(() => {
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [editor, value]);

  // Update theme
  useEffect(() => {
    if (editor && monaco) {
      monaco.editor.setTheme(theme);
    }
  }, [editor, theme]);

  return (
    <div 
      className={cn('rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative', className)}
      style={{ height }}
    >
      {!isConfigured && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
            <span>Loading editor...</span>
          </div>
        </div>
      )}
      <div ref={editorRef} className="h-full" />
    </div>
  );
}
