import React from "react";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  notificationCount?: number;
}

export default function TopBar({ title, onMenuClick, notificationCount = 0 }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button 
          type="button" 
          className="p-1 text-gray-500 rounded-md lg:hidden hover:text-gray-900 focus:outline-none"
          onClick={onMenuClick}
        >
          <span className="material-icons">menu</span>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-1 text-gray-500 bg-white rounded-full hover:text-gray-900 focus:outline-none">
            <span className="material-icons">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
            )}
          </button>
        </div>
        
        <div className="relative">
          <button className="flex items-center p-1 text-sm font-medium text-gray-700 bg-white rounded-full hover:text-gray-900 focus:outline-none">
            <span className="material-icons">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
}
