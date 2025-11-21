import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { facilityService } from "@/services/api/facilityService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FacilityCard from "@/components/molecules/FacilityCard";

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([])
  const [filteredFacilities, setFilteredFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [userLocation, setUserLocation] = useState(null)
  const [viewMode, setViewMode] = useState("list")

  const filterTypes = [
    { id: "all", label: "All Facilities", icon: "Building" },
    { id: "hospital", label: "Hospitals", icon: "Cross" },
    { id: "police", label: "Police", icon: "Shield" },
    { id: "fire", label: "Fire Department", icon: "Flame" }
  ]

  useEffect(() => {
    getUserLocation()
    loadFacilities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [facilities, activeFilter])

  const getUserLocation = async () => {
    try {
      if (!navigator.geolocation) return

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000
        })
      })

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    } catch (err) {
      console.error("Error getting user location:", err)
    }
  }

  const loadFacilities = async () => {
    try {
      setLoading(true)
      setError("")
      
      let data
      if (userLocation) {
        // Get nearby facilities with distance calculation
        data = await facilityService.getNearby(userLocation, 15)
      } else {
        // Get all facilities without distance
        data = await facilityService.getAll()
      }
      
      setFacilities(data || [])
    } catch (err) {
      console.error("Error loading facilities:", err)
      setError("Failed to load emergency facilities. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

const applyFilters = () => {
    let filtered = facilities

    if (activeFilter !== "all") {
      filtered = facilities.filter(facility => facility.type_c === activeFilter)
    }

    // Sort by distance if available, then by name
    filtered.sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance
      }
      return a.Name.localeCompare(b.Name)
    })

    setFilteredFacilities(filtered)
  }

// Handle facility contact
  const handleContactFacility = (facility) => {
    if (facility.contact_number_c) {
      window.open(`tel:${facility.contact_number_c}`, '_self')
      toast.success(`Calling ${facility.Name}...`)
    } else {
      toast.info(`Contacting ${facility.Name}`)
    }
    // In a real app, this would open contact modal or initiate communication
  }

  const handleRetry = () => {
    loadFacilities()
  }

  const getAvailabilityStats = () => {
    const available = facilities.filter(f => f.availability === "available").length
    const total = facilities.length
    return { available, total }
  }

  if (loading) return <Loading />
  
  if (error) return (
    <ErrorView 
      error={error}
      onRetry={handleRetry}
    />
  )

  const stats = getAvailabilityStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      <div className="max-w-6xl mx-auto py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Emergency Facilities
            </h1>
            <p className="text-gray-600">
              Nearby hospitals, police stations, and emergency services
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <ApperIcon name="List" size={16} />
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <div className="text-sm text-green-800">Available Now</div>
          </div>
          
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {facilities.filter(f => f.type_c === "hospital").length}
            </div>
            <div className="text-xs text-gray-500">hospitals</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {facilities.filter(f => f.type_c === "police").length}
            </div>
            <div className="text-xs text-gray-500">police stations</div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {userLocation ? facilities.filter(f => f.distance && f.distance <= 5).length : "GPS"}
            </div>
            <div className="text-xs text-gray-500">{userLocation ? "within 5km" : "unavailable"}</div>
          </div>
        </div>

{/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTypes.map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center gap-2"
            >
              <ApperIcon name={filter.icon} size={16} />
              {filter.label}
            </Button>
          ))}
        </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-600">
            <ApperIcon name="Loader2" size={20} className="animate-spin" />
            <span>Loading emergency facilities...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <ApperIcon name="AlertTriangle" size={24} className="text-red-600 mx-auto mb-2" />
          <p className="text-red-700 mb-3">Failed to load facilities</p>
          <Button onClick={loadFacilities} size="sm" variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredFacilities.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Building" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
          <p className="text-gray-600 mb-4">
            {activeFilter === "all" 
              ? "No emergency facilities are available in your area."
              : `No ${activeFilter} facilities found.`
            }
          </p>
          <Button onClick={() => setActiveFilter("all")} variant="outline" size="sm">
            Show all facilities
          </Button>
        </div>
      )}

{/* Facilities List */}
        {!loading && !error && filteredFacilities.length > 0 && (
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.Id}
                facility={facility}
                onContact={handleContactFacility}
                className="animate-fade-in"
              />
            ))}
          </div>
        )}
        {/* Emergency Contact Info */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ApperIcon name="Phone" size={24} className="text-red-600" />
            <h3 className="text-xl font-bold text-red-900">
              Emergency Contacts
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-red-900">General Emergency</div>
              <div className="text-red-800">911</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Poison Control</div>
              <div className="text-red-800">1-800-222-1222</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Crisis Hotline</div>
              <div className="text-red-800">988</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilitiesPage