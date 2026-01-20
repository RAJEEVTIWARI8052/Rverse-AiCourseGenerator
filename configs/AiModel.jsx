"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "../../../components/button";
import LoadingDialog from "../_components/LoadingDialog";
import { generateChapterContent } from "../../../lib/groq";

export default function CourseLayout({ params }) {
  const { courseId } = params;
  const { isLoaded, user } = useUser();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  const fetchCourse = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const res = await fetch(`/api/course/${courseId}`, {
        headers: { "x-user-email": user.primaryEmailAddress.emailAddress },
      });

      if (!res.ok) {
        setError(`API returned status ${res.status}`);
        console.error("API error:", await res.text());
        return;
      }

      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && user && courseId) {
      fetchCourse();
    }
  }, [courseId, isLoaded, user]);

  if (!isLoaded) return <p>Loading user info...</p>;
  if (!user) return <p>Please sign in to view course.</p>;
  if (error) return <p>Error loading course: {error}</p>;
  if (!course) return <p>Loading course...</p>;

  const GenerateChapterContent = async () => {
    setLoading(true);
    setGenerated([]);
    setGenerationError(null);
    setCurrentChapter(0);

    let output = null;
    try {
      output = JSON.parse(course?.courseOutput);
    } catch (err) {
      console.error("Invalid JSON in courseOutput", err);
      setLoading(false);
      return;
    }

    const chapters = output?.chapters || output?.Chapters || [];
    if (chapters.length === 0) {
      setLoading(false);
      return;
    }

    const results = [];

    try {
      // Process chapters one at a time with delays
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        setCurrentChapter(i + 1);

        let success = false;
        let attempts = 0;
        const maxAttempts = 5;

        while (!success && attempts < maxAttempts) {
          try {
            console.log(`Generating chapter ${i + 1}/${chapters.length} (attempt ${attempts + 1})`);

            const content = await generateChapterContent(chapter.chapterName);

            results.push({
              chapterName: chapter.chapterName,
              generatedContent: content,
            });

            success = true;

            // Add delay between successful requests to avoid rate limits
            if (i < chapters.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }

          } catch (e) {
            attempts++;
            console.error(`Error on attempt ${attempts}:`, e);

            if (attempts >= maxAttempts) {
              // After max attempts, add error result and continue
              results.push({
                chapterName: chapter.chapterName,
                error: `Failed to generate content after ${maxAttempts} attempts. API may be overloaded.`,
              });
              success = true; // Mark as done to continue to next chapter
            } else {
              // Exponential backoff
              const waitTime = Math.min(2000 * Math.pow(2, attempts - 1), 20000);
              console.log(`Waiting ${waitTime / 1000}s before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }
          }
        }
      }

      setGenerated(results);

      // Check if any chapters failed
      const failedCount = results.filter(r => r.error).length;
      if (failedCount > 0) {
        setGenerationError(
          `${failedCount} chapter(s) failed to generate. The API may be experiencing high traffic. You can try regenerating these chapters later.`
        );
      }

    } catch (e) {
      console.error("Fatal error generating content:", e);
      setGenerationError(
        "Failed to generate content. The Groq API may be overloaded. Please try again in a few minutes."
      );
    } finally {
      setLoading(false);
      setCurrentChapter(0);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />

      {loading && currentChapter > 0 && (
        <div className="text-center my-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700 font-medium">
            Generating chapter {currentChapter}... Please wait.
          </p>
        </div>
      )}

      {generationError && (
        <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">⚠️ {generationError}</p>
        </div>
      )}

      <CourseBasicInfo course={course} refreshData={fetchCourse} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={fetchCourse} />

      <Button
        onClick={GenerateChapterContent}
        className="my-10"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Course Content"}
      </Button>

      {generated.length > 0 && (
        <div className="mt-6 space-y-4">
          {generated.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl ${item.error ? 'bg-red-50 border border-red-200' : 'bg-gray-100'
                }`}
            >
              <h3 className="font-semibold mb-2">
                Chapter: {item.chapterName || "Unknown"}
                {item.error && <span className="text-red-600 ml-2">❌ Failed</span>}
              </h3>
              <pre className="bg-white p-3 rounded overflow-x-auto text-sm">
                {item.generatedContent || item.error}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}