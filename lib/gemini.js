import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCourseLayout(prompt, retries = 3) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API failed:", err);

    if (retries > 0) {
      console.log(`Retrying... (${3 - retries + 1})`);
      await new Promise(r => setTimeout(r, 1000 * (4 - retries))); // 1s, 2s, 3s backoff
      return generateCourseLayout(prompt, retries - 1);
    }

    // Fallback response
    return JSON.stringify({
      courseTitle: "Temporary Course",
      description: "Gemini API is overloaded, please try again later.",
      chapters: []
    });
  }
}
