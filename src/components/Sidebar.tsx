import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, Settings, BarChart3 } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/requests", label: "Requests", icon: <FileText size={18} /> },
    { to: "/executors", label: "Executors", icon: <Settings size={18} /> },
    { to: "/metrics", label: "Executor Metrics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-200 w-64 shadow-lg z-50 transform 
      ${isOpen ? "translate-x-0" : "-translate-x-64"} 
      transition-transform duration-300 md:translate-x-0`}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        SWRC Dashboard
      </div>
      <nav className="flex flex-col p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md mb-1 transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
