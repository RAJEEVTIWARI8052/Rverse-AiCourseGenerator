"use client";
import React, { useEffect, useState, use } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

function CourseStart({ params }) {
  const { courseId } = use(params);

  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();

  const GetCourse = React.useCallback(async () => {
    try {
      console.log("🔍 DEBUG: Fetching full course info via API for ID:", courseId);

      const response = await fetch(`/api/course/${courseId}/full`);
      if (!response.ok) throw new Error("Failed to fetch course data");

      const parsedOutput = await response.json();
      const enrichedChapters = parsedOutput.chapters || parsedOutput.Chapters || [];

      setCourse(parsedOutput);

      if (enrichedChapters.length > 0) {
        console.log("🔍 DEBUG: Selecting first enriched chapter");
        setSelectedChapter(enrichedChapters[0]);
      }
    } catch (error) {
      console.error("❌ Error in GetCourse:", error);
    }
  }, [courseId]);

  useEffect(() => {
    GetCourse();
  }, [GetCourse]);

  return (
    <div className="flex">
      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-blue-500 p-4 text-white">
          {course?.chapterTitle || course?.courseTitle}
        </h2>

        <div>
          {(course?.chapters || course?.Chapters || []).map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-blue-50 ${(selectedChapter?.chapterTitle || selectedChapter?.chapterName || selectedChapter?.ChapterName) ===
                  (chapter?.chapterTitle || chapter?.chapterName || chapter?.ChapterName)
                  ? "bg-purple-100"
                  : ""
                }`}
              onClick={() => {
                console.log("🔍 DEBUG: Chapter clicked:", chapter);
                setSelectedChapter(chapter);
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="md:ml-72 flex-1">
        <ChapterContent chapter={selectedChapter} />
      </div>
    </div>
  );
}

export default CourseStart;