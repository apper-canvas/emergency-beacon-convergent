import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const IncidentForm = ({ onSubmit, loading, className }) => {
  const [formData, setFormData] = useState({
accidentType: "",
    victimCount: 1,
    description: "",
    photos: [],
    voiceNotes: []
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
                    : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                )}
              >
                <ApperIcon name={type.icon} size={20} className="mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Victim Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of people affected
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("victimCount", Math.max(1, formData.victimCount - 1))}
              disabled={formData.victimCount <= 1}
            >
              <ApperIcon name="Minus" size={16} />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-gray-900">
              {formData.victimCount}
              </span>
              <div className="text-xs text-gray-500">person{formData.victimCount !== 1 ? 's' : ''}</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("victimCount", formData.victimCount + 1)}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Additional details (optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Provide any additional information that might help responders..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          {/* Photos Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (optional) - up to 5 files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div id="photos-uploader">
                {/* ApperFileFieldComponent will be mounted here */}
              </div>
            </div>
          </div>

          {/* Voice Notes Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Notes (optional) - up to 5 files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div id="voice-notes-uploader">
                {/* ApperFileFieldComponent will be mounted here */}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
<Button
          type="submit"
          className="w-full emergency-button"
          disabled={!formData.accidentType || loading}
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