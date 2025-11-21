import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import { cn } from "@/utils/cn";

const IncidentCard = ({ incident, onViewDetails, className }) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(incident.CreatedOn)) / 1000)
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
        getStatusColor(incident.status_c),
        className
    )}
    onClick={() => onViewDetails?.(incident)}>
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono font-semibold">#{incident.Name}
                    </span>
                    <Badge variant={getSeverityColor(incident.severity_c)} size="sm">
                        {incident.severity_c}
                    </Badge>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-600 capitalize">
                    {incident.accident_type_c?.replace(/([A-Z])/g, " $1").trim()} • {incident.victim_count_c} person{incident.victim_count_c !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(incident.CreatedOn), {
                    addSuffix: true
                })}
            </div>
            <StatusBadge status={incident.status_c} size="sm" />
        </div>
        <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="MapPin" size={14} />
                <span className="truncate">
                    {incident.location_c ? typeof incident.location_c === "string" ? JSON.parse(incident.location_c).address || incident.location_c : incident.location_c.address || incident.location_c : "Location not available"}
                </span>
            </div>
            {/* Time indicator */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <ApperIcon name="Clock" size={14} />
                <span>
                    {timeElapsed < 60 ? `${timeElapsed}s ago` : timeElapsed < 3600 ? `${Math.floor(timeElapsed / 60)}m ago` : `${Math.floor(timeElapsed / 3600)}h ago`}
                </span>
            </div>
        </div>
        {incident.description_c && <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 italic">"{incident.description_c}"
                            </p>
        </div>}
        {/* Footer */}
        <div
            className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
<div className="flex items-center gap-1">
                <ApperIcon name="Building" size={14} />
                <span>
                    {incident.notified_facilities_c ? typeof incident.notified_facilities_c === "string" ? JSON.parse(incident.notified_facilities_c).length : incident.notified_facilities_c.length : 0} facilities notified
                              </span>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(incident)}
                className="text-gray-700 hover:text-gray-900">View Details
                          <ApperIcon name="ChevronRight" size={16} className="ml-1" />
            </Button>
        </div>
    </div></Card>
  )
}

export default IncidentCard