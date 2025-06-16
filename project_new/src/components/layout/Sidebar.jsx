import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Calendar, Plane, Users, Settings, BarChart, LogOut } from 'lucide-react';

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/schedule', label: 'Flight Schedule', icon: <Calendar size={20} /> },
    { path: '/aircraft', label: 'Aircraft', icon: <Plane size={20} /> },
    { path: '/crew', label: 'Crew', icon: <Users size={20} /> },
    { path: '/optimization', label: 'Optimization', icon: <Settings size={20} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart size={20} /> },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex flex-col w-72 h-full bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between px-4">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 mr-2">
                <Plane size={28} className="transform -rotate-45" />
              </span>
              <span className="font-semibold text-xl text-gray-900">AirOps</span>
            </Link>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={onClose}
              >
                <span className={`mr-3 ${
                  location.pathname === item.path
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto px-4 pb-4">
            <button className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:z-10">
        <div className="flex-1 flex flex-col min-h-0 pt-20 pb-4 overflow-y-auto">
          <nav className="mt-2 flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${
                  location.pathname === item.path
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto px-4 pb-4">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;