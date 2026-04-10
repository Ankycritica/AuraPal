import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query") || "Software Engineer"
  const location = searchParams.get("location") || "USA"

  if (!process.env.JSEARCH_API_KEY) {
    return NextResponse.json({ error: "JSearch API key missing" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + " in " + location)}&num_pages=1`, {
      headers: {
        "x-rapidapi-key": process.env.JSEARCH_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
      }
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Job search error:", err)
    return NextResponse.json({ error: "Job service unavailable" }, { status: 500 })
  }
}
