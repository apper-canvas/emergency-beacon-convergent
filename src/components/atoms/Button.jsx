import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    secondary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    accent: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl focus:ring-amber-500",
    success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
    outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
    xl: "px-8 py-4 text-xl rounded-2xl"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        "transform hover:scale-105 active:scale-95",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button