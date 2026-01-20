"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/button";
import LoadingDialog from "../_components/LoadingDialog";
import { getVideos } from "../../../configs/service";
import Image from "next/image"; // Import Next.js Image component

import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { use } from "react";

export default function CourseLayout({ params }) {
  const { courseId } = use(params); // directly extract
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch course details
  const fetchCourse = React.useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    try {
      const res = await fetch(`/api/course/${courseId}`, {
        headers: { "x-user-email": user.primaryEmailAddress.emailAddress },
      });
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  }, [user, courseId]);

  useEffect(() => {
    if (isLoaded && user && courseId) fetchCourse();
  }, [isLoaded, user, courseId, fetchCourse]);

  if (!isLoaded) return <p>Loading user info...</p>;
  if (!user) return <p>Please sign in to view course.</p>;
  if (error) return <p>Error loading course: {error}</p>;
  if (!course) return <p>Loading course...</p>;

  // Fix: Use a valid default image URL
  const bannerUrl = course.courseBanner && course.courseBanner !== "https://via.placeholder.com/300x200.png?text=Course+Image"
    ? course.courseBanner
    : "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80";

  // Generate chapters (example, can connect AI API)
  const generateChapters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chapters/${courseId}/generate`, { method: "POST" });
      if (!res.ok) {
        throw new Error(`Generation failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Generate chapters response:", data);

      router.push(`/create-course/${courseId}/finish`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate chapters: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {/* Fix: Use Next.js Image component instead of img tag */}
      <Image
        src={bannerUrl}
        alt="Course Banner"
        width={1200}
        height={240}
        className="w-full h-60 object-cover my-5 rounded-lg"
        priority
      />

      <LoadingDialog loading={loading} />

      <CourseBasicInfo course={course} refreshData={fetchCourse} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={fetchCourse} />

      <Button onClick={generateChapters} className="my-10" disabled={loading}>
        {loading ? "Generating..." : "Generate Course Content"}
      </Button>
    </div>
  );
}