import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" size={40} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Emergency System Error
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {error || "We're experiencing technical difficulties with the emergency response system. Please try again or contact emergency services directly."}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={onRetry}
            className="w-full"
          >
            <ApperIcon name="RefreshCw" size={20} className="mr-2" />
            Retry Emergency System
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open("tel:911")}
            className="w-full"
          >
            <ApperIcon name="Phone" size={20} className="mr-2" />
            Call 911 Directly
          </Button>
        </div>

        <div className="p-4 bg-white rounded-xl border border-red-200">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-red-900 mb-1">
                Alternative Emergency Contacts
              </h4>
              <p className="text-sm text-red-800">
                If this system continues to fail, please dial 911 immediately or contact your local emergency services directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorView