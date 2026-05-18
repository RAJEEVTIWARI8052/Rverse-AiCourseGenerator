import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    // 1. Fetch high-accuracy transcription from YouTube (Open Source reference: youtube-transcript)
    let transcriptText = "";
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
      transcriptText = transcript.map(t => t.text).join(' ');
    } catch (err) {
      console.error("Transcription fetch error:", err);
      return NextResponse.json({ error: "Could not fetch transcription for this video. Ensure it has captions enabled." }, { status: 400 });
    }

    // Limit transcript length to avoid token limits on Groq
    const limitedTranscript = transcriptText.substring(0, 15000);

    // 2. Initialize Groq SDK (Best free API for Llama-3)
    const groq = new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY
    });

    // 3. Generate Notes and MCQs via Groq Llama 3 API
    const prompt = `
      You are an expert educator. Based on the following video transcription, please generate:
      1. Comprehensive Notes summarizing the key concepts.
      2. 5 Multiple Choice Questions (MCQs) with 4 options each and the correct answer indicated.

      Format the output clearly using Markdown.

      Transcription:
      "${limitedTranscript}"
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192", // Fast and highly accurate free model
      temperature: 0.7,
    });

    const aiContent = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({
      transcription: transcriptText,
      studyMaterial: aiContent
    });

  } catch (error) {
    console.error("Video Intel Error:", error);
    return NextResponse.json({ error: "Failed to process video intelligence" }, { status: 500 });
  }
}
