import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    pending: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-blue-100 text-blue-800 border-blue-200", 
    responding: "bg-amber-100 text-amber-800 border-amber-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    critical: "bg-red-500 text-white border-red-600",
    severe: "bg-amber-500 text-white border-amber-600",
    moderate: "bg-yellow-400 text-gray-900 border-yellow-500"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge