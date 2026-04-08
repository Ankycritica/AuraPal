import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock',
});

// Middleware to check credits (mock implementation)
const checkCredits = (req, res, next) => {
  // In a real app, you would fetch user's credit balance from DB based on req.user or req.session
  // and dedut it. Free plan: 5 generations/day.
  req.userCredits = 10;
  if (req.userCredits <= 0) {
    return res.status(403).json({ error: 'Insufficient credits. Please upgrade your plan.' });
  }
  next();
};

const aiGenerate = async (systemPrompt, userPrompt, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Mock mode for local dev without key
      return res.json({ result: "Here is your mocked AI response since OPENAI_API_KEY is not set.\n\n" + systemPrompt + "\n" + userPrompt });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });
    
    // Deduct credit in DB here
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}

router.post('/resume-fixer', checkCredits, async (req, res) => {
  const { resumeText } = req.body;
  const sys = 'You are a world-class executive recruiter. Review the following resume text and provide brutal, actionable feedback to improve it, fix errors, and rewrite bullet points to be impact-driven (Google XYZ format).';
  await aiGenerate(sys, resumeText, res);
});

router.post('/side-hustle', checkCredits, async (req, res) => {
  const { interests, skills, budget } = req.body;
  const sys = 'You are a serial entrepreneur. Generate 3 highly actionable side hustle ideas based on the user\'s inputs. Include step-by-step first actions and monetization strategies.';
  const userPrompt = `Interests: ${interests}\nSkills: ${skills}\nBudget: ${budget}`;
  await aiGenerate(sys, userPrompt, res);
});

router.post('/linkedin-roast', checkCredits, async (req, res) => {
  const { profileProfile } = req.body;
  const sys = 'You are an aggressive but helpful personal branding expert. Roast the user\'s LinkedIn profile text, then provide a highly optimized version that attracts recruiters and inbound leads.';
  await aiGenerate(sys, profileProfile, res);
});

router.post('/business-plan', checkCredits, async (req, res) => {
  const { idea } = req.body;
  const sys = 'You are a startup founder and VC. Create a comprehensive, minimalist 1-page business plan (Lean Canvas style) for the following business idea. Include Problem, Solution, Unique Value Proposition, Channels, Customer Segments, Cost Structure, and Revenue Streams.';
  await aiGenerate(sys, idea, res);
});

router.post('/seo-article', checkCredits, async (req, res) => {
  const { keyword } = req.body;
  const sys = 'You are an SEO expert and copywriter. Write a comprehensive, highly engaging, and structured blog post targeted at the provided keyword. Include an H1, multiple H2s, H3s, meta title, meta description, FAQ schema (JSON-LD format), and ensure optimal keyword density.';
  await aiGenerate(sys, `Keyword: ${keyword}`, res);
});

router.post('/unified-chat', checkCredits, async (req, res) => {
  const { prompt } = req.body;
  const sys = 'You are AuraPal, a world-class AI Career & Growth Engine. You act as a personal assistant for career growth and income generation. Provide actionable, concise, and highly valuable responses.';
  await aiGenerate(sys, prompt, res);
});

export default router;
