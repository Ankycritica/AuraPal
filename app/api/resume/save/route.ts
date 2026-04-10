import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { title, originalText, improvedText, atsScore, fileName } = await req.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("resumes")
      .insert([
        {
          user_id: session.user.id,
          title: title || "Untitled Resume",
          original_text: originalText,
          improved_text: improvedText,
          ats_score: atsScore,
          file_name: fileName,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ id: data[0].id, success: true })
  } catch (err: any) {
    console.error("Save error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
