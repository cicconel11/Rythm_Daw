declare module "react/jsx-runtime" {
  export function jsx(
    type: unknown,
    props: unknown,
    key?: unknown,
  ): React.ReactElement;

  export function jsxs(
    type: unknown,
    props: unknown,
    key?: unknown,
  ): React.ReactElement;

  export const Fragment: unique symbol;
}
