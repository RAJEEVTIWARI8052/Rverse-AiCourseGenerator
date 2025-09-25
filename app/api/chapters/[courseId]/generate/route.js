import { db } from "../../../../../configs/db.server";
import { Chapters, CourseList } from "../../../../../configs/schema";
import { NextResponse } from "next/server";
import { getVideos } from "../../../../../configs/service";
import { eq } from "drizzle-orm";

export async function POST(req, { params }) {
  try {
    console.log("=== GENERATE ROUTE START ===");
    
    const { courseId } = await params;
    console.log("DEBUG: courseId:", courseId);

    if (!courseId) {
      console.log("ERROR: No courseId provided");
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    // First, get the existing course data
    console.log("DEBUG: Fetching existing course...");
    const existingCourse = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId));

    console.log("DEBUG: Query result:", existingCourse.length, "courses found");

    if (!existingCourse.length) {
      console.log("ERROR: Course not found in database");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    console.log("DEBUG: Raw courseOutput:", existingCourse[0].courseOutput);

    let courseData;
    try {
      courseData = JSON.parse(existingCourse[0].courseOutput);
      console.log("DEBUG: Parsed course data successfully");
      console.log("DEBUG: Course has", courseData.chapters?.length, "chapters");
    } catch (parseError) {
      console.error("ERROR: Failed to parse course JSON:", parseError);
      return NextResponse.json({ error: "Invalid course data format" }, { status: 400 });
    }

    if (!courseData.chapters || !Array.isArray(courseData.chapters)) {
      console.log("ERROR: Course has no chapters array");
      return NextResponse.json({ error: "Course has no chapters" }, { status: 400 });
    }

    // Clear existing chapters first
    console.log("DEBUG: Clearing existing chapters...");
    await db.delete(Chapters).where(eq(Chapters.courseId, courseId));

    // Enhance each chapter with video IDs
    const enhancedChapters = [];

    for (let i = 0; i < courseData.chapters.length; i++) {
      const chapter = courseData.chapters[i];
      console.log(`DEBUG: Processing chapter ${i + 1}:`, chapter.chapterName);

      // Get video for main chapter
      let mainVideoId = "dQw4w9WgXcQ"; // fallback
      try {
        console.log(`DEBUG: Searching videos for: "${chapter.chapterName}"`);
        const mainVideos = await getVideos(chapter.chapterName);
        console.log(`DEBUG: Found ${mainVideos.length} videos for main chapter`);
        
        if (mainVideos.length > 0 && mainVideos[0]?.id?.videoId) {
          mainVideoId = mainVideos[0].id.videoId;
          console.log("SUCCESS: Found main video:", mainVideoId);
        } else {
          console.log("WARNING: No videos found, using fallback");
        }
      } catch (error) {
        console.error("ERROR: Failed to fetch main video:", error);
      }

      // Enhance details with video IDs (limit to avoid API quota)
      const enhancedDetails = [];
      const maxDetails = Math.min(chapter.details?.length || 0, 2); // Limit to 2 details
      
      for (let j = 0; j < maxDetails; j++) {
        const detail = chapter.details[j];
        console.log(`DEBUG: Processing detail ${j + 1}:`, detail.fieldName);
        
        let detailVideoId = null;
        try {
          const searchQuery = `${detail.fieldName} tutorial`;
          console.log(`DEBUG: Searching videos for: "${searchQuery}"`);
          const detailVideos = await getVideos(searchQuery);
          
          if (detailVideos.length > 0 && detailVideos[0]?.id?.videoId) {
            detailVideoId = detailVideos[0].id.videoId;
            console.log("SUCCESS: Found detail video:", detailVideoId);
          }
        } catch (error) {
          console.error("ERROR: Failed to fetch detail video:", error);
        }

        enhancedDetails.push({
          ...detail,
          videoId: detailVideoId
        });
      }

      // Add remaining details without videos
      for (let k = maxDetails; k < (chapter.details?.length || 0); k++) {
        enhancedDetails.push({
          ...chapter.details[k],
          videoId: null
        });
      }

      // Create enhanced chapter
      const enhancedChapter = {
        ...chapter,
        videoId: mainVideoId,
        details: enhancedDetails
      };

      enhancedChapters.push(enhancedChapter);

      // Insert chapter into Chapters table
      console.log(`DEBUG: Inserting chapter ${i + 1} into database...`);
      await db.insert(Chapters).values({
        courseId,
        content: JSON.stringify(enhancedChapter),
        userName: "admin",
        videoId: mainVideoId,
      });
      console.log(`SUCCESS: Chapter ${i + 1} inserted`);
    }

    // Update the main course with enhanced data
    console.log("DEBUG: Updating main course...");
    const enhancedCourseData = {
      ...courseData,
      chapters: enhancedChapters
    };

    await db
      .update(CourseList)
      .set({ 
        courseOutput: JSON.stringify(enhancedCourseData),
        published: true 
      })
      .where(eq(CourseList.courseId, courseId));

    console.log("SUCCESS: Course enhanced successfully");

    return NextResponse.json({ 
      success: true, 
      message: "Course enhanced with videos",
      chaptersProcessed: enhancedChapters.length,
      totalVideosAdded: enhancedChapters.reduce((acc, ch) => {
        let count = ch.videoId ? 1 : 0;
        count += ch.details?.filter(d => d.videoId).length || 0;
        return acc + count;
      }, 0)
    });

  } catch (err) {
    console.error("FATAL ERROR in generate route:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json({ 
      error: "Failed to generate chapters",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}