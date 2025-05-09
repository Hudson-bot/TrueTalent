import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <motion.div
        className="container header-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          True<span className="highlight">Talent</span>
        </motion.div>
        <nav className="nav">
          <ul className="nav-links">
            {["Services", "How It Works", "Top Talent", "Pricing"].map(
              (item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item}
                  </a>
                </motion.li>
              )
            )}
          </ul>
        </nav>
        <div className="header-buttons">
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Log In
          </motion.button>
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;