// Type declaration to resolve React type conflicts between React 18 and 19
import {
  ReactElement,
  ReactNodeArray,
  WeakValidationMap,
  ValidationMap,
  ReactInstance,
  Ref,
  ForwardRefRenderFunction
} from 'react';

declare global {
  namespace React {
    // Override ReactNode to exclude bigint for React 18 compatibility
    type ReactNode = 
      | ReactElement
      | string
      | number
      | boolean
      | null
      | undefined
      | ReactNodeArray;

    // Override FunctionComponent to be compatible with Recharts
    interface FunctionComponent<P = object> {
      (props: P, context?: unknown): ReactElement | null;
      propTypes?: WeakValidationMap<P> | undefined;
      contextTypes?: ValidationMap<unknown> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }

    // Override Component type to be compatible with Recharts
    class Component<P = object, S = object, SS = unknown> {
      refs: { [key: string]: ReactInstance };
      state: Readonly<S>;
      props: Readonly<P>;
      context: unknown;
      setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
        callback?: () => void
      ): void;
      forceUpdate(callback?: () => void): void;
      render(): ReactNode;
      componentDidMount?(): void;
      componentWillUnmount?(): void;
      componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
      componentWillMount?(): void;
      componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: unknown): void;
      componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: unknown): void;
      shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: unknown): boolean;
      UNSAFE_componentWillMount?(): void;
      UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: unknown): void;
      UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: unknown): void;
    }

    // Override ForwardRefExoticComponent to be compatible with Recharts
    interface ForwardRefExoticComponent<P> {
      (props: P & { ref?: Ref<unknown> }): ReactElement | null;
      $$typeof: symbol;
      render: ForwardRefRenderFunction<unknown, P>;
      propTypes?: WeakValidationMap<P> | undefined;
      contextTypes?: ValidationMap<unknown> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }
  }
}

// Re-export all React types to ensure consistency
export * from 'react';
