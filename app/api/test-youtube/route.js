// Create: app/api/test-youtube/route.js
import { NextResponse } from "next/server";
import { getVideos } from "../../../configs/service";

export async function GET() {
  try {
    console.log("Testing YouTube API...");
    
    // Test with one of your chapter names
    const testQuery = "Basic Arithmetic Operations";
    console.log("Searching for:", testQuery);
    
    const videos = await getVideos(testQuery);
    console.log("Videos found:", videos);
    
    return NextResponse.json({
      success: true,
      query: testQuery,
      videosFound: videos.length,
      videos: videos.map(v => ({
        videoId: v.id?.videoId,
        title: v.snippet?.title,
        thumbnail: v.snippet?.thumbnails?.default?.url
      })),
      apiKeyExists: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    });
    
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKeyExists: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    });
  }
}