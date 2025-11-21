import ApperIcon from "@/components/ApperIcon"

const Loading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
            <ApperIcon name="AlertTriangle" size={32} className="text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-red-200 rounded-full animate-ping"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Loading Emergency System
          </h3>
          <p className="text-gray-600">
            Initializing emergency response services...
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Loading