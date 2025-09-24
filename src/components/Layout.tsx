import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-950 ml-64 transition-all overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 overflow-x-auto">{children}</main>
     </div>
    </div>
  );
};

export default Layout;
