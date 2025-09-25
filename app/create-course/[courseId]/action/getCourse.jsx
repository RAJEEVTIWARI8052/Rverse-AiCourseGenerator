// app/create-course/[courseId]/action/getCourse.js
"use server";

import { db } from "../../../../configs/db.server";
import { CourseList } from "../../../../configs/schema";
import { and, eq } from "drizzle-orm";

export async function getCourse(courseId, email) {
  try {
    if (!courseId || !email) return null;

    const [row] = await db
      .select()
      .from(CourseList)
      .where(and(eq(CourseList.courseId, courseId), eq(CourseList.createdBy, email)));

    return row || null;
  } catch (err) {
    console.error("getCourse error:", err);
    return null;
  }
}
