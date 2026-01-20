import { db } from "../../../../../configs/db.server";
import { Chapters, CourseList } from "../../../../../configs/schema";
import { NextResponse } from "next/server";
import { getVideos } from "../../../../../configs/service";
import { generateChapterContent } from "../../../../../lib/groq";
import { eq } from "drizzle-orm";

export async function POST(req, { params }) {
  try {
    const { courseId } = await params;

    // Fetch course layout from DB
    const course = await db.select().from(CourseList).where(eq(CourseList.courseId, courseId));

    if (!course?.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = JSON.parse(course[0].courseOutput);

    // Clear existing chapters
    await db.delete(Chapters).where(eq(Chapters.courseId, courseId));

    const chapters = courseData.chapters || courseData.Chapters || [];

    // Process each chapter with explicit index for deterministic ordering
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const chapterTitle = chapter.chapterName || chapter.ChapterName || chapter.name || "AI Chapter";
      console.log(`🚀 DEBUG: Generating full content for chapter ${i}: ${chapterTitle}`);

      let videoId = null;
      let detailedContent = {};

      try {
        // 1. Generate Detailed AI Content (Text/Code)
        console.log(`🔍 DEBUG: Generation started for ${chapterTitle}`);
        const aiResponse = await generateChapterContent(chapterTitle);
        try {
          detailedContent = JSON.parse(aiResponse);
          console.log(`✅ DEBUG: AI Content generated for ${chapterTitle}`);
        } catch (pErr) {
          console.error(`❌ JSON Parse failed for ${chapterTitle}:`, pErr);
          console.log("Raw AI Response:", aiResponse);
        }

        // 2. Get Video from YouTube
        const query = (chapter.chapterName || chapter.chapterTitle || chapter.name) + " " + (courseData.category || "");
        console.log(`🔍 DEBUG: YouTube Search query: "${query}"`);
        const videos = await getVideos(query);
        if (videos && videos.length > 0) {
          videoId = videos[0].id.videoId;
          console.log(`✅ DEBUG: Video found for ${chapterTitle}: ${videoId}`);
        } else {
          console.warn(`⚠️ DEBUG: No video found for ${chapterTitle}`);
        }

      } catch (e) {
        console.error(`❌ Internal generation error for ${chapterTitle}:`, e);
      }

      // Merge layout data with AI-generated detailed content
      const mergedContent = {
        ...chapter,      // original layout info (title, about, duration)
        ...detailedContent // detailed content (fields, etc.)
      };

      // Save chapter to DB with explicit order index
      await db.insert(Chapters).values({
        courseId: courseId,
        content: JSON.stringify(mergedContent),
        videoId: videoId,
        userName: course[0].userName,
        chapterIndex: i
      });
    }


    // Mark course as published
    await db.update(CourseList).set({ publish: true }).where(eq(CourseList.courseId, courseId));

    return NextResponse.json({ result: "Full content generated successfully" });
  } catch (e) {
    console.error("🏁 Generation Route Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}