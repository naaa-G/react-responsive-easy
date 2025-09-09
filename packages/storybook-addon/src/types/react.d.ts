// Type declaration to resolve React type conflicts

/* eslint-disable no-unused-vars */
declare global {
  namespace React {
    // Override ReactNode to exclude bigint for React 18 compatibility
    type ReactNode = 
      | React.ReactElement
      | string
      | number
      | boolean
      | null
      | undefined
      | React.ReactNodeArray;

    // Override FunctionComponent to be compatible with Storybook components
    interface FunctionComponent<P = {}> {
       
      (_props: P, _context?: unknown): React.ReactElement | null;
      propTypes?: React.WeakValidationMap<P> | undefined;
      contextTypes?: React.ValidationMap<unknown> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }

    // Override Component type to be compatible with Storybook components
    class Component<P = {}, S = {}, SS = unknown> {
      refs: { [key: string]: React.ReactInstance };
      state: Readonly<S>;
      props: Readonly<P>;
      context: unknown;
       
      setState<K extends keyof S>(
        state: ((_prevState: Readonly<S>, _props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
        _callback?: () => void
      ): void;
       
      forceUpdate(_callback?: () => void): void;
      render(): React.ReactNode;
      componentDidMount?(): void;
      componentWillUnmount?(): void;
       
      componentDidUpdate?(_prevProps: Readonly<P>, _prevState: Readonly<S>, _snapshot?: SS): void;
      componentWillMount?(): void;
       
      componentWillReceiveProps?(_nextProps: Readonly<P>, _nextContext: unknown): void;
       
      componentWillUpdate?(_nextProps: Readonly<P>, _nextState: Readonly<S>, _nextContext: unknown): void;
       
      shouldComponentUpdate?(_nextProps: Readonly<P>, _nextState: Readonly<S>, _nextContext: unknown): boolean;
      UNSAFE_componentWillMount?(): void;
       
      UNSAFE_componentWillReceiveProps?(_nextProps: Readonly<P>, _nextContext: unknown): void;
       
      UNSAFE_componentWillUpdate?(_nextProps: Readonly<P>, _nextState: Readonly<S>, _nextContext: unknown): void;
    }
  }
}

// Re-export all React types to ensure consistency
export * from 'react';
