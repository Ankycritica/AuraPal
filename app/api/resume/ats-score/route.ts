import { NextRequest, NextResponse } from "next/server"
import { getModel } from "@/lib/gemini"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { text, jobDescription } = await req.json()
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 })

    let prompt = `Resume: ${text}\n\n`
    if (jobDescription) {
      prompt += `Job Description: ${jobDescription}\n\nScore this resume against the job description.`
    } else {
      prompt += `Score this resume for general ATS compatibility.`
    }

    const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume text and return ONLY valid JSON with no markdown, no code fences, no explanation — just the raw JSON object: { "overall": number 0-100, "keywords": number 0-100, "format": number 0-100, "impact": number 0-100, "missing_keywords": ["string array"], "suggestions": ["string array"], "strengths": ["string array"] }`
    
    const model = getModel(systemPrompt)
    const result = await model.generateContent(prompt)
    let responseText = result.response.text()

    // Clean up Gemini's response if it contains markdown code blocks
    responseText = responseText.replace(/```json\n?|\n?```/g, "").trim()

    try {
      const score = JSON.parse(responseText)
      return NextResponse.json(score)
    } catch (parseErr) {
      console.error("JSON Parse error:", responseText)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }
  } catch (err: any) {
    console.error("ATS Scoring error:", err)
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 })
  }
}
