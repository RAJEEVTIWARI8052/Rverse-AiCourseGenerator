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
    <div className="mt-8 mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/10 shadow-sm items-center">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-500">
            <HiOutlineChartBar className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Skill Level</h2>
            <h2 className="font-bold text-lg text-foreground">
              {output?.level || "N/A"}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/10 shadow-sm items-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-500">
            <CiClock2 className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Duration</h2>
            <h2 className="font-bold text-lg text-foreground">
              {output?.duration || "N/A"}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/10 shadow-sm items-center">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-500">
            <FaBookOpen className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Chapters</h2>
            <h2 className="font-bold text-lg text-foreground">
              {output?.chapters?.length || "0"}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/10 shadow-sm items-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-500">
            <FaPlayCircle className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Video</h2>
            <h2 className="font-bold text-lg text-foreground">
              {course?.includeVideo || "N/A"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
