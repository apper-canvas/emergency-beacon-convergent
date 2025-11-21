import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { incidentService } from "@/services/api/incidentService";
import { facilityService } from "@/services/api/facilityService";
import ApperIcon from "@/components/ApperIcon";
import AlertConfirmation from "@/components/organisms/AlertConfirmation";
import EmergencyButton from "@/components/molecules/EmergencyButton";
import IncidentForm from "@/components/molecules/IncidentForm";
import LocationDisplay from "@/components/molecules/LocationDisplay";
import SeveritySelector from "@/components/molecules/SeveritySelector";

const AlertPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState("emergency") // emergency, severity, details, confirmation
  const [loading, setLoading] = useState(false)
  const [locationData, setLocationData] = useState(null)
  const [submittedIncident, setSubmittedIncident] = useState(null)
  const [severityData, setSeverityData] = useState(null)

const handleEmergencyAlert = async () => {
    if (!locationData) {
      toast.error("Location data is required for emergency alerts. Please wait for location to load or refresh the page.")
      return
    }
    
    // Send emergency alert directly with default severity and minimal data
    setLoading(true)
    
    try {
      // Get nearby facilities for notification
      const nearbyFacilities = await facilityService.getNearby(
        locationData.coordinates, 
        10
      )
      
      const notifiedFacilities = nearbyFacilities
        .filter(f => f.availability_c === "available")
        .slice(0, 5)
        .map(f => f.Id)

      const incidentData = {
        location: {
          address: locationData.address,
          coordinates: locationData.coordinates
        },
        coordinates: locationData.coordinates,
        severity: "high", // Default severity for emergency alerts
        accidentType: "emergency",
        victimCount: 1,
        description: "Emergency alert sent via emergency button",
        photos: [],
        voiceNotes: [],
        notifiedFacilities
      }

      const newIncident = await incidentService.create(incidentData)

      if (newIncident) {
        setSubmittedIncident(newIncident)
        setStep("confirmation")
        toast.success(
          `Emergency alert sent successfully! Incident ID: ${newIncident.Name}`,
          { autoClose: 5000 }
        )
      }

    } catch (error) {
      console.error("Error submitting emergency alert:", error)
      toast.error("Failed to submit emergency alert. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSeveritySelect = (severity) => {
    setSeverityData(severity)
    setStep("details")
  }

  const handleLocationUpdate = (location) => {
    setLocationData(location)
  }

const handleFormSubmit = async (formData) => {
    if (!locationData) {
      toast.error("Missing required location information")
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
        .filter(f => f.availability_c === "available")
        .slice(0, 5)
        .map(f => f.Id)

      const incidentData = {
        location: {
          address: locationData.address,
          coordinates: locationData.coordinates
        },
        coordinates: locationData.coordinates,
        severity: "high", // Default severity for emergency alerts
        accidentType: formData.accidentType,
        victimCount: formData.victimCount,
        description: formData.description,
        photos: formData.photos || [],
        voiceNotes: formData.voiceNotes || [],
        notifiedFacilities
      }

const newIncident = await incidentService.create(incidentData)

      if (newIncident) {
        setSubmittedIncident(newIncident)
        setStep("confirmation")
        toast.success(
          `Emergency alert sent successfully! Incident ID: ${newIncident.Name}`,
          { autoClose: 5000 }
        )
      }

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
                disabled={!locationData || loading}
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

{loading && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sending Emergency Alert...
            </h2>
            <p className="text-gray-600">
              Please wait while we notify emergency services and nearby facilities
            </p>
          </div>
        )}

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