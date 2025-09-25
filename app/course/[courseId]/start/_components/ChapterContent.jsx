import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";

function ChapterContent({ chapter }) {
  const opts = {
    height: "390",
    width: "640",
    playerVars: { autoplay: 0 },
  };

  // Add debugging
  console.log("DEBUG: Chapter data received:", chapter);
  console.log("DEBUG: Main videoId:", chapter?.videoId);
  console.log("DEBUG: Details:", chapter?.details);
  console.log("DEBUG: Fields:", chapter?.fields);
  console.log("DEBUG: Chapters:", chapter?.chapters);

  if (!chapter) return <div className="p-10">Select a chapter</div>;

  return (
    <div className="p-10">
      {/* Handle both chapterName and chapterTitle */}
      <h2 className="font-medium text-2xl">
        {chapter?.chapterName || chapter?.chapterTitle || "Chapter"}
      </h2>
      <p className="text-gray-500">{chapter?.about}</p>
      <p className="text-sm text-blue-600 mb-4">Duration: {chapter?.duration}</p>

      {/* Main video - only show if videoId exists */}
      {chapter?.videoId ? (
        <div className="flex justify-center my-6">
          <div className="border border-gray-300 rounded">
            <YouTube 
              videoId={chapter.videoId} 
              opts={opts}
              onError={(error) => {
                console.error("YouTube Error (Main):", error);
                console.log("Failed VideoId:", chapter.videoId);
              }}
              onReady={() => console.log("YouTube Ready (Main):", chapter.videoId)}
            />
          </div>
        </div>
      ) : (
        <div className="text-yellow-600 text-center my-6 p-4 bg-yellow-50 rounded">
          No video available for this chapter. Generate course content to add videos.
        </div>
      )}

      {/* Handle different data structures - fields, details, or chapters */}
      <div>
        <h3 className="font-semibold text-xl mb-4">Chapter Content:</h3>
        
        {/* Handle 'fields' array */}
        {chapter?.fields?.map((field, index) => {
          console.log(`DEBUG: Field ${index}:`, field);
          
          return (
            <div key={index} className="p-5 bg-sky-50 mb-3 rounded-lg shadow-sm">
              <h2 className="font-medium text-lg">
                {field?.fieldName || field?.name || `Section ${index + 1}`}
              </h2>
              
              {field?.description && (
                <div className="mt-2">
                  <ReactMarkdown>{field.description}</ReactMarkdown>
                </div>
              )}

              {/* Video for field section - only show if exists */}
              {field?.videoId ? (
                <div className="flex justify-center my-6">
                  <div className="border border-gray-300 rounded">
                    <YouTube 
                      videoId={field.videoId} 
                      opts={opts}
                      onError={(error) => {
                        console.error(`YouTube Error (Field ${index}):`, error);
                        console.log("Failed VideoId:", field.videoId);
                      }}
                      onReady={() => console.log(`YouTube Ready (Field ${index}):`, field.videoId)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-2">
                  📝 Text content only
                </div>
              )}

              {field?.codeExample && (
                <div className="p-4 bg-black text-white rounded-md mt-3">
                  <pre><code>{field.codeExample}</code></pre>
                </div>
              )}
            </div>
          );
        })}

        {/* Handle 'details' array (fallback) */}
        {chapter?.details?.map((detail, index) => {
          console.log(`DEBUG: Detail ${index}:`, detail);
          
          return (
            <div key={`detail-${index}`} className="p-5 bg-green-50 mb-3 rounded-lg shadow-sm">
              <h2 className="font-medium text-lg">
                {detail?.fieldName || `Section ${index + 1}`}
              </h2>
              
              {detail?.description && (
                <div className="mt-2">
                  <ReactMarkdown>{detail.description}</ReactMarkdown>
                </div>
              )}

              {detail?.videoId ? (
                <div className="flex justify-center my-6">
                  <div className="border border-gray-300 rounded">
                    <YouTube videoId={detail.videoId} opts={opts} />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-2">
                  📝 Text content only
                </div>
              )}

              {detail?.codeExample && (
                <div className="p-4 bg-black text-white rounded-md mt-3">
                  <pre><code>{detail.codeExample}</code></pre>
                </div>
              )}
            </div>
          );
        })}

        {/* Handle 'chapters' array (fallback) */}
        {chapter?.chapters?.map((subChapter, index) => {
          console.log(`DEBUG: Subchapter ${index}:`, subChapter);
          
          return (
            <div key={`sub-${index}`} className="p-5 bg-purple-50 mb-3 rounded-lg shadow-sm">
              <h2 className="font-medium text-lg">
                {subChapter?.chapterTitle || subChapter?.chapterName || `Section ${index + 1}`}
              </h2>
              
              {subChapter?.description && (
                <div className="mt-2">
                  <ReactMarkdown>{subChapter.description}</ReactMarkdown>
                </div>
              )}

              {subChapter?.videoId && (
                <div className="flex justify-center my-6">
                  <div className="border border-gray-300 rounded">
                    <YouTube videoId={subChapter.videoId} opts={opts} />
                  </div>
                </div>
              )}

              {subChapter?.codeExample && (
                <div className="p-4 bg-black text-white rounded-md mt-3">
                  <pre><code>{subChapter.codeExample}</code></pre>
                </div>
              )}
            </div>
          );
        })}

        {/* Show message if no content arrays found */}
        {!chapter?.fields && !chapter?.details && !chapter?.chapters && (
          <div className="text-center text-gray-500 p-8">
            No detailed content available for this chapter.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterContent;