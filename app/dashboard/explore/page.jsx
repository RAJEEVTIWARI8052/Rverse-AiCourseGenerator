"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../configs/db.server";
import { CourseList } from "../../../configs/schema";
import CourseCard from "../_components/CourseCard";
import { Button } from "../../../components/button"; // ✅ assuming shadcn button

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const GetAllCourse = React.useCallback(async () => {
    try {
      const res = await db
        .select()
        .from(CourseList)
        .limit(9)
        .offset(pageIndex * 9);

      setCourseList(res);
      console.log("Fetched courses:", res);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [pageIndex]);

  useEffect(() => {
    GetAllCourse();
  }, [GetAllCourse]);

  return (
    <div>
      <h2 className="font-bold text-3xl">Explore More Projects</h2>
      <p>Explore more projects built by AI from other users</p>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 mt-4">
        {courseList.map((course, index) => (
          <div key={index}>
            <CourseCard course={course} displayUser={true} />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-5">
        {pageIndex !== 0 && (
          <Button onClick={() => setPageIndex((prev) => prev - 1)}>Prev Page</Button>
        )}
        <Button onClick={() => setPageIndex((prev) => prev + 1)}>Next Page</Button>
      </div>
    </div>
  );
}

export default Explore;
