// app/create-course/[courseId]/saveChapter/route.js - FIXED
import { NextResponse } from "next/server";
import { insertChapter } from "../../../../configs/db.server";

export async function POST(req, { params }) {
  try {
    // Await params first
    const resolvedParams = await params;
    const courseId = resolvedParams.courseId;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { chapterName, content, videos, userName } = body;

    if (!chapterName || !content) {
      return NextResponse.json(
        { success: false, error: "Missing chapterName or content" },
        { status: 400 }
      );
    }

    // Validate and format video URLs
    let formattedVideos = [];
    if (videos && Array.isArray(videos)) {
      formattedVideos = videos.filter(video => 
        video && typeof video === 'string' && video.includes('youtube.com')
      );
    }

    const chapterData = {
      chapterName: chapterName.trim(),
      content: typeof content === 'string' ? content.trim() : JSON.stringify(content),
      videos: formattedVideos,
      userName: userName || 'Anonymous'
    };

    console.log('Saving chapter:', { courseId, chapterData });

    const savedChapter = await insertChapter(courseId, chapterData);

    return NextResponse.json({ 
      success: true, 
      chapter: savedChapter,
      message: `Chapter "${chapterName}" saved successfully`
    });

  } catch (err) {
    console.error("Error saving chapter:", err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save chapter' }, 
      { status: 500 }
    );
  }
}