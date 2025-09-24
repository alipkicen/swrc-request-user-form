import React from "react";
import { Menu, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header
      className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 shadow-md sticky top-0 z-50"
      style={{ position: "sticky", top: 0 }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded hover:bg-gray-700"
      >
        <Menu size={22} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-4 relative">
        <input
          type="text"
          placeholder="Search requests, executors..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
      </div>

      {/* Profile */}
      <div className="flex items-center space-x-4">
        <span className="hidden sm:block">Hi, User</span>
        <img
          /*src="https://i.pravatar.cc/30"*/
          alt="profile"
          className="rounded-full w-8 h-8"
        />
      </div>
    </header>
  );
};

export default Header;
