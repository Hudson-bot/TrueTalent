import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const PersonalInfoModal = ({ onSave, onClose, existingData = {} }) => {
  const [formData, setFormData] = useState({
    name: existingData.name || '',
    title: existingData.title || '',
    email: existingData.email || '',
    bio: existingData.bio || '',
    github: existingData.github || '',
    linkedin: existingData.linkedin || '',
    resume: existingData.resume || '',
    userId: localStorage.getItem('userId')
  });
  
  // Update form data when existingData changes
  useEffect(() => {
    if (existingData) {
      setFormData(prevData => ({
        ...prevData,
        name: existingData.name || prevData.name,
        title: existingData.title || prevData.title,
        email: existingData.email || prevData.email,
        bio: existingData.bio || prevData.bio,
        github: existingData.github || prevData.github,
        linkedin: existingData.linkedin || prevData.linkedin,
        resume: existingData.resume || prevData.resume
      }));
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSaving(true);
      
      // Update UI immediately for better user experience
      onSave(formData);
      onClose();
      
      // Then save to backend
      console.log('Sending data to backend:', formData);
      await axios.post('http://localhost:5000/api/personal-info', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Failed to save personal info:', err.response?.data || err.message);
      setError('Failed to save. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX className="text-gray-500" size={20} />
        </button>
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {existingData.name ? 'Edit Your Profile' : 'Welcome to Your Profile'}
            </h2>
            <p className="text-gray-500 mt-1">Let's get you set up</p>
          </div>

          <div className="space-y-4">
            {[
              { name: 'name', placeholder: 'Your Full Name', icon: '👤' },
              { name: 'title', placeholder: 'Professional Title', icon: '💼' },
              { name: 'email', placeholder: 'Email Address', icon: '✉️' },
              { name: 'bio', placeholder: 'Short Bio', icon: '📝', isTextarea: true }
            ].map((field) => (
              <motion.div key={field.name} whileHover={{ x: 2 }} className="flex items-center space-x-3">
                <span className="text-xl text-indigo-500">{field.icon}</span>
                {field.isTextarea ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={3}
                    className="flex-1 px-4 py-2 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <input
                    type={field.name === 'email' ? 'email' : 'text'}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="flex-1 px-4 py-2 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-center mb-3">{error}</p>
          )}
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-3 rounded-lg font-medium shadow-md transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || isSaving}
              className={`flex-1 py-3 rounded-lg font-medium shadow-md transition-all ${
                !formData.name || !formData.email || isSaving
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {isSaving ? 'Saving...' : existingData.name ? 'Save Changes' : 'Save & Continue'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoModal;
