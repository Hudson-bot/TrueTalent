import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiDollarSign, FiBriefcase, FiMessageSquare, FiCompass, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const HireSidebar = ({ activeTab = "projects", user = {} }) => {
  const location = useLocation();
  const defaultProfilePic = "https://via.placeholder.com/40";
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to determine if a tab is active
  const isActive = (tab) => {
    return activeTab === tab || location.pathname === `/hire/${tab}`;
  };

  // Check if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when navigating on mobile
  const handleNavigation = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile toggle button
  const MobileToggle = () => (
    <button 
      onClick={() => setIsOpen(!isOpen)}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-indigo-600 text-white shadow-lg md:hidden"
    >
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  );

  // If mobile and sidebar is closed, only show the toggle button
  if (isMobile && !isOpen) {
    return <MobileToggle />;
  }

  return (
    <>
      {isMobile && <MobileToggle />}
      <motion.div 
        initial={{ x: isMobile ? -100 : -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : ''} w-64 bg-white shadow-lg flex flex-col h-screen`}
      >
        {/* Logo Section */}
        <div 
          className="p-4 border-b border-gray-100 cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          <h1 className="text-2xl font-bold text-indigo-600 text-center">
            TrueTalent
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <motion.div whileHover={{ x: 5 }}>
            <Link
              to="/hire/community"
              onClick={handleNavigation}
              className={`flex items-center w-full p-3 rounded-lg text-left ${
                isActive('community') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg"><FiCompass /></span>
                <span>Community</span>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 5 }}>
            <Link
              to="/hire/projects"
              onClick={handleNavigation}
              className={`flex items-center w-full p-3 rounded-lg text-left ${
                isActive('projects') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg"><FiBriefcase /></span>
                <span>Projects</span>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 5 }}>
            <Link
              to="/hire/post-project"
              onClick={handleNavigation}
              className={`flex items-center w-full p-3 rounded-lg text-left ${
                isActive('post-project') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg"><FiDollarSign /></span>
                <span>Post Project</span>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 5 }}>
            <Link
              to="/hire/messages"
              onClick={handleNavigation}
              className={`flex items-center w-full p-3 rounded-lg text-left ${
                isActive('messages') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg"><FiMessageSquare /></span>
                <span>Messages</span>
              </div>
            </Link>
          </motion.div>
        </nav>

        {/* Profile Section - Moved to bottom */}
        <div 
          className="p-4 border-t border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors"
          onClick={() => {
            window.location.href = '/hire/profile';
            handleNavigation();
          }}
          title="View and manage your profile"
        >
          <div className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('profile') ? 'bg-indigo-50 text-indigo-600' : ''
          }`}>
            <div className="relative">
              <img 
                src={user?.profilePic || defaultProfilePic} 
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                alt="Profile"
              />
            </div>
            <div>
              <h3 className="font-medium flex items-center space-x-2">
                <span>{user?.name || 'User'}</span>
                <FiUser className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </h3>
              <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default HireSidebar;