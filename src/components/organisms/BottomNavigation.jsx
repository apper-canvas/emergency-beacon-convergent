import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const BottomNavigation = () => {
  const navItems = [
    {
      id: "alert",
      label: "Alert",
      icon: "AlertTriangle",
      path: "",
      color: "text-red-600"
    },
    {
      id: "active",
      label: "Active",
      icon: "Activity", 
      path: "active",
      color: "text-blue-600"
    },
    {
      id: "facilities",
      label: "Facilities",
      icon: "Building",
      path: "facilities",
      color: "text-green-600"
    },
    {
      id: "history",
      label: "History",
      icon: "Clock",
      path: "history",
      color: "text-purple-600"
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === ""}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200",
              isActive 
                ? `${item.color} scale-110` 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={cn(
                    "transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span className={cn(
                  "transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation