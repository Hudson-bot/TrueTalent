import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import QuizGenerator from "./QuizGenerator";

const CommunitySection = ({ personalInfo }) => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/personal-info/${userId}`);
        if (response.data && response.data.name) {
          setUserName(response.data.name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (!personalInfo?.name) {
      fetchUserData();
    } else {
      setUserName(personalInfo.name);
    }
  }, [personalInfo]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {userName ? `Hey, ${userName}!` : "Welcome to the Community!"}
        </h2>
        <p className="text-gray-600 mt-2">Connect, share, and grow with fellow developers</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-white/20"
      >
        <div className="text-center">
          <p className="text-lg text-gray-700">
            🚀 Join discussions, showcase your work, and support others in the community.
          </p>
          <p className="text-md text-gray-500 mt-2">
            We’re excited to see what you'll bring!
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
          >
            Explore Community
          </motion.button>
          <motion.button
            onClick={() => setIsTestModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
          >
            Take Test
          </motion.button>
        </div>
      </motion.div>

      <QuizGenerator
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
};

export default CommunitySection;
