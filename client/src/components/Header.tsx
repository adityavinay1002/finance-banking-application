import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-2 text-white">
        <Landmark size={28} className="text-blue-500" />
        <h1 className="text-2xl font-bold tracking-tight">BLUE WAVE BANKING</h1>
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 text-white bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
            >
              <User size={20} />
              <span className="font-medium">{user.name}</span>
              <ChevronDown size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 rounded-lg w-full text-left text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 text-white hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
