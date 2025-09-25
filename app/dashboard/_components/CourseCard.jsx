import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoBookOutline, IoEllipsisVerticalOutline } from "react-icons/io5";
import DropDownoptions from "./DropDownoption";

// Utility function to safely parse course output
function parseCourseOutput(courseOutput) {
  if (!courseOutput) return 0;

  try {
    const parsed = typeof courseOutput === 'string'
      ? JSON.parse(courseOutput)
      : courseOutput;

    return parsed?.course?.numberOfChapters ||
      parsed?.numberOfChapters ||
      parsed?.chapters?.length ||
      0;
  } catch (error) {
    console.error("Error parsing courseOutput:", error);
    return 0;
  }
}

function CourseCard({ course, refreshData, displayUser = false }) {
  const bannerUrl =
    course?.courseBanner ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&crop=center";

  const numberOfChapters = parseCourseOutput(course?.courseOutput);
  const level = course?.level || "Beginner";

  const handleOnDelete = async (e) => {
    // Prevent the Link navigation when delete button is clicked
    e?.preventDefault();
    e?.stopPropagation();

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${course?.name}"?`)) {
      return;
    }

    try {
      console.log("Deleting course with ID:", course.courseId);

      // Use courseId instead of id to match your API route
      const response = await fetch(`/api/course/${course.courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }

      const result = await response.json();
      console.log("Delete result:", result);

      // Your API returns { message: "Course deleted successfully" } on success
      if (result.message) {
        console.log("Course deleted successfully, refreshing data...");
        // Call refreshData to update the parent component
        if (typeof refreshData === 'function') {
          await refreshData(); // Wait for refresh to complete
        } else {
          console.error("refreshData is not a function:", typeof refreshData);
        }
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      // Show user-friendly error message
      alert(`Failed to delete course: ${err.message}`);
    }
  };

  return (
    <div className="shadow-sm rounded-lg flex flex-col gap-3 p-2 border hover:scale-105 transition-all cursor-pointer">
      <Link href={`/create-course/${course.courseId}`} passHref>
        <div>
          <Image
            loader={({ src }) => src}
            src={bannerUrl}
            width={300}
            height={200}
            className="w-full h-[200px] object-cover rounded-md"
            alt={course?.name || "Course image"}
          />
        </div>
      </Link>

      <div className="p-2">
        <h2 className="font-medium text-lg flex items-center justify-between">
          <Link href={`/create-course/${course.courseId}`} className="flex-1 hover:text-blue-600">
            {course?.name || "Untitled Course"}
          </Link>
          <DropDownoptions handleOnDelete={handleOnDelete}>
            <IoEllipsisVerticalOutline />
          </DropDownoptions>
        </h2>
        <p className="text-sm text-gray-400">
          {course?.category || "Uncategorized"}
        </p>
      </div>

      <Link href={`/create-course/${course.courseId}`} passHref>
        <div className="flex gap-2 items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-blue-500 text-sm">
            <IoBookOutline />
            {numberOfChapters} Chapters
          </h2>
          <h2 className="text-sm bg-purple-50 text-blue-500 rounded-sm p-1">
            {level}
          </h2>
        </div>
      </Link>
      <div className='flex gap-2 items-center mt-52'>
        {course?.userProfileImage ? (
          <Image
            src={course.userProfileImage}
            width={35}
            height={35}
            alt="User Profile"
            className="rounded-full"
          />
        ) : (
          <div className="w-[35px] h-[35px] bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {course?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <h2 className='text-sm'>{course.userName}</h2>
      </div>
    </div>
  );
}

export default CourseCard;