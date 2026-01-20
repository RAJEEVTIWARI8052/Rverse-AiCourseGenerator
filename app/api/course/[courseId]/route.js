import { NextResponse } from "next/server";
// Rebuild trigger
import { db } from "../../../../configs/db.server";
import { CourseList } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    // Await params before destructuring
    const { courseId } = await params;
    console.log("Fetching courseId:", courseId);

    const course = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId));

    if (!course || course.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course[0]);
  } catch (err) {
    console.error("Get course error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    // Await params before destructuring
    const { courseId } = await params;
    const body = await req.json();

    if (!body.courseOutput) {
      return NextResponse.json({ error: "Missing courseOutput" }, { status: 400 });
    }

    const result = await db
      .update(CourseList)
      .set({ courseOutput: JSON.stringify(body.courseOutput) })
      .where(eq(CourseList.courseId, courseId))
      .returning({ courseId: CourseList.courseId });

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course updated successfully", updated: result[0] });
  } catch (err) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Await params before destructuring
    const { courseId } = await params;

    const result = await db
      .delete(CourseList)
      .where(eq(CourseList.courseId, courseId))
      .returning({ courseId: CourseList.courseId });

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Course deleted successfully",
      deletedCourseId: result[0].courseId
    });
  } catch (err) {
    console.error("Delete course error:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}