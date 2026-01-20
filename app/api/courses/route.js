import { NextResponse } from "next/server";
import { db } from "../../../configs/db.server";
import { CourseList } from "../../../configs/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(req) {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");

    if (!userEmail && !userId) {
        return NextResponse.json({ error: "User identity is required" }, { status: 401 });
    }

    try {
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

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error fetching user courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
