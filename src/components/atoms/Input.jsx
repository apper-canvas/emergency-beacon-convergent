import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "transition-colors duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input