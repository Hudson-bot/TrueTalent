import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiDollarSign, FiBriefcase, FiMessageSquare, FiCompass } from 'react-icons/fi';

const HireSidebar = ({ activeTab = "projects", user = {} }) => {
  const location = useLocation();
  const defaultProfilePic = "https://via.placeholder.com/40";

  return (
    <div className="w-64 bg-white h-screen shadow-md flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profilePic || defaultProfilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-800">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
        <li>
            <Link
              to="/hire/community"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'community' || location.pathname === '/hire/community'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiCompass />
              <span>Community</span>
            </Link>
          </li>
          <li>
            <Link
              to="/hire/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'profile' || location.pathname === '/hire/profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiUser />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/hire/projects"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'projects' || location.pathname === '/hire/projects'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase />
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link
               to="/hire/post-project"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'post-project' || location.pathname === '/hire/post-project'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiDollarSign />
              <span>Post Project</span>
            </Link>
          </li>
          <li>
            <Link
              to="/hire/messages"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'messages' || location.pathname === '/hire/messages'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiMessageSquare />
              <span>Messages</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HireSidebar;