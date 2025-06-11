import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export function PageNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 shadow-2xl shadow-black/50">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                ${active 
                  ? 'bg-white text-black shadow-lg shadow-white/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                size={18} 
                className={`relative z-10 ${active ? 'text-black' : ''}`} 
              />
              <span 
                className={`relative z-10 text-sm font-medium ${active ? 'text-black' : ''}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}