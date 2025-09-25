import React from "react";
import { HiOutlineChartBar } from "react-icons/hi2";
import { CiClock2 } from "react-icons/ci";
import { FaBookOpen, FaPlayCircle } from "react-icons/fa";

function CourseDetail({ course }) {
  let output = {};
  try {
    output = course?.courseOutput ? JSON.parse(course.courseOutput) : {};
  } catch {
    output = {};
  }

  return (
    <div className="border p-6 rounded-xl shadow-sm mt-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="flex gap-2">
          <HiOutlineChartBar className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xs text-gray-500">Skill Level</h2>
            <h2 className="font-medium text-lg">
              {output?.level || "N/A"}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <CiClock2 className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xs text-gray-500">Duration</h2>
            <h2 className="font-medium text-lg">
              {output?.duration || "N/A"}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <FaBookOpen className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xs text-gray-500">No of Chapters</h2>
            <h2 className="font-medium text-lg">
              {output?.chapters?.length || "0"}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <FaPlayCircle className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xs text-gray-500">Include video</h2>
            <h2 className="font-medium text-lg">
              {course?.includeVideo || "N/A"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
