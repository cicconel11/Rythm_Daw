declare module "react" {
  export = React;
  export as namespace React;

  namespace React {
    // Type definitions for React
    interface FunctionComponent<P = {}> {
      (props: P, context?: unknown): ReactElement<unknown, unknown> | null;
      propTypes?: WeakValidationMap<P> | undefined;
      contextTypes?: ValidationMap<unknown> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }

    interface ReactElement<
      P = unknown,
      T extends string | JSXElementConstructor<unknown> =
        | string
        | JSXElementConstructor<unknown>,
    > {
      type: T;
      props: P;
      key: Key | null;
    }

    type JSXElementConstructor<P> =
      | ((props: P) => ReactElement<unknown, unknown> | null)
      | (new (props: P) => Component<P, unknown>);

    type Key = string | number;

    interface Component<P = {}, S = {}, SS = unknown>
      extends ComponentLifecycle<P, S, SS> {}

    interface ComponentLifecycle<P, S, SS = unknown> {
      componentDidMount?(): void;
      shouldComponentUpdate?(
        nextProps: Readonly<P>,
        nextState: Readonly<S>,
        nextContext: unknown,
      ): boolean;
      componentWillUnmount?(): void;
      componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
    }

    interface ErrorInfo {
      componentStack: string;
    }
  }
}
