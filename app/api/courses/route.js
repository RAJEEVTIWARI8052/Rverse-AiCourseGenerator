import { NextResponse } from "next/server";
import { db } from "../../../configs/db.server";
import { CourseList } from "../../../configs/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(req) {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");

    try {
        console.log("🔍 API: Fetching courses for:", { userEmail, userId });

        if (!userEmail && !userId) {
            console.error("❌ API: Missing user identity headers");
            return NextResponse.json({ error: "User identity is required" }, { status: 401 });
        }

        const conditions = [];
        if (userEmail) {
            conditions.push(eq(CourseList.createdBy, userEmail));
            conditions.push(eq(CourseList.userName, userEmail));
        }
        if (userId) {
            conditions.push(eq(CourseList.createdBy, userId));
        }

        const courses = await db
            .select()
            .from(CourseList)
            .where(or(...conditions))
            .orderBy(desc(CourseList.id));

        console.log(`✅ API: Found ${courses.length} courses`);
        return NextResponse.json(courses);
    } catch (error) {
        console.error("❌ API Error fetching user courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses: " + error.message }, { status: 500 });
    }
}
