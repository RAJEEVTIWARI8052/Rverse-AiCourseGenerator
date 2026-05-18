"use client";

import React, { useEffect, useState, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
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
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black gradient-text">Your Courses</h2>
          <p className="text-gray-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-purple-500/30 to-transparent" />
        <div className="glass px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold text-gray-400">
          History
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              course={course}
              key={course.courseId}
              refreshData={() => fetchUserCourses()}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">Generate your first AI-powered course and it will appear here</p>
          <Link href="/create-course" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all">
            + Create First Course
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserCourseList;
