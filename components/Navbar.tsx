import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, BookOpen, Gamepad2, Home, LogIn, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-sky-400 bg-sky-900/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Main Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="bg-sky-600 p-2 rounded-lg">
                  <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">Logic Master</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/')}`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/courses" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/courses')}`}
              >
                <BookOpen className="h-4 w-4" />
                Courses
              </Link>
              <Link 
                to="/games" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/games')}`}
              >
                <Gamepad2 className="h-4 w-4" />
                Games
              </Link>
            </div>
          </div>

          {/* Right Side: Login / User Credentials */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-4 animate-in fade-in duration-300">
                <div className="hidden lg:flex flex-col items-end leading-tight">
                   <span className="text-sm font-medium text-white">Alex Chen</span>
                   <span className="text-xs text-sky-400">Pro Member</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 p-0.5">
                   <div className="h-full w-full rounded-full bg-neutral-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-sky-200" />
                   </div>
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-all shadow-lg shadow-sky-900/20"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-neutral-800 bg-neutral-900/50 flex justify-around p-2 backdrop-blur-md">
         <Link to="/" className={`p-2 rounded-lg ${isActive('/')}`}><Home className="h-5 w-5" /></Link>
         <Link to="/courses" className={`p-2 rounded-lg ${isActive('/courses')}`}><BookOpen className="h-5 w-5" /></Link>
         <Link to="/games" className={`p-2 rounded-lg ${isActive('/games')}`}><Gamepad2 className="h-5 w-5" /></Link>
      </div>
    </nav>
  );
};