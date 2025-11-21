import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No Emergency Alerts", 
  description = "There are currently no active emergency alerts in your area.",
  actionLabel = "Create Emergency Alert",
  onAction,
  icon = "Shield"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={40} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {onAction && (
          <Button
            variant="success"
            onClick={onAction}
            className="w-full"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            {actionLabel}
          </Button>
        )}

        <div className="p-4 bg-white rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <ApperIcon name="CheckCircle" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-green-900 mb-1">
                All Systems Operational
              </h4>
              <p className="text-sm text-green-800">
                Emergency response services are standing by and ready to assist when needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty