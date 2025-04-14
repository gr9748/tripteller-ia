
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Globe, PlaneTakeoff, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useMobileCheck } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMobileCheck();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <PlaneTakeoff className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-900 dark:text-white bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              TripTales
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Your journey, your story
            </span>
          </div>
        </Link>

        {!isMobile && (
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Globe className="h-4 w-4 mr-1.5" />
              <span>Explore</span>
            </Link>
            <Link
              to="/faq"
              className="flex items-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>Destinations</span>
            </Link>
            <Link
              to="/faq"
              className="flex items-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Heart className="h-4 w-4 mr-1.5" />
              <span>Travel Tips</span>
            </Link>
          </div>
        )}

        {/* Authentication buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                className="p-0 h-10 w-10 rounded-full"
              >
                <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-indigo-500 dark:ring-indigo-400">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {getInitials(user?.user_metadata?.full_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </>
          ) : (
            <>
              {!isMobile && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Login
                </Button>
              )}
              <Button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                Get Started
              </Button>
            </>
          )}

          {isMobile && (
            <Button
              onClick={toggleMenu}
              variant="ghost"
              className="p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="container mx-auto mt-2 pb-4 space-y-3"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Profile
              </Link>
              <Button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
