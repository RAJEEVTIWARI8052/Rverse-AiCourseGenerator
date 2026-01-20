import { NextResponse } from "next/server";
import { generateQuiz } from "../../../../lib/groq";

export async function POST(req) {
    try {
        const { topic, difficulty, number } = await req.json();
        const quizJson = await generateQuiz(topic, difficulty, number);

        // Parse the JSON string returned by Groq
        const quiz = JSON.parse(quizJson);

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("Quiz API Error:", error);
        return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
    }
}
