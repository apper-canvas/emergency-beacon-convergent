import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const LocationDisplay = ({ onLocationUpdate, className }) => {
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = async () => {
    setLoading(true)
    setError("")
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      setLocation(coords)
      
      // Simulate address lookup
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockAddress = `${Math.floor(Math.random() * 999) + 1} Emergency Ave, ${['Downtown', 'Midtown', 'Uptown'][Math.floor(Math.random() * 3)]}, ${['NY', 'CA', 'TX'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 90000) + 10000}`
      setAddress(mockAddress)
      
      if (onLocationUpdate) {
        onLocationUpdate({
          coordinates: coords,
          address: mockAddress
        })
      }
    } catch (err) {
      setError("Unable to get location. Please enable GPS and try again.")
      console.error("Geolocation error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon 
            name="MapPin" 
            size={20} 
            className={cn(
              "transition-colors duration-200",
              loading ? "text-amber-500 animate-pulse" : location ? "text-green-600" : "text-gray-400"
            )} 
          />
          <span className="font-semibold text-gray-900">Current Location</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loading}
          className="text-gray-600 hover:text-gray-800"
        >
          <ApperIcon name="RefreshCw" size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {loading && (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <ApperIcon name="AlertTriangle" size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {location && !loading && !error && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <div className="font-mono">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
          </div>
          {address && (
            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">
              <ApperIcon name="MapPin" size={14} className="inline mr-2 text-gray-500" />
              {address}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ApperIcon name="CheckCircle" size={12} />
            Location confirmed
          </div>
        </div>
      )}
    </Card>
  )
}

export default LocationDisplay