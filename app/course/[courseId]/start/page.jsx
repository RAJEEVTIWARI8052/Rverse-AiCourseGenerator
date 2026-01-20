"use client";
import React, { useEffect, useState, use } from "react";
import { CourseList, Chapters } from "../../../../configs/schema";
import { eq, and } from "drizzle-orm";
import { db } from "../../../../configs/db.server";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

function CourseStart({ params }) {
  const { courseId } = use(params);

  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();

  const GetCourse = React.useCallback(async () => {
    try {
      console.log("🔍 DEBUG: Fetching course start info for ID:", courseId);

      const res = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));

      const chaptersRes = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, courseId))
        .orderBy(Chapters.id); // 🔥 CRITICAL: Sort by ID to match generation order

      console.log("🔍 DEBUG: Chapters fetched from DB:", chaptersRes.length);

      if (res.length > 0) {
        let parsedOutput = JSON.parse(res[0].courseOutput);
        const layoutChapters = parsedOutput.chapters || parsedOutput.Chapters || [];

        // ✅ SOLUTION: Merge by index. This is the most reliable way 
        // since we insert them into the DB in the same order as the layout.
        const enrichedChapters = layoutChapters.map((chapter, index) => {
          const dbChapter = chaptersRes[index];
          if (dbChapter) {
            console.log(`✅ Chapter ${index} matched. VideoId:`, dbChapter.videoId);
            return {
              ...chapter,
              videoId: dbChapter.videoId
            };
          }
          console.warn(`❌ No DB match for chapter index ${index}`);
          return chapter;
        });

        // Update parsedOutput
        if (parsedOutput.chapters) parsedOutput.chapters = enrichedChapters;
        else if (parsedOutput.Chapters) parsedOutput.Chapters = enrichedChapters;

        setCourse(parsedOutput);

        if (enrichedChapters.length > 0) {
          console.log("🔍 DEBUG: Selecting first enriched chapter with VideoId:", enrichedChapters[0].videoId);
          setSelectedChapter(enrichedChapters[0]);
        }
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
          {/* ✅ FIXED: Use enriched chapters with videoId */}
          {(course?.chapters || course?.Chapters || []).map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-blue-50 ${
                // ✅ FIXED: Compare using chapterTitle instead of chapterName
                (selectedChapter?.chapterTitle || selectedChapter?.chapterName || selectedChapter?.ChapterName) ===
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