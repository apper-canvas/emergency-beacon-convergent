import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import StatusBadge from "@/components/molecules/StatusBadge"
import { cn } from "@/utils/cn"
import { format } from "date-fns"

const AlertConfirmation = ({ incident, onClose, onViewDetails, className }) => {
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

  const copyIncidentId = () => {
    navigator.clipboard.writeText(incident.id)
    // Toast notification would go here
  }

  return (
    <Card variant="elevated" className={cn("p-6", className)}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emergency Alert Sent
        </h2>
        <p className="text-gray-600">
          Your emergency alert has been successfully submitted and emergency services have been notified.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <span className="text-sm font-semibold text-gray-700">Incident ID</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-lg text-gray-900">{incident.id}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyIncidentId}
                className="p-1"
              >
                <ApperIcon name="Copy" size={16} />
              </Button>
            </div>
          </div>
          <StatusBadge status={incident.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <ApperIcon name="Clock" size={24} className="text-blue-600 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-blue-900">
              {formatTimeElapsed(timeElapsed)}
            </div>
            <span className="text-sm text-blue-700">Time Elapsed</span>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <ApperIcon name="Users" size={24} className="text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {incident.notifiedFacilities?.length || 0}
            </div>
            <span className="text-sm text-green-700">Facilities Notified</span>
          </div>
        </div>

        <div className="p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-xl">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={20} className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">
                What happens next?
              </h4>
              <p className="text-sm text-amber-800">
                Emergency services are being alerted based on your location and severity level. 
                You should receive confirmation calls within 2-5 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onViewDetails}
          className="w-full"
        >
          <ApperIcon name="Eye" size={20} className="mr-2" />
          View Incident Details
        </Button>
        
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full"
        >
          Close Confirmation
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Alert submitted at {format(new Date(incident.timestamp), "h:mm a 'on' MMM d, yyyy")}
        </p>
      </div>
    </Card>
  )
}

export default AlertConfirmation