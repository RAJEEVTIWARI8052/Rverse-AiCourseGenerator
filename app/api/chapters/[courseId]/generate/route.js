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

    // Process each chapter
    for (const chapter of chapters) {
      const chapterTitle = chapter.chapterName || chapter.ChapterName || chapter.name || "AI Course";
      console.log(`🚀 DEBUG: Generating full content for chapter: ${chapterTitle}`);

      let videoId = null;
      let detailedContent = {};

      try {
        // 1. Generate Detailed AI Content (Text/Code)
        const aiResponse = await generateChapterContent(chapterTitle);
        try {
          detailedContent = JSON.parse(aiResponse);
        } catch (pErr) {
          console.error(`❌ JSON Parse failed for ${chapterTitle}:`, pErr);
        }

        // 2. Get Video from YouTube
        const query = chapterTitle + " " + (courseData.category || "");
        const videos = await getVideos(query);
        if (videos && videos.length > 0) {
          videoId = videos[0].id.videoId;
        }

      } catch (e) {
        console.error(`❌ Internal generation error for ${chapterTitle}:`, e);
      }

      // Merge layout data with AI-generated detailed content
      const mergedContent = {
        ...chapter,
        ...detailedContent
      };

      // Save chapter to DB
      await db.insert(Chapters).values({
        courseId: courseId,
        content: JSON.stringify(mergedContent),
        videoId: videoId,
        userName: course[0].userName
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