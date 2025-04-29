import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiX, FiUpload, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import HireSidebar from './HireSidebar';

// Step components
const ProjectDescriptionStep = ({ formData, updateFormData, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        Tell us about your project
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Enter a descriptive title for your project"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Project Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Describe what you need to build in detail..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!formData.title || !formData.description}
            className={`flex items-center gap-2 px-6 py-3 ${
              !formData.title || !formData.description
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } text-white rounded-xl font-medium`}
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ContentFocusStep = ({ formData, updateFormData, onNext, onSkip }) => {
  const contentTypes = [
    'E-commerce',
    'Blog/Content',
    'Portfolio',
    'Social Media',
    'Educational',
    'Entertainment',
    'Business/Corporate',
    'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        What is the primary focus of the content?
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {contentTypes.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData('contentFocus', type)}
              className={`p-4 rounded-xl border text-left ${
                formData.contentFocus === type
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                {formData.contentFocus === type && (
                  <FiCheck className="mr-2 text-blue-500" />
                )}
                <span>{type}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
          >
            Skip this step
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!formData.contentFocus}
            className={`flex items-center gap-2 px-6 py-3 ${
              !formData.contentFocus
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } text-white rounded-xl font-medium`}
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TargetAudienceStep = ({ formData, updateFormData, onNext, onSkip }) => {
  const audienceTypes = [
    'General Public',
    'Professionals',
    'Students',
    'Children',
    'Elderly',
    'Businesses',
    'Specific Niche',
    'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        What type of audience are you targeting?
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {audienceTypes.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData('targetAudience', type)}
              className={`p-4 rounded-xl border text-left ${
                formData.targetAudience === type
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                {formData.targetAudience === type && (
                  <FiCheck className="mr-2 text-blue-500" />
                )}
                <span>{type}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
          >
            Skip this step
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!formData.targetAudience}
            className={`flex items-center gap-2 px-6 py-3 ${
              !formData.targetAudience
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } text-white rounded-xl font-medium`}
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const AttachmentStep = ({ formData, updateFormData, onNext }) => {
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 25 * 1024 * 1024) { // 25MB max
      updateFormData('attachment', file);
      updateFormData('attachmentPreview', URL.createObjectURL(file));
    } else if (file) {
      alert('File size exceeds 25MB limit');
    }
  };
  
  const removeAttachment = () => {
    updateFormData('attachment', null);
    updateFormData('attachmentPreview', null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        Add an attachment (optional)
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {formData.attachmentPreview ? (
          <div className="mb-6">
            <div className="relative">
              {formData.attachment.type.startsWith('image/') ? (
                <img 
                  src={formData.attachmentPreview} 
                  alt="Attachment preview" 
                  className="w-full h-64 object-contain bg-gray-50 rounded-xl"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">
                      {formData.attachment.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {(formData.attachment.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={removeAttachment}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current.click()}
            className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,application/pdf"
            />
            <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
            <p className="text-gray-600 mb-1">Click to upload an image, video, or document</p>
            <p className="text-sm text-gray-400">Maximum file size: 25MB</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium"
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SkillsStep = ({ formData, updateFormData, onNext }) => {
  const [customSkill, setCustomSkill] = useState('');
  
  const skillCategories = {
    Frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Vue.js', 'TypeScript'],
    Backend: ['Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails', 'Java (Spring Boot)', '.NET'],
    'Database & DevOps': ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Docker', 'AWS', 'Git/GitHub'],
    'Testing & Tools': ['Jest', 'Cypress', 'Playwright', 'Postman', 'Webpack', 'Vite'],
    'Other': ['Python', 'C++', 'Figma', 'REST APIs', 'GraphQL', 'Machine Learning', 'UI/UX Design']
  };
  
  const toggleSkill = (skill) => {
    const skills = formData.requiredSkills || [];
    if (skills.includes(skill)) {
      updateFormData('requiredSkills', skills.filter(s => s !== skill));
    } else if (skills.length < 5) {
      updateFormData('requiredSkills', [...skills, skill]);
    } else {
      alert('Maximum 5 skills allowed');
    }
  };
  
  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    const skills = formData.requiredSkills || [];
    
    if (trimmed && !skills.includes(trimmed)) {
      if (skills.length < 5) {
        updateFormData('requiredSkills', [...skills, trimmed]);
        setCustomSkill('');
      } else {
        alert('Maximum 5 skills allowed');
      }
    }
  };
  
  const removeSkill = (skill) => {
    const skills = formData.requiredSkills || [];
    updateFormData('requiredSkills', skills.filter(s => s !== skill));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        What skills are required? (1-5)
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {(formData.requiredSkills || []).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Selected Skills ({(formData.requiredSkills || []).length}/5)
            </h3>
            <div className="flex flex-wrap gap-2">
              {(formData.requiredSkills || []).map(skill => (
                <motion.div
                  key={skill}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">
                    <FiX size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
            placeholder="Add custom skill"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
          />
          <button
            onClick={addCustomSkill}
            disabled={!customSkill.trim() || (formData.requiredSkills || []).length >= 5}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        
        <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-6">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => {
                  const isSelected = (formData.requiredSkills || []).includes(skill);
                  return (
                    <motion.button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected && <FiCheck size={16} />}
                      {skill}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={(formData.requiredSkills || []).length === 0}
            className={`flex items-center gap-2 px-6 py-3 ${
              (formData.requiredSkills || []).length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } text-white rounded-xl font-medium`}
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const BudgetStep = ({ formData, updateFormData, onNext }) => {
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'];
  
  const handleMinBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateFormData('minBudget', value);
      
      // Ensure max budget is not less than min budget
      if (formData.maxBudget && value > formData.maxBudget) {
        updateFormData('maxBudget', value);
      }
    }
  };
  
  const handleMaxBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= (formData.minBudget || 0)) {
      updateFormData('maxBudget', value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        What is your estimated budget?
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Currency
          </label>
          <select
            value={formData.currency || 'USD'}
            onChange={(e) => updateFormData('currency', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Minimum Budget
            </label>
            <input
              type="number"
              value={formData.minBudget || ''}
              onChange={handleMinBudgetChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Maximum Budget
            </label>
            <input
              type="number"
              value={formData.maxBudget || ''}
              onChange={handleMaxBudgetChange}
              placeholder="1000"
              min={formData.minBudget || 0}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!formData.currency || !formData.minBudget || !formData.maxBudget}
            className={`flex items-center gap-2 px-6 py-3 ${
              !formData.currency || !formData.minBudget || !formData.maxBudget
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } text-white rounded-xl font-medium`}
          >
            Next
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SummaryStep = ({ formData, onEdit, onSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        Project Summary
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Project Details</h3>
              <button
                onClick={() => onEdit(0)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium">{formData.title}</p>
              <p className="text-gray-600 mt-2">{formData.description}</p>
            </div>
          </div>
          
          {formData.contentFocus && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Content Focus</h3>
                <button
                  onClick={() => onEdit(1)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={16} />
                  Edit
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p>{formData.contentFocus}</p>
              </div>
            </div>
          )}
          
          {formData.targetAudience && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Target Audience</h3>
                <button
                  onClick={() => onEdit(2)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={16} />
                  Edit
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p>{formData.targetAudience}</p>
              </div>
            </div>
          )}
          
          {formData.attachment && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Attachment</h3>
                <button
                  onClick={() => onEdit(3)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={16} />
                  Edit
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                {formData.attachment.type.startsWith('image/') ? (
                  <img 
                    src={formData.attachmentPreview} 
                    alt="Attachment preview" 
                    className="w-full h-48 object-contain"
                  />
                ) : (
                  <div className="text-gray-600">
                    {formData.attachment.name} ({(formData.attachment.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Required Skills</h3>
              <button
                onClick={() => onEdit(4)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {(formData.requiredSkills || []).map(skill => (
                  <div
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Budget</h3>
              <button
                onClick={() => onEdit(5)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p>
                {formData.currency} {formData.minBudget} - {formData.maxBudget}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium"
          >
            Submit Project
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const PostProject = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editProjectId = queryParams.get('edit');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentFocus: '',
    targetAudience: '',
    attachment: null,
    attachmentPreview: null,
    requiredSkills: [],
    currency: 'USD',
    minBudget: '',
    maxBudget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate(); // Add useNavigate hook
  
  // Memoize functions to prevent unnecessary re-renders
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Memoize navigation functions to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);
  
  const handleSkip = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);
  
  const handleEdit = useCallback((step) => {
    setCurrentStep(step);
  }, []);
  
  // Use useRef to store the current formData without causing re-renders
  const formDataRef = useRef(formData);
  // Fetch project data if editing an existing project
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!editProjectId) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${editProjectId}`);
        const project = response.data;
        
        // Update form data with project data
        setFormData({
          title: project.title || '',
          description: project.description || '',
          contentFocus: project.contentFocus || '',
          targetAudience: project.targetAudience || '',
          attachment: null, // Can't restore the file object
          attachmentPreview: project.attachmentUrl || null,
          requiredSkills: project.requiredSkills || [],
          currency: project.currency || 'USD',
          minBudget: project.minBudget || '',
          maxBudget: project.maxBudget || ''
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
        alert('Failed to load project data for editing');
      }
    };
    
    fetchProjectData();
  }, [editProjectId]);
  // Update the ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Use the ref value instead of the dependency
      const currentFormData = formDataRef.current;
      
      // Create form data for file upload
      const projectData = new FormData();
      
      // Add all form fields
      Object.keys(currentFormData).forEach(key => {
        if (key !== 'attachment' && key !== 'attachmentPreview') {
          if (key === 'requiredSkills') {
            // Ensure requiredSkills is properly stringified as an array
            projectData.append(key, JSON.stringify(currentFormData[key] || []));
          } else if (typeof currentFormData[key] === 'object' && currentFormData[key] !== null && !Array.isArray(currentFormData[key])) {
            projectData.append(key, JSON.stringify(currentFormData[key]));
          } else {
            projectData.append(key, currentFormData[key]);
          }
        }
      });
      
      // Add attachment if exists
      if (currentFormData.attachment) {
        projectData.append('attachment', currentFormData.attachment);
      }
      
      // Get user ID from local storage or use a default for testing
      let userId = localStorage.getItem('userId');
      
      // For testing purposes, if userId is not available, use a default
      if (!userId) {
        // In a real app, you might want to redirect to login instead
        userId = '64f5e3c5e4b0a6d0f0f3c5d0'; // Default test user ID
        console.warn('Using default user ID for testing. In production, user should be logged in.');
      }
      
      // Add user ID to form data
      projectData.append('userId', userId);
      
      // Add timestamp
      projectData.append('createdAt', new Date().toISOString());
      
      // Send data to backend - use PUT if editing, POST if creating new
      const url = editProjectId 
        ? `http://localhost:5000/api/projects/${editProjectId}`
        : 'http://localhost:5000/api/projects';
      
      const method = editProjectId ? 'put' : 'post';
      
      const response = await axios[method](url, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Project submitted successfully:', response.data);
      
      // Navigate to dashboard instead of showing success modal
      navigate('/hire/projects');
      
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(`Failed to submit project: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [editProjectId, navigate]); // Only depend on editProjectId and navigate
  
  // Render steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectDescriptionStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 1:
        return (
          <ContentFocusStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onSkip={handleSkip} 
          />
        );
      case 2:
        return (
          <TargetAudienceStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onSkip={handleSkip} 
          />
        );
      case 3:
        return (
          <AttachmentStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 4:
        return (
          <SkillsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 5:
        return (
          <BudgetStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 6:
        return (
          <SummaryStep 
            formData={formData} 
            onEdit={handleEdit} 
            onSubmit={handleSubmit} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <HireSidebar activeTab="post-project" />
      
      <div className="flex-1 overflow-y-auto py-12 px-4">
        {/* Header with back button */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/hire/projects')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {editProjectId ? 'Edit Project' : 'Post a New Project'}
            </h1>
          </div>
        </div>
        {/* Progress indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {['Project Details', 'Content Focus', 'Target Audience', 'Attachment', 'Skills', 'Budget', 'Summary'].map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep 
                      ? 'bg-blue-600 text-white' 
                      : index === currentStep 
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <FiCheck size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        
        {/* Success message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="text-green-500 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Project Submitted!</h2>
                  <p className="text-gray-600 mb-4">
                    Your project has been successfully submitted. We'll notify you when you receive responses.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Submitting your project...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostProject;