import { cn } from "../lib/utils.js";
type BadgeProps = { variant?: "primary" | "secondary" };
export const Badge = ({
  variant = "primary",
  className,
  ...props
}: BadgeProps & { className?: string }) => (
  <span
    {...props}
    className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
      variant === "secondary"
        ? "bg-gray-100 text-gray-800"
        : "bg-blue-600 text-white",
      className,
    )}
  />
);
