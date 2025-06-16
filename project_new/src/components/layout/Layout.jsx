import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Bell, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const notifications = [
    { id: 1, message: 'Flight AA123 has been reassigned', time: '5 minutes ago', read: false },
    { id: 2, message: 'Crew member Smith on rest period', time: '30 minutes ago', read: false },
    { id: 3, message: 'Aircraft B737-800 scheduled for maintenance', time: '2 hours ago', read: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        onNotificationClick={() => setNotificationsOpen(true)}
        notificationCount={notifications.filter(n => !n.read).length}
      />
      
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      {/* Notifications Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${notificationsOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <button onClick={() => setNotificationsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            <ul>
              {notifications.map(notification => (
                <li key={notification.id} className={`p-4 border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
                  <div className="flex items-start">
                    <div className={`mt-0.5 mr-3 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`}>
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      {(sidebarOpen || notificationsOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => {
            setSidebarOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;