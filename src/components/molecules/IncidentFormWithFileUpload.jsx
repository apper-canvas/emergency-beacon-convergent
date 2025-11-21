import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent"

const IncidentFormWithFileUpload = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    accidentType: "",
    victimCount: 1,
    description: ""
  })
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [uploadedVoiceNotes, setUploadedVoiceNotes] = useState([])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!window.ApperSDK) {
      console.error('ApperSDK not available')
      return
    }

    try {
      // Get files from both uploaders
      const { ApperFileUploader } = window.ApperSDK
      const photos = await ApperFileUploader.FileField.getFiles('photos_c') || uploadedPhotos
      const voiceNotes = await ApperFileUploader.FileField.getFiles('voice_notes_c') || uploadedVoiceNotes
      
      // Combine form data with files
      const completeData = {
        ...formData,
        photos,
        voiceNotes
      }
      
      onSubmit(completeData)
    } catch (error) {
      console.error('Error submitting form with files:', error)
      // Fallback to form data without files
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emergency Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What type of emergency is this?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {accidentTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleInputChange("accidentType", type.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                formData.accidentType === type.id
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
              }`}
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
          <ApperFileFieldComponent
            elementId="photos-uploader"
            config={{
              fieldKey: 'photos_c',
              fieldName: 'photos_c',
              tableName: 'incidents_c',
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
              existingFiles: [],
              fileCount: 0
            }}
          />
        </div>

        {/* Voice Notes Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice Notes (optional) - up to 5 files
          </label>
          <ApperFileFieldComponent
            elementId="voice-notes-uploader"
            config={{
              fieldKey: 'voice_notes_c',
              fieldName: 'voice_notes_c',
              tableName: 'incidents_c',
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
              existingFiles: [],
              fileCount: 0
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full emergency-button"
        disabled={!formData.accidentType || loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <ApperIcon name="Loader2" size={16} className="animate-spin" />
            Submitting Emergency Alert...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ApperIcon name="AlertTriangle" size={16} />
            Submit Emergency Alert
          </div>
        )}
      </Button>
    </form>
  )
}

export default IncidentFormWithFileUpload