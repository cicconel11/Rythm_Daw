declare module 'react/jsx-runtime' {
  export function jsx(
    type: any,
    props: any,
    key?: any
  ): React.ReactElement;

  export function jsxs(
    type: any,
    props: any,
    key?: any
  ): React.ReactElement;

  export const Fragment: unique symbol;
}
