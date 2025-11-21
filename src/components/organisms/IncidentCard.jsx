import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import StatusBadge from "@/components/molecules/StatusBadge"
import { cn } from "@/utils/cn"
import { formatDistanceToNow } from "date-fns"

const IncidentCard = ({ incident, onViewDetails, className }) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(incident.timestamp)) / 1000)
      setTimeElapsed(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [incident.timestamp])

  const formatTimeElapsed = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "border-green-200 bg-green-50"
      case "responding":
        return "border-amber-200 bg-amber-50"
      case "acknowledged":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-red-200 bg-red-50"
    }
  }

  return (
    <Card 
      variant="elevated" 
      className={cn(
        "p-5 border-l-4 transition-all duration-200 hover:shadow-lg",
        getStatusColor(incident.status),
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
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
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {incident.accidentType.replace(/([A-Z])/g, ' $1').trim()} • {incident.victimCount} person{incident.victimCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <StatusBadge status={incident.status} size="sm" />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" size={14} />
          <span className="truncate">{incident.location.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={14} />
            <span>{formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Elapsed:</span>
            <span className="font-mono text-lg font-bold text-gray-900">
              {formatTimeElapsed(timeElapsed)}
            </span>
          </div>
        </div>

        {incident.description && (
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 italic">
              "{incident.description}"
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <ApperIcon name="Building" size={14} />
          <span>{incident.notifiedFacilities?.length || 0} facilities notified</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails?.(incident)}
          className="text-gray-700 hover:text-gray-900"
        >
          View Details
          <ApperIcon name="ChevronRight" size={16} className="ml-1" />
        </Button>
      </div>
    </Card>
  )
}

export default IncidentCard