import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, clearAuth } from '../../utils/AuthUtils';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const renderNavItems = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        {userRole === 'client' ? (
          <>
            <Link to="/hire/projects">My Projects</Link>
            <Link to="/hire/post">Post Job</Link>
          </>
        ) : (
          <>
            <Link to="/gethired/dashboard">Dashboard</Link>
            <Link to="/gethired/jobs">Find Jobs</Link>
          </>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-600">
        <Link to="/">TrueTalent</Link>
      </div>
      {renderNavItems()}
    </nav>
  );
}

export default Navbar;