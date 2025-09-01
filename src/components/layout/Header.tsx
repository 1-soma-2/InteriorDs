
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Palette, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, profile } = useAuth();

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isHome = location.pathname === '/';
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome 
          ? 'bg-white shadow-sm border-b border-neutral-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Palette className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-semibold">MoodPalette</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                location.pathname === '/dashboard' ? 'text-primary-600' : 'text-neutral-600'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/inspiration" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                location.pathname === '/inspiration' ? 'text-primary-600' : 'text-neutral-600'
              }`}
            >
              Inspiration
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img 
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'} 
                    alt={profile?.full_name || user?.email || 'User'} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border border-neutral-200"
                    >
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Projects
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                to="/dashboard" 
                className="block py-2 text-neutral-600 hover:text-primary-600"
              >
                Dashboard
              </Link>
              <Link 
                to="/inspiration" 
                className="block py-2 text-neutral-600 hover:text-primary-600"
              >
                Inspiration
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="py-2 border-t border-neutral-200">
                    <div className="flex items-center space-x-3 py-2">
                      <img 
                        src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'} 
                        alt={profile?.full_name || user?.email || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{profile?.full_name || user?.email}</span>
                    </div>
                    <Link 
                      to="/dashboard" 
                      className="block py-2 text-neutral-600 hover:text-primary-600"
                    >
                      My Projects
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block py-2 text-neutral-600 hover:text-primary-600"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center py-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-neutral-200 space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full py-2 text-center text-primary-600 border border-primary-600 rounded-lg"
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full py-2 text-center bg-primary-600 text-white rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
