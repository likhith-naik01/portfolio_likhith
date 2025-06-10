import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Frame } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Frame className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">3D Experience</span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/services') 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contact') 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}