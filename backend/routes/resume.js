// backend/routes/resume.js
import express from 'express';
import multer from 'multer';
import { generateQuestionsFromSkills } from '../services/openRouter.js';

const router = express.Router();
const upload = multer();

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }
    
    if (!req.body.githubLink) {
      return res.status(400).json({ error: 'GitHub link is required.' });
    }

    const githubLink = req.body.githubLink;
    
    console.log('📄 Processing resume file...');
    
    try {
      // Import pdf-parse using dynamic import
      const pdf = await import('pdf-parse/lib/pdf-parse.js');
      const pdfParse = pdf.default;

      // Process the buffer directly
      const dataBuffer = req.file.buffer;
      const pdfData = await pdfParse(dataBuffer, {
        max: 0, // No page limit
        version: 'v2.0.550'
      });
      
      const resumeText = pdfData.text;
      console.log('✅ Resume parsed successfully');
      
      const skills = extractSkillsFromText(resumeText);
      console.log('🔍 Extracted skills:', skills);
      
      if (skills.length === 0) {
        return res.status(400).json({ error: 'No relevant skills found in the resume.' });
      }
      
      const questions = await generateQuestionsFromSkills(githubLink, skills);
      console.log('❓ Generated questions successfully');
      
      res.json({ 
        success: true,
        skills,
        questions 
      });
    } catch (pdfError) {
      console.error('❌ Error parsing PDF:', pdfError);
      return res.status(400).json({ 
        error: 'Failed to parse PDF file. Please ensure you uploaded a valid PDF.',
        details: pdfError.message
      });
    }
  } catch (err) {
    console.error('❌ Error processing resume:', err);
    res.status(500).json({ 
      error: 'Failed to process resume',
      details: err.message || 'Unknown error'
    });
  }
});

function extractSkillsFromText(text) {
  const knownSkills = [
    'JavaScript', 'React', 'Node.js', 'Python',
    'HTML', 'CSS', 'MongoDB', 'Express', 'Machine Learning'
  ];
  return knownSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
}

export default router;
