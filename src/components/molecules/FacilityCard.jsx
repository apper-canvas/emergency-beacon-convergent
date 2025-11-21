import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import { cn } from "@/utils/cn";

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

const availabilityStatus = getAvailabilityStatus(facility.availability_c)

  return (
    <Card className={cn("facility-card", className)}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          facility.type_c === "hospital" && "bg-red-50",
          facility.type_c === "police" && "bg-blue-50"
        )}>
          <ApperIcon 
            name={getTypeIcon(facility.type_c)} 
            size={20} 
            className={getTypeColor(facility.type_c)}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {facility.Name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {facility.type_c} • {facility.distance?.toFixed(1) || 0} km away
            </p>
          </div>
          
          {/* Availability Badge */}
          <div className="mb-3">
            <Badge 
              variant={availabilityStatus.variant}
              size="sm"
            >
              {availabilityStatus.label}
            </Badge>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
          <ApperIcon name="MapPin" size={14} />
          <span className="truncate">{facility.address_c}</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Clock" size={14} />
          <span>Est. response: {facility.response_time_c}</span>
        </div>
          </div>
          
{/* Contact Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => onContact?.(facility)}
          >
            <ApperIcon name="Phone" size={16} className="mr-2" />
            Contact
          </Button>
      </div>
    </Card>
  )
}

export default FacilityCard