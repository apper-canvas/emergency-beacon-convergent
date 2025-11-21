import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import EmergencyButton from "@/components/molecules/EmergencyButton"
import LocationDisplay from "@/components/molecules/LocationDisplay"
import SeveritySelector from "@/components/molecules/SeveritySelector"
import IncidentForm from "@/components/molecules/IncidentForm"
import AlertConfirmation from "@/components/organisms/AlertConfirmation"
import { incidentService } from "@/services/api/incidentService"
import { facilityService } from "@/services/api/facilityService"

const AlertPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState("emergency") // emergency, severity, details, confirmation
  const [loading, setLoading] = useState(false)
  const [locationData, setLocationData] = useState(null)
  const [severityData, setSeverityData] = useState(null)
  const [submittedIncident, setSubmittedIncident] = useState(null)

  const handleEmergencyAlert = () => {
    if (!locationData) {
      toast.error("Location is required for emergency alerts")
      return
    }
    setStep("severity")
  }

  const handleSeveritySelect = (severity) => {
    setSeverityData(severity)
    setStep("details")
  }

  const handleLocationUpdate = (location) => {
    setLocationData(location)
  }

  const handleFormSubmit = async (formData) => {
    if (!locationData || !severityData) {
      toast.error("Missing required emergency information")
      return
    }

    setLoading(true)
    
    try {
      // Get nearby facilities for notification
      const nearbyFacilities = await facilityService.getNearby(
        locationData.coordinates, 
        10
      )
      
      const notifiedFacilities = nearbyFacilities
        .filter(f => f.availability === "available")
        .slice(0, 5)
        .map(f => f.id)

      const incidentData = {
        location: {
          address: locationData.address,
          coordinates: locationData.coordinates
        },
        coordinates: locationData.coordinates,
        severity: severityData.id,
        accidentType: formData.accidentType,
        victimCount: formData.victimCount,
        description: formData.description,
        notifiedFacilities
      }

      const newIncident = await incidentService.create(incidentData)
      
      setSubmittedIncident(newIncident)
      setStep("confirmation")
      
      toast.success(
        `Emergency alert sent successfully! Incident ID: ${newIncident.id}`,
        { autoClose: 5000 }
      )

    } catch (error) {
      console.error("Error submitting emergency alert:", error)
      toast.error("Failed to submit emergency alert. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    navigate("/active")
  }

  const handleStartOver = () => {
    setStep("emergency")
    setLocationData(null)
    setSeverityData(null)
    setSubmittedIncident(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4">
      <div className="max-w-2xl mx-auto py-6">
        
        {step === "emergency" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Alert System
              </h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Instantly notify nearby emergency services of accidents and emergencies
              </p>
            </div>

            <LocationDisplay
              onLocationUpdate={handleLocationUpdate}
              className="mb-8"
            />

            <div className="flex justify-center">
              <EmergencyButton
                onEmergencyAlert={handleEmergencyAlert}
                disabled={!locationData}
              />
            </div>

            {!locationData && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-800 text-sm">
                  Please allow location access to enable emergency alerts
                </p>
              </div>
            )}
          </div>
        )}

        {step === "severity" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Emergency Severity Level
              </h2>
              <p className="text-gray-600">
                Select the severity level that best describes this emergency
              </p>
            </div>

            <SeveritySelector
              onSeverityChange={handleSeveritySelect}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep("emergency")}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Incident Details
              </h2>
              <p className="text-gray-600">
                Provide additional information to help emergency responders
              </p>
            </div>

            <IncidentForm
              onSubmit={handleFormSubmit}
              loading={loading}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep("severity")}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === "confirmation" && submittedIncident && (
          <div className="space-y-6">
            <AlertConfirmation
              incident={submittedIncident}
              onClose={handleStartOver}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertPage