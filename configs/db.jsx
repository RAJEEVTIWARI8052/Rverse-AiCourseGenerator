// db.jsx
import { db } from "./db.server";
import { Chapters } from "./schema";

// Insert a chapter
export async function insertChapter(courseId, chapterData) {
  try {
    const [chapter] = await db
      .insert(Chapters)
      .values({ courseId, ...chapterData }) // chapterData = { content, userName, videoId }
      .returning();
    return chapter;
  } catch (error) {
    console.error("InsertChapter error:", error?.message, error);
    throw error;
  }
}
