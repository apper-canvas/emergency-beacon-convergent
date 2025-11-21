import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { incidentService } from "@/services/api/incidentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import IncidentCard from "@/components/organisms/IncidentCard";

const ActivePage = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString())

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
      setLastUpdate(new Date().toLocaleTimeString())
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
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Error refreshing incidents:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleViewDetails = (incident) => {
toast.info(`Viewing details for incident ${incident.Name}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 border-green-300"
      case "responding":
        return "bg-amber-100 border-amber-300"
      case "acknowledged":
        return "bg-blue-100 border-blue-300"
      default:
        return "bg-red-100 border-red-300"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
        <div
            className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Activity" size={20} className="text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Incidents</h1>
            <p className="text-gray-600">Monitor ongoing emergency situations</p>
        </div>
    </div>
    {/* Refresh Button */}
<div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">Last updated: {lastUpdate}
        </div>
        <Button
            onClick={refreshActiveIncidents}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2">
            <ApperIcon
                name={refreshing ? "Loader2" : "RefreshCw"}
                size={16}
                className={refreshing ? "animate-spin" : ""} />Refresh
                    </Button>
    </div>
    {/* Stats Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
                {incidents.filter(i => i.status_c === "pending").length}
            </div>
            <div className="text-xs text-gray-500">pending</div>
        </Card>
        <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
                {incidents.filter(i => i.status_c === "acknowledged").length}
            </div>
            <div className="text-xs text-gray-500">acknowledged</div>
        </Card>
        <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
                {incidents.filter(i => i.status_c === "responding").length}
            </div>
            <div className="text-xs text-gray-500">responding</div>
        </Card>
        <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
                {incidents.length}
            </div>
            <div className="text-xs text-gray-500">total active</div>
        </Card>
    </div>
    {/* Loading State */}
    {loading && <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-amber-600">
            <ApperIcon name="Loader2" size={20} className="animate-spin" />
            <span>Loading active incidents...</span>
        </div>
    </div>}
{/* Error State */}
    {error && <ErrorView error="Failed to load active incidents" onRetry={loadActiveIncidents} />}
    {/* Incidents List */}
    {!loading && !error && <div className="space-y-4">
        {incidents.map(incident => <IncidentCard
            key={incident.Id}
            incident={incident}
            onViewDetails={handleViewDetails}
            className="animate-fade-in" />)}
    </div>}
    {/* Footer Info */}
    <div
        className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <ApperIcon name="Info" size={16} />
            <span>Incident status updates automatically every 30 seconds. Critical alerts are prioritized.
                            </span>
        </div>
    </div>
</div>
  )
}

export default ActivePage