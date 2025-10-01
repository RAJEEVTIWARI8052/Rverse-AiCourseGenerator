import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key check
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Try multiple models in order of preference
const MODELS_TO_TRY = [
  "gemini-1.5-flash-002",  // Latest stable 1.5 Flash
  "gemini-1.5-flash",      // Current stable
  "gemini-1.5-flash-001",  // Older stable
  "gemini-2.0-flash-001",  // 2.0 stable (if available)
];

export async function generateCourseLayout(prompt, retries = 5) {
  let lastError = null;

  // Try each model
  for (const modelName of MODELS_TO_TRY) {
    console.log(`Trying model: ${modelName}`);
    
    try {
      const model = ai.getGenerativeModel({ model: modelName });
      
      // Try generating content with this model
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          console.log(`✅ Success with model: ${modelName}`);
          return text;
        } catch (err) {
          lastError = err;
          console.error(`Attempt ${attempt + 1}/${retries} failed:`, err.message);

          // Check if it's a rate limit or overload error
          const isRetryable = 
            err.message?.includes("overloaded") ||
            err.message?.includes("429") ||
            err.message?.includes("quota") ||
            err.message?.includes("RESOURCE_EXHAUSTED");

          // If not retryable (like 404), break and try next model
          if (err.message?.includes("404") || err.message?.includes("not found")) {
            console.log(`Model ${modelName} not found, trying next model...`);
            break;
          }

          // If it's the last attempt with this model, move to next model
          if (attempt === retries - 1) {
            break;
          }

          // Only retry if it's a retryable error
          if (isRetryable) {
            const waitTime = Math.min(2000 * Math.pow(2, attempt), 20000);
            console.log(`Waiting ${waitTime / 1000}s before retry...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            break; // Don't retry non-retryable errors
          }
        }
      }
    } catch (modelError) {
      console.error(`Failed to initialize model ${modelName}:`, modelError.message);
      lastError = modelError;
      continue; // Try next model
    }
  }

  // If all models failed, throw error
  throw new Error(
    `All models failed. Last error: ${lastError?.message || "Unknown error"}. ` +
    `Please check your API key at https://aistudio.google.com/app/apikey`
  );
}

// Alternative: Generate with streaming (often more reliable)
export async function generateCourseLayoutStreaming(prompt, retries = 3) {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = ai.getGenerativeModel({ model: modelName });
      
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const result = await model.generateContentStream(prompt);
          let text = "";
          
          for await (const chunk of result.stream) {
            text += chunk.text();
          }
          
          console.log(`✅ Streaming success with model: ${modelName}`);
          return text;
        } catch (err) {
          lastError = err;
          
          if (err.message?.includes("404") || err.message?.includes("not found")) {
            break;
          }

          if (attempt === retries - 1) break;

          const waitTime = Math.min(2000 * Math.pow(2, attempt), 20000);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    } catch (modelError) {
      lastError = modelError;
      continue;
    }
  }

  throw new Error(`Streaming failed: ${lastError?.message}`);
}