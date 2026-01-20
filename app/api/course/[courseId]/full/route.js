import { NextResponse } from "next/server";
import { db } from "../../../../../configs/db.server";
import { CourseList, Chapters } from "../../../../../configs/schema";
import { eq } from "drizzle-orm";

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

        // Fetch chapters
        const chaptersRes = await db
            .select()
            .from(Chapters)
            .where(eq(Chapters.courseId, courseId))
            .orderBy(Chapters.id);

        let parsedOutput = JSON.parse(courseRes[0].courseOutput);
        const layoutChapters = parsedOutput.chapters || parsedOutput.Chapters || [];

        // Merge logic on the server
        const enrichedChapters = layoutChapters.map((chapter, index) => {
            const dbChapter = chaptersRes[index];
            if (dbChapter) {
                return {
                    ...chapter,
                    videoId: dbChapter.videoId
                    // Note: If you want to include full chapter content, do it here
                };
            }
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
