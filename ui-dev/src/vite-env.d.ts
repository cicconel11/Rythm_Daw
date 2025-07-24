/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables here as needed
}

// Extend the existing ImportMeta interface
export {};

declare module "vite" {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
