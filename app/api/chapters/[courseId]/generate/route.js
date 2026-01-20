import { db } from "../../../../../configs/db.server";
import { Chapters, CourseList } from "../../../../../configs/schema";
import { NextResponse } from "next/server";
import { getVideos } from "../../../../../configs/service";
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

    // Process each chapter to add videos
    for (const chapter of chapters) {
      let videoId = null;
      try {
        const chapterTitle = chapter.chapterName || chapter.ChapterName || chapter.name || "AI Course";
        // Get videos from YouTube API
        const query = chapterTitle + " course";
        const videos = await getVideos(query);
        if (videos && videos.length > 0) {
          videoId = videos[0].id.videoId;
        }
      } catch (e) {
        console.error("Video fetch failed:", e);
      }

      // Save chapter to DB
      await db.insert(Chapters).values({
        courseId: courseId,
        content: JSON.stringify(chapter),
        videoId: videoId,
        userName: course[0].userName
      });
    }

    // Mark course as published
    await db.update(CourseList).set({ publish: true }).where(eq(CourseList.courseId, courseId));

    return NextResponse.json({ result: "Chapters generated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}