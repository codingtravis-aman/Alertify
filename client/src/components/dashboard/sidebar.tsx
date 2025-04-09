import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  isActive: boolean;
}

function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-2 py-2 text-sm font-medium rounded-md group cursor-pointer",
          isActive
            ? "text-blue-700 bg-blue-50 border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span className={cn("material-icons w-6 h-6 mr-3", 
          isActive 
            ? "text-blue-600" 
            : "text-gray-400"
        )}>
          {icon}
        </span>
        {label}
      </div>
    </Link>
  );
}

interface SidebarProps {
  user?: {
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
}

export default function Sidebar({ user = { fullName: "Aman Jha", role: "Developer" } }: SidebarProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Websites & Apps", href: "/sites", icon: "devices" },
    { name: "Alerts", href: "/alerts", icon: "notifications" },
    { name: "Reports", href: "/reports", icon: "assessment" },
    { name: "Team", href: "/team", icon: "groups" },
    { name: "Integrations", href: "/integrations", icon: "integration_instructions" },
    { name: "Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <aside className="fixed inset-y-0 z-20 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r shadow-lg lg:z-auto lg:static lg:shadow-none">
      <div className="flex items-center justify-center h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center">
          <span className="material-icons text-white">monitoring</span>
          <span className="ml-2 text-xl font-bold text-white">Alertify</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              icon={item.icon}
              label={item.name}
              href={item.href}
              isActive={location === item.href}
            />
          ))}
        </nav>
        
        <div className="px-4 py-4 mt-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user.fullName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.fullName}</p>
              <p className="text-xs font-medium text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
