"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();
  const { theme } = useTheme();

  return (
    <ToastProvider>
      <div className="fixed top-0 right-0 z-50 w-full max-w-xs p-4">
        {toasts.map(({ id, title, description, variant, onDismiss }) => (
          <div key={id} className="mb-2">
            <Toast
              title={title}
              description={description}
              variant={variant}
              onDismiss={onDismiss}
              className={theme === "dark" ? "dark" : ""}
            />
          </div>
        ))}
      </div>
    </ToastProvider>
  );
}
