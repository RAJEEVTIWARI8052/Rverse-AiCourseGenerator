// app/api/chapters/[courseId]/route.js
import { db } from "../../../configs/db.server";
import { Chapters } from "../../../configs/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { courseId } = params;

  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  try {
    // Fetch chapters, order by content->>'chapterTitle'
    const chapters = await db
      .select()
      .from(Chapters)
      .where(eq(Chapters.courseId, courseId))
      .orderBy(sql`content->>'chapterTitle' ASC`);

    // Parse JSON content and ensure videoId exists
    const parsedChapters = chapters.map((ch) => {
      let content = {};
      try {
        content = typeof ch.content === "string" ? JSON.parse(ch.content) : ch.content;
      } catch (err) {
        console.warn("Failed to parse chapter content:", err);
      }

      // Ensure main videoId exists
      content.videoId = content.videoId || null;

      // Ensure each subchapter has videoId
      if (Array.isArray(content.chapters)) {
        content.chapters = content.chapters.map((sub) => ({
          ...sub,
          videoId: sub.videoId || content.videoId,
        }));
      }

      return {
        id: ch.id,
        courseId: ch.courseId,
        userName: ch.userName,
        content,
      };
    });

    return NextResponse.json(parsedChapters);
  } catch (err) {
    console.error("Error fetching chapters:", err);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
