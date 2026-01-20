import { NextResponse } from "next/server";
import { db } from "../../../../configs/db.server";
import { CourseList } from "../../../../configs/schema";
import { desc } from "drizzle-orm";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = parseInt(searchParams.get("pageIndex")) || 0;
        const limit = 9;
        const offset = pageIndex * limit;

        // OPTIMIZATION: We select specific fields to avoid sending the massive courseOutput
        // but we need enough for CourseCard. CourseCard needs courseOutput to get chapter count.
        // We might want to keep it but it's the "Serializing big strings" culprit.
        const courses = await db
            .select({
                id: CourseList.id,
                courseId: CourseList.courseId,
                name: CourseList.name,
                category: CourseList.category,
                level: CourseList.level,
                courseBanner: CourseList.courseBanner,
                userName: CourseList.userName,
                userProfileImage: CourseList.userProfileImage,
                noOfChapters: CourseList.noOfChapters,
                // courseOutput is excluded here if we use noOfChapters instead
            })
            .from(CourseList)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(CourseList.id));

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error fetching explore courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
