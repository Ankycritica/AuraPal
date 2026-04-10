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

    // --- FALLBACK MOCK LOGIC (FREE NO-API SOLUTION) ---
    let text = "";

    switch (feature) {
      case "resume_rewrite":
        text = `Rewritten: ${prompt}\n\n• Spearheaded cross-functional initiatives leading to a 30% increase in operational efficiency.\n• Delivered high-quality solutions ahead of schedule, consistently exceeding performance metrics.\n• Orchestrated team workflows to reduce processing time by 15%.`;
        break;
      case "ats_score":
        text = JSON.stringify({
          overall: 85,
          keywords: 80,
          format: 90,
          impact: 85,
          missing_keywords: ["Agile", "Cross-functional", "Optimization"],
          suggestions: ["Use more action verbs like 'Architected' or 'Spearheaded'", "Quantify more bullet points with metrics", "Ensure contact info is prominently displayed"],
          strengths: ["Clean formatting", "Strong professional summary"]
        });
        break;
      case "cover_letter":
        text = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the open position. With my background in delivering scalable solutions and driving cross-functional collaboration, I am confident in my ability to make an immediate impact at your company.\n\nThroughout my career, I have consistently exceeded expectations by optimizing processes and driving measurable growth. My technical and soft skills align perfectly with the requirements you are looking for.\n\nI would welcome the opportunity to discuss how my experience and vision can contribute to your team. Thank you for your time and consideration.\n\nSincerely,\n[Your Name]`;
        break;
      case "interview_score":
        text = JSON.stringify({
          score: 80,
          feedback: "Great structure in your answer, but it could use more specific metrics.",
          improvement: "Try using the STAR method (Situation, Task, Action, Result) more rigidly, and ensure you land heavily on the 'Result'.",
          star_rating: 4
        });
        break;
      case "interview_question":
        text = "Tell me about a time when you had to work with a difficult stakeholder to deliver a critical project. How did you handle the situation and what was the outcome?";
        break;
      case "linkedin_rewrite":
        text = `🔥 IN-DEMAND PROFESSIONAL | DRIVING METRIC-BASED RESULTS\n\nI am a passionate and results-driven professional with a strong track record of optimizing operations and scaling products. Let's connect!\n\nHere is a reworked version of your input:\n${prompt}`;
        break;
      case "job_fit":
        text = JSON.stringify({
          score: 75,
          matched_keywords: ["Leadership", "Communication", "Project Management"],
          missing_keywords: ["KPI tracking", "Budgeting", "Agile methodologies"],
          gap_analysis: "Your resume shows strong leadership and communication skills, but lacks explicit mention of Agile methodologies and strict budget management, which are prominent in the Job Description.",
          recommendations: ["Include any experience you have with Agile or scrums.", "Highlight budget sizes you have managed in past roles.", "Rephrase generic 'team leading' to 'cross-functional leadership'."]
        });
        break;
      case "career_roadmap":
        text = JSON.stringify({
          estimated_months: 12,
          milestones: [
            {
              title: "Foundation & Skills Gap Closure",
              description: "Focus on acquiring the missing technical or domain skills required for the target role.",
              skills: ["Advanced Communication", "Domain-Specific Tooling"],
              resources: ["Coursera", "Industry Blogs"],
              weeks: 16
            },
            {
              title: "Networking & Brand Building",
              description: "Start attending industry events and reaching out to professionals in desired roles.",
              skills: ["Networking", "Personal Branding"],
              resources: ["LinkedIn", "Local Meetups"],
              weeks: 12
            },
            {
              title: "Interview Prep & Application",
              description: "Tailor resume and start applying while doing mock interviews.",
              skills: ["Interviewing", "Negotiation"],
              resources: ["Mock Interviews", "Resume Review"],
              weeks: 24
            }
          ]
        });
        break;
      case "resume_improve":
        text = `*** IMPROVED RESUME ***\n\nSUMMARY\nResults-driven professional with extensive experience solving complex problems and driving business value. Proven track record of spearheading initiatives that increase efficiency and ROI.\n\nEXPERIENCE\n• Architected scalable solutions, boosting performance by 40%.\n• Collaborated with cross-functional teams to deliver key milestones 2 weeks ahead of schedule.\n• Optimized workflows, saving $50K annually in operational costs.\n\nEDUCATION & SKILLS\n• Advanced proficiency in industry-standard tools and methodologies.`;
        break;
      case "summary_writer":
        text = "Accomplished, forward-thinking professional with a proven track record of driving operational excellence and delivering high-value solutions. Adept at leveraging cross-functional teamwork and strategic planning to exceed key performance metrics. Passionate about continuous improvement and scaling impactful business processes.";
        break;
      case "roast_resume":
        text = "Oh boy, where do I start? Your resume reads like a Terms of Service agreement — nobody wants to read it, and it puts people to sleep. 'Responsible for...' is the weakest way to start a sentence, just say what you actually DID. Also, did you really need to put 'Microsoft Word' under skills? What is this, 1998? Spice it up, give us some actual metrics, and stop hiding behind buzzwords!";
        break;
      case "side_hustle":
        text = "🚀 SIDE HUSTLE IDEAS BASED ON YOUR SKILLS 🚀\n1. Specialized Consulting: Charge $150/hr consulting small businesses on what you do every day.\n2. Digital Course: Package your unique workflow into a 5-module video course.\n3. Niche Newsletter: Curate the best weekly insights in your field and monetize via sponsorships.\n4. Freelance Audits: Sell 'one-off' audits instead of ongoing services to build a quick client base.";
        break;
      case "business_plan":
        text = "🏢 INSTANT BUSINESS PLAN 🏢\n\n💡 THE IDEA:\nA high-margin SaaS tool aiming to solve the exact problem you struggled with.\n\n🎯 THE MARKET:\nB2B mid-market companies (50-500 employees) experiencing this pain point.\n\n💰 REVENUE MODEL:\nTiered Subscription: $29/mo (Basic) | $99/mo (Pro) | $499/mo (Enterprise).\n\n👟 NEXT STEPS:\n1. Build a simple waitlist landing page.\n2. Cold Outreach 100 potential users on LinkedIn to validate.\n3. Build an MVP (Minimum Viable Product) without code if possible.\n4. Launch to a closed beta of 10 users.";
        break;
      case "linkedin_roast":
        text = "Your LinkedIn headline says 'Helping companies grow' — wow, so specific, just like the other 50 million people on this platform. Your profile picture looks like it was cropped from a group photo at a wedding. And your 'About' section is just a dump of buzzwords. If you want to stand out, stop trying to sound like a corporate robot and show some actual personality and concrete results!";
        break;
      default:
        text = `Demo mock response for feature: ${feature}. You provided: ${prompt}`;
    }

    // Simulate validation/generation latency for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ result: text })
  } catch (err: any) {
    console.error("AI error mock fallback:", err)
    return NextResponse.json(
      { error: "Internal service error fallback." },
      { status: 500 }
    )
  }
}
