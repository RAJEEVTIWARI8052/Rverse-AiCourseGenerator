"use client";

import React, { useEffect, useState, useContext } from "react";
import { useUser } from "@clerk/nextjs";
// Imports removed
import CourseCard from "./CourseCard";
import UserCourseListContext from "../../_context/UserCourseListContext";

function UserCourseList() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const { setUserCourseList } = useContext(UserCourseListContext);

  const fetchUserCourses = React.useCallback(async () => {
    try {
      const response = await fetch("/api/courses", {
        headers: {
          "x-user-email": user?.primaryEmailAddress?.emailAddress,
          "x-user-id": user?.id,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch courses");
      }

      const res = await response.json();

      // Update context
      setUserCourseList(res);

      // Handle missing banner and type conversion
      const parsedCourses = res.map((c) => ({
        ...c,
        courseOutput: { course: { numberOfChapters: Number(c.noOfChapters) || 0 } }, // Mock structure for Card compatibility
        courseBanner: c.courseBanner || "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
      }));

      setCourses(parsedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }, [user, setUserCourseList]);

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user, fetchUserCourses]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold gradient-text mb-6">My AI Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
