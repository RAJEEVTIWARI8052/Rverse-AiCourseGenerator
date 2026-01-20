"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "../../../components/button";

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const GetAllCourse = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/explore?pageIndex=${pageIndex}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const res = await response.json();
      setCourseList(res);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
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
          <Button onClick={() => setPageIndex((prev) => prev - 1)} disabled={loading}>Prev Page</Button>
        )}
        <Button onClick={() => setPageIndex((prev) => prev + 1)} disabled={loading}>Next Page</Button>
      </div>
    </div>
  );
}

export default Explore;
