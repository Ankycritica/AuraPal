import { NextRequest, NextResponse } from "next/server"
import { getModel } from "@/lib/gemini"
import { auth } from "@/auth"

const SYSTEM_PROMPTS: Record<string, string> = {
  resume_rewrite:
    "You are an expert resume writer. Rewrite the given resume " +
    "section to be impactful, achievement-focused, and " +
    "ATS-optimized. Use strong action verbs. Quantify " +
    "achievements wherever possible. Return only the " +
    "rewritten text, nothing else.",

  ats_score:
    "You are an ATS (Applicant Tracking System) expert. " +
    "Analyze this resume text and return ONLY valid JSON " +
    "with no markdown, no code fences, no explanation — " +
    "just the raw JSON object: " +
    '{ "overall": number 0-100, ' +
    '"keywords": number 0-100, ' +
    '"format": number 0-100, ' +
    '"impact": number 0-100, ' +
    '"missing_keywords": ["string array of important ' +
    'missing keywords"], ' +
    '"suggestions": ["string array of 3-5 specific ' +
    'improvement suggestions"], ' +
    '"strengths": ["string array of 2-3 things the ' +
    'resume does well"] }',

  cover_letter:
    "You are an expert cover letter writer. Write a " +
    "compelling, personalized cover letter that matches the " +
    "candidate's experience to the job description. Be " +
    "specific about why this candidate is a great fit. Use " +
    "professional but warm tone. Return only the cover " +
    "letter text.",

  interview_score:
    "You are a senior hiring manager conducting a mock " +
    "interview. Score the candidate answer for the given " +
    "question. Return ONLY valid JSON with no markdown: " +
    '{ "score": number 0-100, ' +
    '"feedback": "specific feedback on the answer", ' +
    '"improvement": "how to improve the answer", ' +
    '"star_rating": number 1-5 }',

  interview_question:
    "You are a technical interviewer at a top tech company. " +
    "Generate one relevant, challenging but fair interview " +
    "question for the given role and question type " +
    "(behavioral, technical, situational). Return only the " +
    "question text, nothing else.",

  linkedin_rewrite:
    "You are a LinkedIn profile optimization expert. Rewrite " +
    "the given LinkedIn section (headline, about, or " +
    "experience) to maximize recruiter visibility, keyword " +
    "density, and professional impact. Return only the " +
    "rewritten text.",

  job_fit:
    "Analyze how well this resume matches the given job " +
    "description. Return ONLY valid JSON with no markdown: " +
    '{ "score": number 0-100, ' +
    '"matched_keywords": ["keywords found in both"], ' +
    '"missing_keywords": ["important JD keywords missing ' +
    'from resume"], ' +
    '"gap_analysis": "paragraph explaining the gaps", ' +
    '"recommendations": ["3-5 specific actions to ' +
    'improve fit"] }',

  career_roadmap:
    "Create a detailed career roadmap from the current role " +
    "to the target role. Return ONLY valid JSON with no " +
    "markdown: " +
    '{ "estimated_months": number, ' +
    '"milestones": [{ "title": "milestone name", ' +
    '"description": "what to achieve", ' +
    '"skills": ["skills to learn"], ' +
    '"resources": ["courses, books, or certifications"], ' +
    '"weeks": number }] }',

  resume_improve:
    "You are an expert resume consultant. Analyze the " +
    "uploaded resume and provide a completely rewritten, " +
    "improved version. Focus on: ATS keyword optimization, " +
    "strong action verbs (Led, Delivered, Architected, " +
    "Optimized, etc.), quantified achievements " +
    "(percentages, dollar amounts, team sizes), clean " +
    "formatting, removal of filler words and passive voice, " +
    "and professional tone. Return the full improved resume " +
    "text organized by sections (Summary, Experience, " +
    "Skills, Education).",

  summary_writer:
    "Write a compelling 3-4 sentence professional summary " +
    "for this resume. Make it achievement-focused, include " +
    "years of experience if apparent, mention key " +
    "technologies/skills, and convey the candidate's value " +
    "proposition. Return only the summary text.",
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { feature, prompt } = await req.json()
    if (!feature || !prompt) {
      return NextResponse.json(
        { error: "Missing feature or prompt" },
        { status: 400 }
      )
    }

    const systemPrompt =
      SYSTEM_PROMPTS[feature] || "You are a helpful career coach assistant."
    const model = getModel(systemPrompt)
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ result: text })
  } catch (err: any) {
    console.error("AI error:", err)
    if (err?.status === 429) {
      return NextResponse.json(
        {
          error:
            "AI rate limit reached. Please wait a " +
            "minute and try again.",
        },
        { status: 429 }
      )
    }
    return NextResponse.json(
      { error: "AI service unavailable. Please retry." },
      { status: 500 }
    )
  }
}
