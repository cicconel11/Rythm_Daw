"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function ToastExample() {
  const { toast } = useToast()

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-white">Toast Notifications</h2>
      
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => {
            toast({
              title: "Default Toast",
              description: "This is a default toast notification.",
            })
          }}
        >
          Show Default Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong!",
            })
          }}
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  )
}
