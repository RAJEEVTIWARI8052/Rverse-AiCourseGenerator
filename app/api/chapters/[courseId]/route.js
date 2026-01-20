import { NextResponse } from "next/server";      // <-- Needed for response
import { db } from "../../../../configs/db.server"; // <-- Needed to access your DB
import { Chapters } from "../../../../configs/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { courseId } = await params;
    const userEmail = req.headers.get("x-user-email");

    console.log("API GET /chapters called for course:", courseId);
    console.log("User:", userEmail);

    if (!userEmail)
      return NextResponse.json({ error: "User email is required" }, { status: 401 });
    if (!courseId)
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });

    let chapters;
    try {
      console.log("🔍 API: Executing select query...");
      chapters = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, courseId));

      console.log(`✅ API: Found ${chapters.length} chapters raw`);

      // Manual sort: chapterIndex first, then id as fallback for older courses
      chapters.sort((a, b) => {
        if (a.chapterIndex !== b.chapterIndex) {
          return (a.chapterIndex ?? 0) - (b.chapterIndex ?? 0);
        }
        return a.id - b.id; // Deterministic fallback
      });

    } catch (dbError) {
      console.error("❌ API: DB Query error:", dbError);
      throw dbError;
    }

    console.log("🚀 API: Final sorted chapters count:", chapters.length);
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("❌ Fatal Error fetching chapters:", error);
    return NextResponse.json({
      error: "Failed to fetch chapters",
      details: error.message
    }, { status: 500 });
  }
}
