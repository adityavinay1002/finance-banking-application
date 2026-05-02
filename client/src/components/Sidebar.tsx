import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Landmark, History, SendHorizontal, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Banks', icon: Landmark, path: '/dashboard', protected: true },
    { name: 'History', icon: History, path: '/history', protected: true },
    { name: 'Transfer', icon: SendHorizontal, path: '/transfer', protected: true },
    { name: 'Settings', icon: Settings, path: '/settings', protected: true },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4 flex flex-col gap-4">
      <div className="mt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
