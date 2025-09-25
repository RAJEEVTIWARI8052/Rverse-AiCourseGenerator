"use client";
import React, { useEffect, useState, use } from "react";
import { CourseList } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../configs/db.server";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

function CourseStart({ params }) {
  const { courseId } = use(params);

  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();

  useEffect(() => {
    GetCourse();
  }, []);

  const GetCourse = async () => {
    try {
      console.log("🔍 DEBUG: Fetching course for ID:", courseId);
      
      const res = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));

      console.log("🔍 DEBUG: Raw database result:", res);

      if (res.length > 0) {
        console.log("🔍 DEBUG: Raw courseOutput:", res[0].courseOutput);
        
        let parsedOutput;
        try {
          parsedOutput = JSON.parse(res[0].courseOutput);
          console.log("🔍 DEBUG: Parsed output:", parsedOutput);
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
          console.log("❌ Invalid JSON:", res[0].courseOutput);
          return;
        }

        setCourse(parsedOutput);
        
        // ✅ FIXED: Better initial chapter selection
        if (parsedOutput.chapters && parsedOutput.chapters.length > 0) {
          console.log("🔍 DEBUG: Setting first chapter:", parsedOutput.chapters[0]);
          setSelectedChapter(parsedOutput.chapters[0]);
        } else {
          // If no subchapters, use the main chapter
          console.log("🔍 DEBUG: No subchapters, using main chapter");
          setSelectedChapter(parsedOutput);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching course:", error);
    }
  };

  return (
    <div className="flex">
      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-blue-500 p-4 text-white">
          {course?.chapterTitle || course?.courseTitle}
        </h2>

        <div>
          {course?.chapters?.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-blue-50 ${
                // ✅ FIXED: Compare using chapterTitle instead of chapterName
                selectedChapter?.chapterTitle === chapter?.chapterTitle
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