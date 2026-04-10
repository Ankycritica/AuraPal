import { NextRequest, NextResponse } from "next/server"
import { getModel } from "@/lib/gemini"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 })

    const systemPrompt = "You are an expert resume consultant. Analyze the uploaded resume and provide a completely rewritten, improved version. Focus on: ATS keyword optimization, strong action verbs (Led, Delivered, Architected, Optimized, etc.), quantified achievements (percentages, dollar amounts, team sizes), clean formatting, removal of filler words and passive voice, and professional tone. Return the full improved resume text organized by sections (Summary, Experience, Skills, Education)."
    const model = getModel(systemPrompt)
    const result = await model.generateContent(text)
    const improved = result.response.text()

    return NextResponse.json({ improved })
  } catch (err: any) {
    console.error("AI Improvement error:", err)
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 })
  }
}
