import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import IncidentCard from "@/components/organisms/IncidentCard"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { incidentService } from "@/services/api/incidentService"

const ActivePage = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadActiveIncidents()
    
    // Set up auto-refresh every 30 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      refreshActiveIncidents()
    }, 30000)

    return () => clearInterval(refreshInterval)
  }, [])

  const loadActiveIncidents = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await incidentService.getActive()
      setIncidents(data || [])
    } catch (err) {
      console.error("Error loading active incidents:", err)
      setError("Failed to load active emergency incidents. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const refreshActiveIncidents = async () => {
    try {
      setRefreshing(true)
      const data = await incidentService.getActive()
      setIncidents(data || [])
    } catch (err) {
      console.error("Error refreshing incidents:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleViewDetails = (incident) => {
    toast.info(`Viewing details for incident ${incident.id}`)
    // In a real app, this would navigate to incident detail page
  }

  const handleRetry = () => {
    loadActiveIncidents()
  }

  if (loading) return <Loading />
  
  if (error) return (
    <ErrorView 
      error={error}
      onRetry={handleRetry}
    />
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl mx-auto py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Active Emergency Incidents
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of ongoing emergency responses
            </p>
          </div>
          
          <button
            onClick={refreshActiveIncidents}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 disabled:opacity-50"
          >
            <ApperIcon 
              name="RefreshCw" 
              size={16} 
              className={refreshing ? "animate-spin" : ""} 
            />
            Refresh
          </button>
        </div>

        {/* Stats Overview */}
        {incidents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {incidents.filter(i => i.status === "pending").length}
              </div>
              <div className="text-sm text-red-800">Pending Response</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {incidents.filter(i => i.status === "acknowledged").length}
              </div>
              <div className="text-sm text-blue-800">Acknowledged</div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {incidents.filter(i => i.status === "responding").length}
              </div>
              <div className="text-sm text-amber-800">En Route</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {incidents.filter(i => i.severity === "critical").length}
              </div>
              <div className="text-sm text-purple-800">Critical Level</div>
            </div>
          </div>
        )}

        {/* Auto-refresh indicator */}
        {refreshing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <ApperIcon name="RefreshCw" size={16} className="animate-spin" />
              <span className="text-sm">Updating incident status...</span>
            </div>
          </div>
        )}

        {/* Incidents List */}
        {incidents.length === 0 ? (
          <Empty
            title="No Active Emergency Incidents"
            description="Great news! There are currently no active emergency incidents requiring immediate attention."
            icon="Shield"
            actionLabel="Create Test Alert"
            onAction={() => window.location.href = "/"}
          />
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.Id}
                incident={incident}
                onViewDetails={handleViewDetails}
                className="animate-fade-in"
              />
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <ApperIcon name="Info" size={16} />
            <span>
              Incident status updates automatically every 30 seconds. Critical alerts are prioritized.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivePage