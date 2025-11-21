import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        
        {/* 404 Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" size={48} className="text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-red-200 rounded-full animate-ping mx-auto"></div>
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-gray-900">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-800">
              Emergency Route Not Found
            </h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            The emergency service you're looking for doesn't exist or has been moved. 
            Let's get you back to safety quickly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Return to Emergency Hub
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ApperIcon name="Phone" size={20} className="text-red-600" />
            <h3 className="text-lg font-bold text-red-900">
              Need Immediate Help?
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-red-900">Emergency Services: </span>
              <a href="tel:911" className="text-red-700 underline hover:text-red-900">
                911
              </a>
            </div>
            <div>
              <span className="font-semibold text-red-900">Crisis Hotline: </span>
              <a href="tel:988" className="text-red-700 underline hover:text-red-900">
                988
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Quick Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => navigate("/active")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <ApperIcon name="Activity" size={14} />
              Active Alerts
            </button>
            <button
              onClick={() => navigate("/facilities")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <ApperIcon name="Building" size={14} />
              Facilities
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <ApperIcon name="Clock" size={14} />
              History
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <ApperIcon name="AlertTriangle" size={14} />
              Create Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound