"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/button";

export default function AddCourse() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddCourse = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const bannerUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&crop=center";
      const courseId = crypto.randomUUID();
      const response = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          name: "New AI Course",
          category: "AI",
          level: "Beginner",
          createdBy: user.id,
          userName: user.fullName || user.firstName || "Anonymous",
          userProfileImage: user.profileImageUrl || "",
          courseBanner: bannerUrl,
          courseOutput: JSON.stringify({
            course: { numberOfChapters: 0 },
            chapters: []
          }),
          includeVideo: "Yes",
        }),
      });

      if (!res.ok) throw new Error("Failed to create course");
      router.push(`/dashboard/course/${courseId}`);


      if (!res.ok) throw new Error("Failed to create course");

      router.push(`/create-course/${courseId}`); // Redirect to course page
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <p>Loading user info...</p>;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl">
          Hello, <span className="font-bold">{user?.fullName}</span>
        </h2>
        <p className="text-sm text-gray-600">
          Create a new AI course, share with friends, and earn from it
        </p>
      </div>
      <Button onClick={() => router.push("/create-course")} disabled={loading}>
        + AI Course
      </Button>

    </div>
  );
}
