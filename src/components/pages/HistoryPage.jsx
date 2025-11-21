import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { incidentService } from "@/services/api/incidentService"
import { formatDistanceToNow, format } from "date-fns"

const HistoryPage = () => {
  const [incidents, setIncidents] = useState([])
  const [filteredIncidents, setFilteredIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filterOptions = [
    { id: "all", label: "All Incidents", icon: "Clock" },
    { id: "resolved", label: "Resolved", icon: "CheckCircle" },
    { id: "critical", label: "Critical", icon: "AlertTriangle" },
    { id: "vehicle", label: "Vehicle", icon: "Car" },
    { id: "medical", label: "Medical", icon: "Heart" }
  ]

  useEffect(() => {
    loadIncidentHistory()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [incidents, activeFilter, searchTerm])

  const loadIncidentHistory = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await incidentService.getAll()
      setIncidents(data || [])
    } catch (err) {
      console.error("Error loading incident history:", err)
      setError("Failed to load incident history. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = incidents

    // Apply status/type/severity filter
    if (activeFilter !== "all") {
      if (activeFilter === "resolved") {
        filtered = incidents.filter(incident => incident.status === "resolved")
      } else if (activeFilter === "critical") {
        filtered = incidents.filter(incident => incident.severity === "critical")
      } else {
        filtered = incidents.filter(incident => incident.accidentType === activeFilter)
      }
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(incident =>
        incident.id.toLowerCase().includes(term) ||
        incident.description?.toLowerCase().includes(term) ||
        incident.location.address.toLowerCase().includes(term) ||
        incident.accidentType.toLowerCase().includes(term)
      )
    }

    setFilteredIncidents(filtered)
  }

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredIncidents, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `emergency-incidents-${format(new Date(), "yyyy-MM-dd")}.json`
    
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    
    toast.success("Incident history exported successfully!")
  }

  const handleViewIncident = (incident) => {
    toast.info(`Viewing details for incident ${incident.id}`)
    // In a real app, this would navigate to incident detail page
  }

  const handleRetry = () => {
    loadIncidentHistory()
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "critical"
      case "severe":
        return "severe"
      case "moderate":
        return "moderate"
      default:
        return "default"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "resolved"
      case "responding":
        return "responding"
      case "acknowledged":
        return "acknowledged"
      default:
        return "pending"
    }
  }

  const getAccidentTypeIcon = (type) => {
    switch (type) {
      case "vehicle":
        return "Car"
      case "medical":
        return "Heart"
      case "fire":
        return "Flame"
      case "assault":
        return "Shield"
      case "robbery":
        return "DollarSign"
      default:
        return "AlertTriangle"
    }
  }

  const getHistoryStats = () => {
    return {
      total: incidents.length,
      resolved: incidents.filter(i => i.status === "resolved").length,
      critical: incidents.filter(i => i.severity === "critical").length,
      thisWeek: incidents.filter(i => {
        const incidentDate = new Date(i.timestamp)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return incidentDate > weekAgo
      }).length
    }
  }

  if (loading) return <Loading />
  
  if (error) return (
    <ErrorView 
      error={error}
      onRetry={handleRetry}
    />
  )

  const stats = getHistoryStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <div className="max-w-6xl mx-auto py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Emergency Incident History
            </h1>
            <p className="text-gray-600">
              Complete record of all emergency alerts and their resolutions
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={filteredIncidents.length === 0}
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-800">Total Incidents</div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
            <div className="text-sm text-green-800">Resolved</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.critical}
            </div>
            <div className="text-sm text-red-800">Critical Level</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.thisWeek}
            </div>
            <div className="text-sm text-blue-800">This Week</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search incidents by ID, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={filter.icon} size={16} />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
            <div className="flex items-center gap-2 text-blue-700">
              <ApperIcon name="Search" size={16} />
              <span className="text-sm">
                Found {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''} 
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
          </div>
        )}

        {/* Incidents List */}
        {filteredIncidents.length === 0 ? (
          <Empty
            title="No Incidents Found"
            description={
              searchTerm 
                ? `No incidents match your search for "${searchTerm}". Try different keywords or clear the search.`
                : activeFilter === "all"
                  ? "No emergency incidents have been recorded yet."
                  : `No ${activeFilter} incidents found in the history.`
            }
            icon="Clock"
            actionLabel={searchTerm ? "Clear Search" : "Create New Alert"}
            onAction={searchTerm ? () => setSearchTerm("") : () => window.location.href = "/"}
          />
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.Id} className="p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <ApperIcon 
                        name={getAccidentTypeIcon(incident.accidentType)} 
                        size={20} 
                        className="text-gray-700"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-gray-800">
                          #{incident.id}
                        </span>
                        <Badge variant={getSeverityColor(incident.severity)} size="sm">
                          {incident.severity}
                        </Badge>
                        <Badge variant={getStatusColor(incident.status)} size="sm">
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">
                        {incident.accidentType.replace(/([A-Z])/g, ' $1').trim()} • {incident.victimCount} person{incident.victimCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {format(new Date(incident.timestamp), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={14} />
                    <span className="truncate">{incident.location.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Clock" size={14} />
                      <span>{format(new Date(incident.timestamp), "h:mm a")}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ApperIcon name="Building" size={14} />
                      <span>{incident.notifiedFacilities?.length || 0} facilities</span>
                    </div>
                  </div>

                  {incident.description && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-3">
                      <p className="text-sm text-gray-700 italic">
                        "{incident.description}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Reported at {format(new Date(incident.timestamp), "h:mm a 'on' MMM d, yyyy")}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewIncident(incident)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    View Details
                    <ApperIcon name="ChevronRight" size={16} className="ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage