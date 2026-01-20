import { neon } from "@neondatabase/serverless";
// Force rebuild
import { drizzle } from "drizzle-orm/neon-http";
import { CourseList, Chapters } from "./schema";

let dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL is missing in environment variables");
  throw new Error("DATABASE_URL not set");
}

// Strip potential literal quotes if pasted incorrectly into Vercel/env
dbUrl = dbUrl.replace(/^["']|["']$/g, '');

console.log("🔍 DB: Initializing with URL (masked):", dbUrl.substring(0, 20) + "...");

const sql = neon(dbUrl);
export const db = drizzle(sql);

// Insert course with fallback banner
export async function insertCourse(values) {
  try {
    if (!values.courseBanner) {
      values.courseBanner =
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80';
    }

    const [course] = await db.insert(CourseList).values(values).returning();
    return course;
  } catch (error) {
    console.error("InsertCourse error:", error);
    throw error;
  }
}

// Insert chapter
export async function insertChapter(courseId, chapterData) {
  try {
    const [chapter] = await db
      .insert(Chapters)
      .values({ courseId, ...chapterData })
      .returning();
    return chapter;
  } catch (error) {
    console.error("InsertChapter error:", error);
    throw error;
  }
}
