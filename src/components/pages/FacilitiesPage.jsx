import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FacilityCard from "@/components/molecules/FacilityCard"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { facilityService } from "@/services/api/facilityService"

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
      filtered = facilities.filter(facility => facility.type === activeFilter)
    }

    // Sort by distance if available, then by name
    filtered.sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance
      }
      return a.name.localeCompare(b.name)
    })

    setFilteredFacilities(filtered)
  }

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
  }

  const handleContactFacility = (facility) => {
    toast.info(`Contacting ${facility.name}`)
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
              {facilities.filter(f => f.type === "hospital").length}
            </div>
            <div className="text-sm text-blue-800">Hospitals</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {facilities.filter(f => f.type === "police").length}
            </div>
            <div className="text-sm text-purple-800">Police Stations</div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {userLocation ? facilities.filter(f => f.distance && f.distance <= 5).length : "GPS"}
            </div>
            <div className="text-sm text-amber-800">Within 5km</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={filter.icon} size={16} />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Location Status */}
        {userLocation ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <ApperIcon name="MapPin" size={16} />
              <span className="text-sm">Showing facilities sorted by distance from your location</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <ApperIcon name="MapPin" size={16} />
              <span className="text-sm">Enable location access to see nearby facilities first</span>
            </div>
          </div>
        )}

        {/* Facilities List/Grid */}
        {filteredFacilities.length === 0 ? (
          <Empty
            title="No Facilities Found"
            description={`No ${activeFilter === "all" ? "emergency facilities" : activeFilter + " facilities"} are currently available in your area.`}
            icon="Building"
            actionLabel="View All Facilities"
            onAction={() => handleFilterChange("all")}
          />
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
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