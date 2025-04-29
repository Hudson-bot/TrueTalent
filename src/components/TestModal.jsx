import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const TestModal = ({ onClose, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FiX size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Quick Developer Test 🧠
        </h2>
        <p className="text-gray-700 mb-4 text-center">
          Answer a few quick questions to test your skills!
        </p>

        {/* Example Question */}
        <div className="space-y-4">
          <div>
            <p className="font-medium">1. What does React use to manage UI updates?</p>
            <ul className="space-y-2 pl-4 mt-2">
              <li><input type="radio" name="q1" /> DOM Tree</li>
              <li><input type="radio" name="q1" /> Virtual DOM</li>
              <li><input type="radio" name="q1" /> Shadow DOM</li>
            </ul>
          </div>

          <button
            className="w-full mt-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-md transition"
            onClick={() => alert('Thanks for taking the test!')}
          >
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestModal;
