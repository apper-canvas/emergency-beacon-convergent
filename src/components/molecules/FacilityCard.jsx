import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import StatusBadge from "@/components/molecules/StatusBadge"
import { cn } from "@/utils/cn"

const FacilityCard = ({ facility, onContact, className }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "hospital":
        return "Cross"
      case "police":
        return "Shield"
      default:
        return "MapPin"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "hospital":
        return "text-red-600"
      case "police":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getAvailabilityStatus = (availability) => {
    switch (availability) {
      case "available":
        return { variant: "resolved", label: "Available" }
      case "busy":
        return { variant: "responding", label: "Busy" }
      case "unavailable":
        return { variant: "pending", label: "Unavailable" }
      default:
        return { variant: "acknowledged", label: "Unknown" }
    }
  }

  const availabilityStatus = getAvailabilityStatus(facility.availability)

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-gray-100",
            facility.type === "hospital" && "bg-red-50",
            facility.type === "police" && "bg-blue-50"
          )}>
            <ApperIcon 
              name={getTypeIcon(facility.type)} 
              size={20} 
              className={getTypeColor(facility.type)}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {facility.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {facility.type} • {facility.distance.toFixed(1)} km away
            </p>
          </div>
        </div>
        <StatusBadge 
          status={availabilityStatus.variant} 
          size="sm"
          className="text-xs"
        />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" size={14} />
          <span className="truncate">{facility.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" size={14} />
          <span>Est. response: {facility.responseTime}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`tel:${facility.contactNumber}`)}
          className="flex-1"
        >
          <ApperIcon name="Phone" size={16} className="mr-2" />
          Call
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onContact?.(facility)}
          className="flex-1"
        >
          <ApperIcon name="MessageSquare" size={16} className="mr-2" />
          Contact
        </Button>
      </div>
    </Card>
  )
}

export default FacilityCard