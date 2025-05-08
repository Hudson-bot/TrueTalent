import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const projects = [
    { name: "E-commerce Platform", type: "Web Development", cost: "$2000-$5000" },
    { name: "Mobile App", type: "React Native", cost: "$3000-$7000" },
    { name: "Portfolio Website", type: "Frontend", cost: "$1000-$2000" },
    { name: "CMS Development", type: "Full Stack", cost: "$4000-$8000" },
    { name: "API Integration", type: "Backend", cost: "$2500-$4500" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (projects.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (projects.length - 2)) % (projects.length - 2));
  };

  return (
    <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Projects</h3>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: `${-currentIndex * (288 + 24)}px` }} // 288px (w-72) + 24px (gap-6)
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ paddingLeft: '12px', paddingRight: '12px' }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md overflow-hidden border border-purple-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-purple-600 font-medium mb-2">{project.type}</p>
                <p className="text-gray-600">{project.cost}</p>
              </div>
            </div>
          ))}
        </motion.div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white/100 border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentIndex === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white/100 border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentIndex === projects.length - 3}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectSlider;
