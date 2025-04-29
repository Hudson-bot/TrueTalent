// backend/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import axios from 'axios';

const router = express.Router();

// Base user routes
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest user (for ProfileSection)
router.get('/personal-info', async (req, res) => {
  try {
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) {
      return res.status(404).json({ message: 'No user found' });
    }
    res.json(latestUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Personal info routes
router.post('/personal-info', async (req, res) => {
  try {
    const { userId, name, title, email, bio, github, linkedin, resume } = req.body;
    
    // Check if email already exists but with a different userId
    const existingUser = await User.findOne({ email, userId: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use by another user' });
    }
    
    const user = await User.findOneAndUpdate(
      { userId },
      {
        userId,
        name,
        title,
        email,
        bio,
        github,
        linkedin,
        resume
      },
      { new: true, upsert: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get personal info by userId
router.get('/personal-info/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      // If user not found by userId, try to get the latest user
      const latestUser = await User.findOne().sort({ createdAt: -1 });
      if (!latestUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(latestUser);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route for social links
router.get('/users/social/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      github: user.github || '',
      linkedin: user.linkedin || '',
      resume: user.resume || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update links
router.put('/users/:userId/links', async (req, res) => {
  try {
    // Try to find and update the user
    let updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        github: req.body.github,
        linkedin: req.body.linkedin,
        resume: req.body.resume
      },
      { new: true }
    );

    // If user not found, try to get the latest user and update it
    if (!updatedUser) {
      const latestUser = await User.findOne().sort({ createdAt: -1 });
      if (!latestUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update the latest user with the provided links
      updatedUser = await User.findByIdAndUpdate(
        latestUser._id,
        { 
          github: req.body.github,
          linkedin: req.body.linkedin,
          resume: req.body.resume
        },
        { new: true }
      );
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT route to update personal info by userId
router.put('/personal-info/:userId', async (req, res) => {
  try {
    const { github, linkedin, resume } = req.body;
    
    // Try to find and update the user
    let updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { github, linkedin, resume },
      { new: true }
    );

    // If user not found, try to get the latest user and update it
    if (!updatedUser) {
      const latestUser = await User.findOne().sort({ createdAt: -1 });
      if (!latestUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update the latest user with the provided links
      updatedUser = await User.findByIdAndUpdate(
        latestUser._id,
        { github, linkedin, resume },
        { new: true }
      );
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get user skills by userId
router.get('/users/:userId/skills', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// For backward compatibility with SkillsSection.jsx
router.get('/:userId/skills', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user skills by userId
router.patch('/users/:userId/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { skills } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route for skills
router.post('/skills', async (req, res) => {
  try {
    const { userId, skills } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { skills } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Keep the original routes for backward compatibility
router.get('/:id/skills', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { skills } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user data for TestModal
function extractGitHubUsername(url) {
  const match = url.match(/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9-]+)(\/)?$/);
  return match ? match[2] : null;
}

async function fetchGitHubRepos(githubUrl) {
  const username = extractGitHubUsername(githubUrl);
  if (!username) throw new Error("Invalid GitHub URL");

  const response = await axios.get(`https://api.github.com/users/${username}/repos`);
  return response.data.map(repo => ({
    name: repo.name,
    description: repo.description,
    language: repo.language
  }));
}

router.get('/user-test-data/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let repos = [];
    try {
      repos = await fetchGitHubRepos(user.github);
    } catch (err) {
      console.warn('Failed to fetch GitHub repos:', err.message);
    }

    res.json({
      github: user.github || '',
      resume: user.resume || '',
      skills: user.skills || [],
      repos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;