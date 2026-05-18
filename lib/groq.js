import Groq from "groq-sdk";

let apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

// Clean API Key from potential quotes
if (apiKey) {
    apiKey = apiKey.replace(/^["']|["']$/g, '');
}

if (!apiKey || apiKey === "dummy_key_for_build") {
    console.warn("⚠️ Groq: API key is missing or dummy. Generation will fail.");
}

// Initialize Groq client
const groq = new Groq({
    apiKey: apiKey || "dummy_key_for_build",
    dangerouslyAllowBrowser: true
});

export async function generateCourseLayout(prompt) {
    if (!apiKey || apiKey === "dummy_key_for_build") {
        if (typeof window !== "undefined") {
            throw new Error("NEXT_PUBLIC_GROQ_API_KEY is not set. Please add it to your .env file.");
        }
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an AI specialized in generating educational course content in JSON format. This content is for educational and theoretical purposes only. Always return valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 8192,
        });

        const content = chatCompletion.choices[0]?.message?.content || "";
        // Strip markdown code fences that LLMs sometimes add despite instructions
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        return cleanContent;
    } catch (error) {
        console.error("Groq Course Layout Error:", error);
        throw new Error("Failed to generate course layout: " + error.message);
    }
}

export async function generateQuiz(topic, difficulty, numberOfQuestions = 10) {
    const prompt = `Generate ${numberOfQuestions} multiple-choice questions for a quiz on "${topic}" with difficulty "${difficulty}". 
    Format the output as a JSON array of objects, where each object has:
    - question: The question text
    - options: An array of 4 options
    - answer: The correct option string
    
    Example JSON:
    [
      {
        "question": "What is AI?",
        "options": ["Artificial Intelligence", "Apple Inc", "Automated Interface", "None"],
        "answer": "Artificial Intelligence"
      }
    ]
    Return ONLY the JSON array, no markdown formatting or extra text.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generation AI for educational purposes. Output strict JSON only. Do not wrap in markdown code blocks."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        return cleanContent;
    } catch (error) {
        console.error("Groq Quiz Generation Error:", error);
        throw new Error("Failed to generate quiz: " + error.message);
    }
}

export async function generateChapterContent(chapterName) {
    const prompt = `
    Explain the concept in Detail on Topic: ${chapterName}.
    Generate the tutorial in JSON format. 
    Structure:
    {
      "chapterName": "string",
      "about": "string",
      "fields": [
        {
          "fieldName": "Sub-topic Name",
          "description": "Detailed explanation (2-3 paragraphs)",
          "codeExample": "Code snippet if applicable"
        }
      ]
    }
    
    Return ONLY valid JSON.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an educational content generator specialized in detailed technical tutorials. Output strict JSON only. Do not include markdown code blocks."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        return cleanContent;
    } catch (error) {
        console.error("Groq Chapter Content Error:", error);
        throw new Error("Failed to generate chapter content: " + error.message);
    }
}
