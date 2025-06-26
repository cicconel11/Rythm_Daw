"use client"

import React from 'react'
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Type definitions
type ToastVariant = 'default' | 'destructive'

interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastVariant
  className?: string
  onDismiss?: () => void
}

// Simple Toast Component
export const Toast = (props: ToastProps) => {
  const {
    title,
    description,
    action,
    variant = 'default',
    className,
    onDismiss,
    ...rest
  } = props

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        variant === 'destructive' 
          ? "bg-red-900/90 text-white" 
          : "bg-gray-900/90 text-white",
        className
      )}
      {...rest}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-white/50 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none group-hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Toast Viewport
export const ToastViewport = ({
  className,
  ...rest
}: {
  className?: string
  children?: React.ReactNode
}) => (
  <div
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...rest}
  />
)

// Toast Action
export const ToastAction = ({
  className,
  children,
  onClick,
  disabled,
  type = 'button',
  ...rest
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-700 bg-transparent px-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...rest}
  >
    {children}
  </button>
)

// Simple Toast Provider
export const ToastProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <>{children}</>
}

// Export types
export type { ToastVariant, ToastProps }
