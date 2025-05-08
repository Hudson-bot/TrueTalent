import React, { useEffect, useState } from 'react';

const Community = () => {
  const [communityScores, setCommunityScores] = useState([]);

  useEffect(() => {
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    setCommunityScores(scores);
  }, []);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Community Scores</h2>
      <div className="space-y-4">
        {communityScores.map((score, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">{score.name[0]}</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">{score.name}</h3>
                <p className="text-sm text-gray-500">{new Date(score.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600">{score.average.toFixed(1)}/10</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
