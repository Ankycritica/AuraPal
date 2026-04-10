import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file)
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let text = ""

    if (file.name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buffer)
      text = data.text
    } else if (
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc")
    ) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (file.name.endsWith(".txt")) {
      text = buffer.toString("utf-8")
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Use PDF, DOCX, " + "or TXT.",
        },
        { status: 400 }
      )
    }

    if (!text.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from file. Try " +
            "a different format.",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text: text.trim(),
      filename: file.name,
    })
  } catch (err) {
    console.error("Parse error:", err)
    return NextResponse.json(
      { error: "Failed to parse resume file." },
      { status: 500 }
    )
  }
}
