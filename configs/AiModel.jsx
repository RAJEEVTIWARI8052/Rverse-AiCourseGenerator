"use client";

import React, { use, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "../../../components/button";
import LoadingDialog from "../_components/LoadingDialog";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CourseLayout({ params }) {
  const { courseId } = use(params); // ✅ unwrap params
  const { isLoaded, user } = useUser();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);

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

    let output = null;
    try {
      output = JSON.parse(course?.courseOutput); // ✅ parse saved course JSON
    } catch (err) {
      console.error("Invalid JSON in courseOutput", err);
      setLoading(false);
      return;
    }

    const chapters = output?.chapters || [];
    if (chapters.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY
      );
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const results = [];
      for (const chapter of chapters) {
        const prompt = `
Explain the concept in Detail on Topic: ${chapter.chapterName}.
Generate the tutorial in JSON format. 
Fields:
- title
- description (detailed explanation, at least 2–3 paragraphs)
- codeExample (if applicable, wrap inside <precode>...</precode>)
        `;

        console.log("Generated Prompt:", prompt);

        const response = await model.generateContent(prompt);
        const text = response.response.text();

        results.push({
          chapterName: chapter.chapterName,
          generatedContent: text,
        });
      }

      setGenerated(results);
    } catch (e) {
      console.error("Error generating content:", e);
      setGenerated([{ error: "❌ Error generating content. Check console." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />

      <CourseBasicInfo course={course} refreshData={fetchCourse} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={fetchCourse} />

      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>

      {generated.length > 0 && (
        <div className="mt-6 space-y-4">
          {generated.map((item, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl">
              <h3 className="font-semibold mb-2">
                Chapter: {item.chapterName || "Unknown"}
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
