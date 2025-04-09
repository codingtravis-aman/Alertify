import React, { useState } from "react";
import Sidebar from "./sidebar";
import TopBar from "./topbar";
import { Footer } from "@/components/ui/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Add the app name "Alertify" to the title
  const fullTitle = title.includes("Alertify") ? title : `${title} | Alertify`;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileSidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileSidebar}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <Sidebar />
        </div>
      </div>
      
      {/* Desktop permanent sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <TopBar 
          title={fullTitle} 
          onMenuClick={toggleMobileSidebar} 
          notificationCount={3} 
        />

        <main className="flex-1 px-6 py-6">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
