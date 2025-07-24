/* Catch-all for packages that ship without .d.ts or for local path aliases */
declare module "lucide-react";
declare module "@headlessui/react";
declare module "@/hooks/*";
declare module "@/components/ui/*";
/* SVG / other asset imports */
declare module "*.svg" {
  const url: string;
  export default url;
}
