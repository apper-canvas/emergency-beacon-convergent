import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import { cn } from "@/utils/cn";

const AlertConfirmation = ({ incident, onClose, onViewDetails, className }) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
const elapsed = Math.floor((Date.now() - new Date(incident.CreatedOn)) / 1000)
      setTimeElapsed(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [incident.CreatedOn])

  const formatElapsedTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

  const handleCopyId = () => {
    if (navigator.clipboard && incident?.Name) {
      navigator.clipboard.writeText(incident.Name)
      toast.success(`Incident ID ${incident.Name} copied to clipboard`)
    }
  }
  const handleConfirm = () => {
    toast.success("Emergency alert confirmed and dispatch notified")
    if (onClose) onClose()
  }

  const handleCancel = () => {
    toast.info("Emergency alert cancelled")
    if (onClose) onClose()
  }
return (
    <Card variant="elevated" className={cn("p-6", className)}>
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert Sent</h2>
        <p className="text-gray-600">Your emergency alert has been successfully submitted and emergency services have been notified.</p>
      </div>
      
<div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <span className="text-sm font-semibold text-gray-700">Incident ID</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-lg text-gray-900">{incident.Name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyId}
                className="text-gray-500 hover:text-gray-700">
                <ApperIcon name="Copy" size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <StatusBadge status={incident.status_c} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <ApperIcon name="Clock" size={24} className="text-blue-600 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-blue-900">
              {formatElapsedTime(timeElapsed)}
            </div>
            <span className="text-sm text-blue-700">Time Elapsed</span>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <ApperIcon name="Users" size={24} className="text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {incident.notified_facilities_c ? typeof incident.notified_facilities_c === "string" ? JSON.parse(incident.notified_facilities_c).length : incident.notified_facilities_c.length : 0}
            </div>
            <div className="text-xs text-gray-500">facilities notified</div>
          </div>
        </div>
{/* Emergency Details */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-red-900 capitalize">
                {incident.accident_type_c?.replace(/([A-Z])/g, " $1").trim()} Emergency
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-red-600 font-medium">Severity:</span>
                  <span className="ml-1 capitalize text-red-800">{incident.severity_c}</span>
                </div>
                <div>
                  <span className="text-red-600 font-medium">Victims:</span>
                  <span className="ml-1 text-red-800">{incident.victim_count_c} person{incident.victim_count_c !== 1 ? "s" : ""}</span>
                </div>
              </div>
              {incident.description_c && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 italic">"{incident.description_c}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <ApperIcon name="MapPin" size={20} className="text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Emergency Location</h4>
              <p className="text-sm text-gray-600">
                {incident.location_c ? typeof incident.location_c === "string" ? JSON.parse(incident.location_c).address || incident.location_c : incident.location_c.address || incident.location_c : "Location not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Button
          onClick={handleConfirm}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <ApperIcon name="CheckCircle" size={20} />
          Confirm Alert
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <ApperIcon name="X" size={20} />
          Cancel Alert
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <Button
          onClick={onViewDetails}
          variant="ghost"
          className="w-full text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <ApperIcon name="Eye" size={16} />
          View Details
        </Button>
        <Button
          onClick={() => window.open(`tel:911`)}
          variant="ghost"
          className="w-full text-red-600 hover:bg-red-50 font-medium py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <ApperIcon name="Phone" size={16} />
          Call 911
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Alert submitted at {format(new Date(incident.CreatedOn), "h:mm a 'on' MMM d, yyyy")}
        </p>
      </div>
    </Card>
  )
}

export default AlertConfirmation