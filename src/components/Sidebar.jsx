import { motion } from 'framer-motion';
import { FiMessageSquare, FiUser, FiLink, FiAward, FiCompass } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, userData, handleFileChange, fetchLinks, fetchSkills }) => {
  // Function to handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    
    // Fetch data based on the tab clicked
    if (tabName === 'links') {
      fetchLinks && fetchLinks();
    } else if (tabName === 'skills') {
      fetchSkills && fetchSkills();
    }
  };
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white shadow-lg flex flex-col"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={userData.profilePic || 'https://via.placeholder.com/80'} 
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
              alt="Profile"
            />
            <label className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
          <div>
            <h3 className="font-medium">{userData.name || 'New User'}</h3>
            <p className="text-xs text-gray-500">{userData.title || 'Your Title'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {[
          { icon: <FiCompass />, name: 'Community' },
          { icon: <FiUser />, name: 'Profile' },
          { icon: <FiLink />, name: 'Links' },
          { icon: <FiAward />, name: 'Skills' },
          { icon: <FiMessageSquare />, name: 'Messages' },
        ].map((item) => (
          <motion.button
            whileHover={{ x: 5 }}
            key={item.name}
            onClick={() => handleTabClick(item.name.toLowerCase())}
            className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === item.name.toLowerCase() ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;