"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { IoMdCheckboxOutline } from "react-icons/io";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";

export default function FinishPage() {
  const { courseId } = useParams();
  const { isLoaded, user } = useUser();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !courseId) return;
    try {
      setLoading(true);

      const [courseRes, chaptersRes] = await Promise.all([
        fetch(`/api/course/${courseId}`, {
          headers: { "x-user-email": user.primaryEmailAddress.emailAddress },
        }),
        fetch(`/api/chapters/${courseId}`, {
          headers: { "x-user-email": user.primaryEmailAddress.emailAddress },
        }),
      ]);

      if (!courseRes.ok) throw new Error(`Failed to fetch course: ${courseRes.status}`);
      if (!chaptersRes.ok) throw new Error(`Failed to fetch chapters: ${chaptersRes.status}`);

      const courseData = await courseRes.json();
      const chaptersData = await chaptersRes.json();

      console.log("DEBUG: Course data:", courseData);
      console.log("DEBUG: Chapters data:", chaptersData);

      setCourse(courseData);
      setChapters(chaptersData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user && courseId) fetchCourseData();
  }, [isLoaded, user, courseId, fetchCourseData]);

  if (!isLoaded) return <p>Loading user info...</p>;
  if (!user) return <p>Please sign in to view course.</p>;
  if (loading) return <p>Loading course data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!course) return <p>No course found.</p>;

  const opts = {
    height: "360",
    width: "640",
    playerVars: { autoplay: 0 },
  };

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className="text-center font-bold text-2xl my-3 text-blue-500">
        Congrats! Your Course is Ready
      </h2>

      <CourseBasicInfo course={course} refreshData={() => fetchCourseData()} />

      <h2 className="mt-3">Course URL:</h2>
      <h2 className="text-center flex text-gray-400 border p-2 rounded gap-2">
        {process.env.NEXT_PUBLIC_HOST_NAME}/course/view/{courseId}
        <IoMdCheckboxOutline
          className="h-5 w-5 cursor-pointer"
          onClick={async () =>
            await navigator.clipboard.writeText(
              process.env.NEXT_PUBLIC_HOST_NAME + "/course/view/" + courseId
            )
          }
        />
      </h2>

      {/* Chapters List */}
      <div className="mt-10 space-y-8">
        {chapters.map((chapter, idx) => {
          let content = {};

          console.log(`DEBUG: Raw chapter ${idx}:`, chapter);
          console.log(`DEBUG: Chapter ${idx} content type:`, typeof chapter.content);
          console.log(`DEBUG: Chapter ${idx} content:`, chapter.content);

          try {
            // FIXED: Check if content is already an object or needs parsing
            if (typeof chapter.content === 'string') {
              content = JSON.parse(chapter.content);
              console.log(`DEBUG: Parsed chapter ${idx} content:`, content);
            } else if (typeof chapter.content === 'object' && chapter.content !== null) {
              content = chapter.content;
              console.log(`DEBUG: Using object chapter ${idx} content:`, content);
            } else {
              console.log(`DEBUG: Chapter ${idx} has no valid content`);
              content = {};
            }
          } catch (parseError) {
            console.error(`Error parsing chapter ${idx}:`, parseError);
            console.log(`Raw content that failed:`, chapter.content);
            content = {};
          }

          // Handle both 'chapters' and 'details' arrays
          const subChapters = Array.isArray(content.chapters)
            ? content.chapters
            : Array.isArray(content.details)
              ? content.details
              : [];

          console.log(`DEBUG: Chapter ${idx} subchapters:`, subChapters);

          return (
            <div key={idx} className="p-6 border rounded-xl shadow-sm bg-sky-50">
              {/* Main Chapter */}
              <h2 className="font-bold text-xl mb-2">
                {content.chapterTitle || content.chapterName || `Chapter ${idx + 1}`}
              </h2>
              <p className="text-gray-500 mb-4">{content.about}</p>

              {/* Main chapter video */}
              {/* FIXED: videoId is at the top level chapter object, not nested in JSON content */}
              {chapter.videoId ? (
                <div className="flex justify-center mb-6">
                  <div className="border border-gray-300 rounded">
                    <YouTube
                      videoId={chapter.videoId}
                      opts={opts}
                      onError={(error) => {
                        console.warn(`YouTube Warning (Main Chapter ${idx}):`, error);
                        console.log(`Failed VideoId for chapter ${chapter.id}:`, chapter.videoId);
                      }}
                      onReady={() => console.log(`YouTube Ready (Main Chapter ${idx}):`, chapter.videoId)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-yellow-600 text-center mb-6 p-4 bg-yellow-50 rounded">
                  No main video available for this chapter (Debug ID: {chapter.id || 'none'})
                </div>
              )}

              {/* Subchapters/Details */}
              {subChapters.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg mb-5 border shadow-sm"
                >
                  <h3 className="font-medium text-lg">
                    {item.chapterTitle || item.fieldName || `Section ${i + 1}`}
                  </h3>

                  <div className="mt-2">
                    <ReactMarkdown>
                      {item.description || ""}
                    </ReactMarkdown>
                  </div>

                  {/* Subchapter/Detail video */}
                  {item.videoId ? (
                    <div className="flex justify-center mt-3">
                      <div className="border border-gray-300 rounded">
                        <YouTube
                          videoId={item.videoId}
                          opts={opts}
                          onError={(error) => {
                            console.warn(`YouTube Warning (Sub ${idx}-${i}):`, error);
                            // console.log("Failed VideoId:", item.videoId);
                          }}
                          onReady={() => console.log(`YouTube Ready (Sub ${idx}-${i}):`, item.videoId)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mt-2">
                      Text content only
                    </div>
                  )}

                  {item.codeExample && (
                    <div className="p-3 bg-black text-white rounded-md mt-3 overflow-x-auto">
                      <pre>
                        <code>{item.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}