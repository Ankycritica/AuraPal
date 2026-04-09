import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { auth } from "@/auth"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPTS: Record<string, string> = {
  resume_rewrite: "You are an expert resume writer. Rewrite the section to be impactful, achievement-focused, and ATS-optimized. Use strong action verbs. Quantify achievements. Return only the rewritten text.",
  ats_score: "You are an ATS expert. Analyze this resume and return ONLY valid JSON: { \"overall\": number, \"keywords\": number, \"format\": number, \"missing_keywords\": string[], \"suggestions\": string[] }",
  cover_letter: "You are an expert cover letter writer. Write a compelling, personalized cover letter matching the job description to the resume. Be specific. Return only the letter text.",
  interview_score: "You are a senior hiring manager. Score this interview answer and return ONLY valid JSON: { \"score\": number, \"feedback\": string, \"improvement\": string, \"star_rating\": number }",
  interview_question: "You are a technical interviewer at a top tech company. Ask one relevant interview question based on the role and type. Return only the question.",
  linkedin_rewrite: "You are a LinkedIn optimization expert. Rewrite the section to maximize recruiter visibility and keyword density. Return only the rewritten text.",
  job_fit: "Analyze resume vs job description. Return ONLY valid JSON: { \"score\": number, \"matched_keywords\": string[], \"missing_keywords\": string[], \"gap_analysis\": string }",
  career_roadmap: "Create a career roadmap. Return ONLY valid JSON: { \"milestones\": [{ \"title\": string, \"skills\": string[], \"resources\": string[], \"weeks\": number }] }",
  summary_writer: "Write a compelling professional summary for this resume. 3-4 sentences. Achievement-focused. Return only the summary text.",
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  const { feature, prompt, context } = await req.json()
  if (!feature || !prompt) return NextResponse.json({ error: "Missing feature or prompt" }, { status: 400 })
  
  try {
    const message = await client.messages.create({
      model: "claude-3-sonnet-20240229", // Adjusted model name for Sonnet
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[feature] || "You are a helpful career coach assistant.",
      messages: [{ role: "user", content: context ? `${context}\n\nPrompt: ${prompt}` : prompt }],
    })
    
    // Type-safe extraction of text content
    const result = message.content.find(c => c.type === 'text')?.text || ""
    return NextResponse.json({ result })
  } catch (err) {
    console.error("AI error:", err)
    return NextResponse.json({ error: "AI service unavailable. Please retry." }, { status: 500 })
  }
}
