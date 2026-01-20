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
    <div className="group hover:scale-105 transition-all duration-300 ease-in-out">
      <div className="shadow-lg rounded-xl flex flex-col gap-3 p-3 glass border border-white/10 cursor-pointer h-full">
        <Link href={`/create-course/${course.courseId}`} passHref>
          <div className="relative h-[180px] w-full rounded-lg overflow-hidden">
            <Image
              loader={({ src }) => src}
              src={bannerUrl}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              alt={course?.name || "Course image"}
            />
          </div>
        </Link>

        <div className="p-2 flex-col flex justify-between flex-1">
          <div>
            <h2 className="font-bold text-lg flex items-center justify-between mb-1">
              <Link href={`/create-course/${course.courseId}`} className="line-clamp-1 hover:text-purple-500 transition-colors">
                {course?.name || "Untitled Course"}
              </Link>
              <DropDownoptions handleOnDelete={handleOnDelete}>
                <IoEllipsisVerticalOutline className="text-gray-500 hover:text-black dark:hover:text-white" />
              </DropDownoptions>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded w-fit">
              {course?.category || "Uncategorized"}
            </p>
          </div>

          <div className="mt-4 flex gap-2 items-center justify-between">
            <h2 className="flex gap-1 items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded">
              <IoBookOutline />
              {numberOfChapters} Chapters
            </h2>
            <h2 className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded px-2 py-1">
              {level}
            </h2>
          </div>

          <div className='flex gap-2 items-center mt-3 border-t border-gray-100 dark:border-gray-800 pt-3'>
            {course?.userProfileImage ? (
              <Image
                src={course.userProfileImage}
                width={25}
                height={25}
                alt="User Profile"
                className="rounded-full"
              />
            ) : (
              <div className="w-[25px] h-[25px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">
                {course?.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <h2 className='text-xs text-gray-500'>{course.userName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;