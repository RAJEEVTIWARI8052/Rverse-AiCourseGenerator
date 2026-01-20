"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/button";

export default function AddCourse() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  /* Logic moved to create-course page */

  if (!isLoaded) return <p>Loading user info...</p>;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">
          Hello, <span className="gradient-text">{user?.fullName}</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create a new AI course, share with friends, and earn from it
        </p>
      </div>
      <Button onClick={() => router.push("/create-course")}>
        + AI Course
      </Button>

    </div>
  );
}
