import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Affinda API call
    const affindaFormData = new FormData();
    affindaFormData.append("file", new Blob([buffer]), file.name);

    const response = await fetch("https://api.affinda.com/v2/resumes", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${process.env.AFFINDA_API_KEY}` 
      },
      body: affindaFormData,
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Affinda error:", errorText);
      return NextResponse.json({ error: "Failed to parse resume with Affinda" }, { status: response.status });
    }

    const data = await response.json()

    // Map Affinda response to AuraPal resume schema
    return NextResponse.json({
      name: data.data?.name?.raw,
      email: data.data?.emails?.[0],
      phone: data.data?.phoneNumbers?.[0],
      summary: data.data?.summary,
      experience: data.data?.workExperience?.map((w: any) => ({
        company: w.organization, 
        role: w.jobTitle,
        start: w.dates?.startDate, 
        end: w.dates?.endDate,
        bullets: w.jobDescription?.split("\n").filter(Boolean)
      })) || [],
      education: data.data?.education?.map((e: any) => ({
        school: e.organization, 
        degree: e.accreditation?.education,
        year: e.dates?.completionDate
      })) || [],
      skills: data.data?.skills?.map((s: any) => s.name) || [],
    })
  } catch (err: any) {
    console.error("Parse error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
