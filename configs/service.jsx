import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const getVideos = async (query) => {
  try {
    console.log("🔍 DEBUG: Searching YouTube for:", query);

    // Check if API key exists
    let apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (apiKey) {
      apiKey = apiKey.replace(/^["']|["']$/g, '');
    }

    if (!apiKey) {
      console.error("❌ NEXT_PUBLIC_YOUTUBE_API_KEY not found in environment variables");
      return [];
    }

    const params = {
      part: "snippet",
      q: query,
      maxResults: 2,
      key: apiKey,
      type: "video",
      order: "relevance"
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
    const errorData = err.response?.data;
    console.error("❌ Error details:", errorData || err.message);

    // Check specifically for quota exceeded
    if (errorData?.error?.code === 403 && errorData?.error?.message?.includes("quota")) {
      console.error("🛑 CRITICAL: YouTube API Quota Exceeded. Attempting fallback...");
      const quotaFallback = getTestVideos(query);
      if (quotaFallback.length > 0) {
        return quotaFallback;
      }
      return [];
    }

    // Return test data if API fails for other reasons
    const testData = getTestVideos(query);
    if (testData.length > 0) {
      console.log("🧪 Falling back to test data for:", query);
      return testData;
    }

    return [];
  }
};

// Fallback test videos for debugging when API is unavailable or quota is exceeded
const getTestVideos = (query) => {
  const lowercaseQuery = query.toLowerCase();

  const keywordMap = [
    {
      keywords: ["variable", "data type", "operator"],
      video: { id: { videoId: "n4XF6Dcf0oY" }, snippet: { title: "Variables and Data Types in Programming" } }
    },
    {
      keywords: ["control structure", "loop", "if statement", "conditional"],
      video: { id: { videoId: "m2uxP_S82no" }, snippet: { title: "Control Structures and Loops" } }
    },
    {
      keywords: ["function", "method", "callback"],
      video: { id: { videoId: "7L_8L3u0X9w" }, snippet: { title: "JavaScript Functions Tutorial" } }
    },
    {
      keywords: ["array", "list", "collection"],
      video: { id: { videoId: "7W4pQQ20nJg" }, snippet: { title: "Arrays and Lists Explained" } }
    },
    {
      keywords: ["python"],
      video: { id: { videoId: "rfscVS0vtbw" }, snippet: { title: "Python for Beginners" } }
    },
    {
      keywords: ["react", "nextjs", "tailwind"],
      video: { id: { videoId: "SqcY0GlETPk" }, snippet: { title: "React and Next.js Crash Course" } }
    },
    {
      keywords: ["introduction", "intro", "basics", "fundamental"],
      video: { id: { videoId: "SSE4M0gcmvE" }, snippet: { title: "Introduction to AI and Programming" } }
    },
    {
      keywords: ["history", "timeline"],
      video: { id: { videoId: "mSd9nmPM7Vg" }, snippet: { title: "History of AI" } }
    },
    {
      keywords: ["practice", "project", "build"],
      video: { id: { videoId: "39zbC_PrNQs" }, snippet: { title: "Programming Practice Project" } }
    }
  ];

  // Find the first matching keyword set
  const match = keywordMap.find(item =>
    item.keywords.some(keyword => lowercaseQuery.includes(keyword))
  );

  if (match) {
    return [match.video];
  }

  // Final generic fallback for any other programming/tech query
  return [{ id: { videoId: "zOjov-2OZ0E" }, snippet: { title: "Computer Science and Programming Introduction" } }];
};