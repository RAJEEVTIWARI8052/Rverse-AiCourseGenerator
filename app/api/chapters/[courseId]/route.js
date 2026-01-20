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
      // Try ordering by new chapterIndex column
      chapters = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, courseId))
        .orderBy(asc(Chapters.chapterIndex));
    } catch (dbError) {
      console.warn("⚠️ API: chapterIndex column might be missing. Falling back to ID ordering.", dbError.message);
      // Fallback to order by ID if column doesn't exist yet in DB
      chapters = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, courseId))
        .orderBy(asc(Chapters.id));
    }

    console.log("Fetched chapters:", chapters.length);
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("❌ Fatal Error fetching chapters:", error);
    return NextResponse.json({
      error: "Failed to fetch chapters",
      details: error.message
    }, { status: 500 });
  }
}
