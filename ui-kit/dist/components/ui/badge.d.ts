import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (props?: ({
    variant?: "secondary" | "default" | "destructive" | "outline" | null | undefined;
} & import("class-variance-authority/dist/types.js").ClassProp) | undefined) => string;
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): import("react/jsx-runtime.js").JSX.Element;
export { Badge, badgeVariants };
//# sourceMappingURL=badge.d.ts.map