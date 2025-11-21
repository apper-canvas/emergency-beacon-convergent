import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const SeveritySelector = ({ onSeverityChange, className }) => {
  const [selectedSeverity, setSelectedSeverity] = useState("severe")

  const severityLevels = [
    {
      id: "critical",
      label: "Critical",
      description: "Life-threatening emergency",
      icon: "AlertTriangle",
      color: "red",
      bgColor: "bg-red-500",
      textColor: "text-white",
      borderColor: "border-red-600"
    },
    {
      id: "severe",
      label: "Severe",
      description: "Serious injuries, immediate help needed",
      icon: "AlertCircle",
      color: "amber",
      bgColor: "bg-amber-500",
      textColor: "text-white",
      borderColor: "border-amber-600"
    },
    {
      id: "moderate",
      label: "Moderate",
      description: "Minor injuries, assistance required",
      icon: "Info",
      color: "yellow",
      bgColor: "bg-yellow-400",
      textColor: "text-gray-900",
      borderColor: "border-yellow-500"
    }
  ]

  const handleSeveritySelect = (severity) => {
    setSelectedSeverity(severity.id)
    if (onSeverityChange) {
      onSeverityChange(severity)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="Gauge" size={20} className="text-gray-700" />
        <span className="font-semibold text-gray-900">Emergency Severity</span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {severityLevels.map((severity) => (
          <Card
            key={severity.id}
            variant={selectedSeverity === severity.id ? "elevated" : "default"}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
              selectedSeverity === severity.id 
                ? "ring-2 ring-offset-2 shadow-lg" 
                : "hover:shadow-md",
              selectedSeverity === severity.id && severity.color === "red" && "ring-red-500",
              selectedSeverity === severity.id && severity.color === "amber" && "ring-amber-500",
              selectedSeverity === severity.id && severity.color === "yellow" && "ring-yellow-400"
            )}
            onClick={() => handleSeveritySelect(severity)}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl flex items-center justify-center",
                severity.bgColor,
                severity.textColor
              )}>
                <ApperIcon name={severity.icon} size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {severity.label}
                  </h3>
                  {selectedSeverity === severity.id && (
                    <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {severity.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SeveritySelector