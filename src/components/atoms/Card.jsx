import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
    elevated: "bg-white shadow-lg hover:shadow-xl border-0",
    glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Card.displayName = "Card"

export default Card