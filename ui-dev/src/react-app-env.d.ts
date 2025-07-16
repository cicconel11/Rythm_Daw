/// <reference types="vite/client" />

// This file is used to define global types for the application
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom HTML attributes here if needed
  }
}
