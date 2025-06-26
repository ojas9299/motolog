import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className={`z-50 overflow-hidden rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-md ${className}`}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName 