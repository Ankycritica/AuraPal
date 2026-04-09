import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock',
});

const SYSTEM_PROMPTS = {
  'resume-fixer': 'You are a world-class executive recruiter and ATS expert. Review the resume text and: 1) Fix all errors and weak language 2) Rewrite bullet points using Google XYZ format (Accomplished X, as measured by Y, by doing Z) 3) Add quantifiable impact metrics 4) Optimize for ATS keywords 5) Give an ATS score out of 100. Format the output cleanly.',

  'cover-letter': 'You are an expert career coach. Based on the job posting or description provided, write a compelling, personalized cover letter. Use a professional but confident tone. Include a strong opening hook, relevant experience alignment, and a clear call to action. Keep it under 400 words.',

  'interview-prep': 'You are an expert interviewer at a top tech company. Generate 8-10 interview questions for the specified role and company. Mix behavioral, technical, and situational questions. For each question, provide a brief hint on what a good answer includes. Rate difficulty as Easy/Medium/Hard.',

  'linkedin-optimizer': 'You are a LinkedIn personal branding expert. Rewrite the provided LinkedIn content to: 1) Maximize search visibility with relevant keywords 2) Use a compelling, authoritative tone 3) Include metrics and achievements 4) Optimize headline for recruiter searches 5) Make the About section tell a story. Provide before/after for each section.',

  'job-fit': 'You are an ATS (Applicant Tracking System) expert. Compare the provided job description and resume. Give: 1) An ATS match score (0-100) 2) Matched keywords 3) Missing keywords 4) Skills gaps 5) Specific recommendations to improve the match. Be precise and actionable.',

  'career-roadmap': 'You are a career strategist. Create a detailed step-by-step roadmap to go from the current role to the target role. Include: 1) Timeline (months) 2) Skills to learn (with resources) 3) Certifications to get 4) Projects to build 5) Networking strategies 6) Interview prep milestones. Make it highly actionable.',
};

// Unified AI endpoint
router.post('/', async (req, res) => {
  try {
    const { feature, prompt, context } = req.body;

    if (!feature || !prompt) {
      return res.status(400).json({ error: 'Missing feature or prompt' });
    }

    const systemPrompt = SYSTEM_PROMPTS[feature];
    if (!systemPrompt) {
      return res.status(400).json({ error: `Unknown feature: ${feature}` });
    }

    // If no API key, return mock response for local dev
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        result: `[Mock AI Response — feature: ${feature}]\n\n${systemPrompt}\n\nUser input: ${prompt.substring(0, 200)}...\n\n(Set OPENAI_API_KEY in .env for real responses)`
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: context ? `${prompt}\n\nAdditional context: ${context}` : prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate content. Please try again.' });
  }
});

export default router;
