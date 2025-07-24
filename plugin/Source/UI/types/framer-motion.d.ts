declare module "framer-motion" {
  export function motion<T extends keyof HTMLElementTagNameMap>(
    component: T,
  ): React.ComponentType<
    React.ComponentPropsWithRef<T> & { layoutId?: string }
  >;

  export const AnimatePresence: React.ComponentType<{
    children: React.ReactNode;
    mode?: "sync" | "wait" | "popLayout";
    initial?: boolean;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    custom?: any;
  }>;
}
