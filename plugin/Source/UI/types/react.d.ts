declare module "react" {
  export = React;
  export as namespace React;

  namespace React {
    // Type definitions for React
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
      propTypes?: WeakValidationMap<P> | undefined;
      contextTypes?: ValidationMap<any> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }

    interface ReactElement<
      P = any,
      T extends string | JSXElementConstructor<any> =
        | string
        | JSXElementConstructor<any>,
    > {
      type: T;
      props: P;
      key: Key | null;
    }

    type JSXElementConstructor<P> =
      | ((props: P) => ReactElement<any, any> | null)
      | (new (props: P) => Component<P, any>);

    type Key = string | number;

    interface Component<P = {}, S = {}, SS = any>
      extends ComponentLifecycle<P, S, SS> {}

    interface ComponentLifecycle<P, S, SS = any> {
      componentDidMount?(): void;
      shouldComponentUpdate?(
        nextProps: Readonly<P>,
        nextState: Readonly<S>,
        nextContext: any,
      ): boolean;
      componentWillUnmount?(): void;
      componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
    }

    interface ErrorInfo {
      componentStack: string;
    }
  }
}
