import { NextResponse } from "next/server";
import { db } from "../../../../../configs/db.server";
import { CourseList, Chapters } from "../../../../../configs/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req, { params }) {
    try {
        const { courseId } = await params;

        // Fetch course details
        const courseRes = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.courseId, courseId));

        if (!courseRes || courseRes.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Fetch chapters ordered by index then id for legacy compatibility
        let chaptersRes;
        try {
            chaptersRes = await db
                .select()
                .from(Chapters)
                .where(eq(Chapters.courseId, courseId))
                .orderBy(asc(Chapters.chapterIndex), asc(Chapters.id));
        } catch (dbError) {
            console.warn("⚠️ API: chapterIndex missing, falling back to ID order.");
            chaptersRes = await db
                .select()
                .from(Chapters)
                .where(eq(Chapters.courseId, courseId))
                .orderBy(asc(Chapters.id));
        }

        let parsedOutput = JSON.parse(courseRes[0].courseOutput);
        const layoutChapters = parsedOutput.chapters || parsedOutput.Chapters || [];

        // Merge logic using chapterIndex for robustness
        const enrichedChapters = layoutChapters.map((chapter, index) => {
            // Find the database record that matches this layout index
            const dbChapter = chaptersRes.find(c => c.chapterIndex === index) || chaptersRes[index];

            if (dbChapter) {
                console.log(`🔍 API: Merging DB content for chapter ${index}. VideoId: ${dbChapter.videoId}`);

                // dbChapter.content is a JSON object stored in the DB
                const content = typeof dbChapter.content === 'string'
                    ? JSON.parse(dbChapter.content)
                    : dbChapter.content;

                return {
                    ...chapter,      // original layout info (title, about, duration)
                    ...content,      // detailed content (fields, etc.)
                    videoId: dbChapter.videoId || chapter.videoId || null,
                    id: dbChapter.id
                };
            }
            console.warn(`⚠️ API: No DB match for chapter index ${index}`);
            return chapter;
        });

        // Update parsedOutput with enriched chapters
        if (parsedOutput.chapters) parsedOutput.chapters = enrichedChapters;
        else if (parsedOutput.Chapters) parsedOutput.Chapters = enrichedChapters;

        return NextResponse.json(parsedOutput);
    } catch (error) {
        console.error("Error fetching full course info:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
