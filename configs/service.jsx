import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const getVideos = async (query) => {
  try {
    console.log("🔍 DEBUG: Searching YouTube for:", query);
    
    // Check if API key exists
    if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
      console.error("❌ NEXT_PUBLIC_YOUTUBE_API_KEY not found in environment variables");
      return [];
    }
    
    const params = {
      part: "snippet",
      q: query,
      maxResults: 2,
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      type: "video",
      order: "relevance" // Add this for better results
    };

    console.log("🔍 DEBUG: YouTube API params:", params);

    const resp = await axios.get(`${YOUTUBE_BASE_URL}/search`, { params });
    
    console.log("✅ YouTube API response for", query, ":", resp.data);
    
    // Validate the response
    if (!resp.data.items || !Array.isArray(resp.data.items)) {
      console.error("❌ Invalid YouTube API response structure:", resp.data);
      return [];
    }
    
    // Log video IDs found
    resp.data.items.forEach((item, index) => {
      console.log(`📹 Video ${index + 1}:`, item?.id?.videoId, "-", item?.snippet?.title);
    });
    
    return resp.data.items;
  } catch (err) {
    console.error("❌ YouTube API Error:", err);
    console.error("❌ Error details:", err.response?.data || err.message);
    
    // Return test data if API fails (for debugging)
    console.log("🧪 Falling back to test data for:", query);
    return getTestVideos(query);
  }
};

// Fallback test videos for debugging
const getTestVideos = (query) => {
  const testVideos = {
    "Introduction to AI": [{ id: { videoId: "SSE4M0gcmvE" }, snippet: { title: "Introduction to AI" } }],
    "History of AI": [{ id: { videoId: "mSd9nmPM7Vg" }, snippet: { title: "History of AI" } }],
    "AI Concepts": [{ id: { videoId: "39zbC_PrNQs" }, snippet: { title: "AI Concepts" } }],
    "AI Applications": [{ id: { videoId: "xBSMBEowLcY" }, snippet: { title: "AI Applications" } }],
  };
  
  return testVideos[query] || [{ id: { videoId: "dQw4w9WgXcQ" }, snippet: { title: "Fallback Video" } }];
};