import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const IncidentForm = ({ onSubmit, loading, className }) => {
  const [formData, setFormData] = useState({
    accidentType: "",
    victimCount: 1,
    description: ""
  })

  const accidentTypes = [
    { id: "vehicle", label: "Vehicle Accident", icon: "Car" },
    { id: "medical", label: "Medical Emergency", icon: "Heart" },
    { id: "fire", label: "Fire Emergency", icon: "Flame" },
    { id: "assault", label: "Assault/Violence", icon: "Shield" },
    { id: "robbery", label: "Robbery/Theft", icon: "DollarSign" },
    { id: "other", label: "Other Emergency", icon: "AlertTriangle" }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="FileText" size={20} className="text-gray-700" />
        <span className="font-semibold text-gray-900">Incident Details</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Accident Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Type of Emergency *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {accidentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleInputChange("accidentType", type.id)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2",
                  formData.accidentType === type.id
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={type.icon} size={16} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Victim Count */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of People Involved
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("victimCount", Math.max(1, formData.victimCount - 1))}
              disabled={formData.victimCount <= 1}
              className="w-10 h-10 p-0"
            >
              <ApperIcon name="Minus" size={16} />
            </Button>
            <span className="text-2xl font-bold text-gray-900 w-16 text-center">
              {formData.victimCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("victimCount", Math.min(99, formData.victimCount + 1))}
              disabled={formData.victimCount >= 99}
              className="w-10 h-10 p-0"
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brief Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Provide additional details about the emergency..."
            rows={3}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-colors duration-200"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!formData.accidentType || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={20} className="animate-spin mr-2" />
              Alerting Emergency Services...
            </>
          ) : (
            <>
              <ApperIcon name="Send" size={20} className="mr-2" />
              Submit Emergency Alert
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

export default IncidentForm