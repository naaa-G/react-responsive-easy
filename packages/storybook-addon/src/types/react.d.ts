// Type declaration to resolve React type conflicts
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

    // Override FunctionComponent to be compatible with Storybook components
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement | null;
      propTypes?: WeakValidationMap<P> | undefined;
      contextTypes?: ValidationMap<any> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }

    // Override Component type to be compatible with Storybook components
    class Component<P = {}, S = {}, SS = any> {
      refs: { [key: string]: ReactInstance };
      state: Readonly<S>;
      props: Readonly<P>;
      context: any;
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
      componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
      componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
      shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
      UNSAFE_componentWillMount?(): void;
      UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
      UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    }
  }
}

// Re-export all React types to ensure consistency
export * from 'react';
