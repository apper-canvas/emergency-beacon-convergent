import { NavLink } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: 'Layout'
    },
    {
      name: 'Work Items',
      href: '/work-items',
      icon: 'Briefcase'
    },
    {
      name: 'Profile',
      href: '/profile', 
      icon: 'User'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center p-3 rounded-lg transition-colors min-w-0",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )
            }
          >
            <ApperIcon name={item.icon} size={24} className="mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
</NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation