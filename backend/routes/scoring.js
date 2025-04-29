import express from 'express';
import axios from 'axios';
import { storeGeneratedQA } from '../services/idealAnswers.js';

const router = express.Router();

router.post('/score', async (req, res) => {
    try {
        const { questions, answers } = req.body;
        
        // Enhanced validation
        if (!Array.isArray(questions) || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Questions and answers must be arrays' });
        }

        if (questions.length === 0 || answers.length === 0) {
            return res.status(400).json({ message: 'Questions and answers cannot be empty' });
        }

        if (questions.length !== answers.length) {
            return res.status(400).json({ message: 'Number of questions and answers must match' });
        }

        const results = await Promise.all(questions.map(async (question, index) => {
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: "anthropic/claude-2",
                    messages: [{
                        role: "system",
                        content: `You are an expert technical interviewer. Analyze the following response and provide:
                        1. Score (0-10) - Start with "Score: X"
                        2. Feedback - Start with "Feedback:"
                        3. Ideal Answer - Start with "Ideal Answer:"`
                    }, {
                        role: "user",
                        content: `Question: ${question}\nCandidate's Answer: ${answers[index]}`
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:5000',
                        'Content-Type': 'application/json'
                    }
                });

                // More robust response validation
                if (!response?.data?.choices?.[0]?.message?.content) {
                    console.error('Invalid API response:', response?.data);
                    throw new Error('Invalid API response structure');
                }

                const aiResponse = response.data.choices[0].message.content;
                const analysis = parseAIResponse(aiResponse);
                
                // Store the generated Q&A
                await storeGeneratedQA(question, analysis.correctAnswer);

                return {
                    question,
                    userAnswer: answers[index],
                    analysis
                };
            } catch (error) {
                console.error(`Error analyzing question "${question}":`, error);
                return {
                    question,
                    userAnswer: answers[index],
                    analysis: {
                        score: 0,
                        feedback: "Error analyzing response. Please try again.",
                        correctAnswer: "Analysis unavailable"
                    },
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                };
            }
        }));

        // Calculate summary statistics
        const validResults = results.filter(r => r.analysis.score !== undefined);
        const averageScore = validResults.length > 0 
            ? (validResults.reduce((acc, curr) => acc + curr.analysis.score, 0) / validResults.length).toFixed(2)
            : 0;

        res.json({ 
            results,
            summary: {
                totalQuestions: questions.length,
                analyzedQuestions: validResults.length,
                failedQuestions: questions.length - validResults.length,
                averageScore
            }
        });
    } catch (error) {
        console.error('Scoring route error:', error);
        res.status(500).json({ 
            message: 'Error processing scoring request',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Enhanced parsing functions
function parseAIResponse(response) {
    try {
        const score = extractScore(response);
        const feedback = extractSection(response, 'Feedback');
        const correctAnswer = extractSection(response, 'Ideal Answer');

        return {
            score: score ?? 0,
            feedback: feedback ?? 'No feedback provided',
            correctAnswer: correctAnswer ?? 'No ideal answer available'
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
            score: 0,
            feedback: 'Error parsing response',
            correctAnswer: 'Parsing error'
        };
    }
}

function extractScore(text) {
    const scoreMatch = text.match(/Score:\s*(\d+(?:\.\d+)?)/i);
    if (scoreMatch) {
        const score = parseFloat(scoreMatch[1]);
        return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
    }
    return 0;
}

function extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
}

export default router;