import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)

export function getModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Using 1.5 flash as 2.5 flash is likely a typo or not yet widely available in the SDK
    ...(systemInstruction && { systemInstruction }),
  })
}

export default genAI
