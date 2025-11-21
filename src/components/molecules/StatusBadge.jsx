import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const StatusBadge = ({ status, size = "default", showIcon = true, className }) => {
  const statusConfig = {
    pending: {
      label: "Pending Response",
      icon: "Clock",
      variant: "pending"
    },
    acknowledged: {
      label: "Acknowledged",
      icon: "CheckCircle",
      variant: "acknowledged"
    },
    responding: {
      label: "En Route",
      icon: "Truck",
      variant: "responding"
    },
    resolved: {
      label: "Resolved",
      icon: "Check",
      variant: "resolved"
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={cn("gap-1.5", className)}
    >
      {showIcon && <ApperIcon name={config.icon} size={size === "sm" ? 12 : 16} />}
      {config.label}
    </Badge>
  )
}

export default StatusBadge