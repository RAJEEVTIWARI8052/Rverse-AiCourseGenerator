"use client";

import React, { useEffect, useState, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { eq, or } from "drizzle-orm";

import { db } from "../../../configs/db.server";
import { CourseList } from "../../../configs/schema";
import CourseCard from "./CourseCard";
import UserCourseListContext from "../../_context/UserCourseListContext";

function UserCourseList() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const { setUserCourseList } = useContext(UserCourseListContext);

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const fetchUserCourses = async () => {
    try {
      const res = await db
        .select()
        .from(CourseList)
        .where(
          or(
            eq(CourseList.createdBy, user?.id), // Clerk user ID
            eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress) // optional for old records
          )
        );

      // Update context
      setUserCourseList(res);

      // Safely parse courseOutput JSON and handle missing banner
      const parsedCourses = res.map((c) => ({
        ...c,
        courseOutput: c.courseOutput
          ? JSON.parse(c.courseOutput)
          : { course: { numberOfChapters: 0 } },
        courseBanner: c.courseBanner || "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
      }));

      setCourses(parsedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="mt-10 font-medium">My AI Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              course={course}
              key={course.courseId} // use unique ID
              refreshData={() => fetchUserCourses()}
            />
          ))
        ) : (
          <p>No courses found</p>
        )}
      </div>
    </div>
  );
}

export default UserCourseList;
