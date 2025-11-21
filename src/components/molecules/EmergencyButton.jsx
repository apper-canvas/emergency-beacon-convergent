import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const EmergencyButton = ({ onEmergencyAlert, disabled, className }) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handlePress = () => {
    if (disabled) return

    setIsPressed(true)
    setIsConfirming(true)
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }

    // Auto-confirm after 3 seconds or require user confirmation
    const confirmTimer = setTimeout(() => {
      handleConfirm()
    }, 3000)

    // Clean up timer if component unmounts or user confirms manually
    return () => clearTimeout(confirmTimer)
  }

const handleConfirm = () => {
    setIsPressed(false)
    setIsConfirming(false)
    if (onEmergencyAlert) {
      onEmergencyAlert()
    }
  }

  const handleCancel = () => {
    setIsPressed(false)
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div className={cn("text-center", className)}>
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-red-200 mb-4">
          <ApperIcon name="AlertTriangle" size={48} className="text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Confirm Emergency Alert
          </h3>
          <p className="text-gray-600 mb-6">
            This will immediately notify all nearby emergency services
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className="flex-1"
            >
              <ApperIcon name="Send" size={16} className="mr-2" />
              Send Alert
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("text-center", className)}>
      <Button
        size="xl"
        disabled={disabled}
        onClick={handlePress}
        className={cn(
          "w-32 h-32 rounded-full shadow-2xl border-4 border-red-800",
          "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
          "hover:from-red-600 hover:via-red-700 hover:to-red-800",
          "transform hover:scale-110 active:scale-95",
          "transition-all duration-300",
          isPressed && "animate-pulse",
          !disabled && "animate-pulse-slow"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <ApperIcon 
            name="AlertTriangle" 
            size={40} 
            className="text-white drop-shadow-lg" 
          />
          <span className="text-white font-black text-sm drop-shadow-lg">
            EMERGENCY
          </span>
        </div>
      </Button>
      
      <p className="mt-6 text-gray-600 text-center max-w-xs mx-auto">
        Tap the emergency button to instantly alert nearby hospitals and police stations
      </p>
    </div>
  )
}

export default EmergencyButton