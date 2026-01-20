"use client";
import React, { useState } from "react";
import { HiOutlinePuzzlePiece } from "react-icons/hi2";
import { Button } from "../../../../components/button";
import Image from "next/image";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { Input } from "../../../../components/input";
import Link from "next/link";

function CourseBasicInfo({ course, refreshData }) {
  const [imageUrl, setImageUrl] = useState(
    course?.imageUrl ||
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80"
  );
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(URL.createObjectURL(file));
    setUploading(true);

    try {
      const base64File = await toBase64(file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64File }),
      });

      const data = await res.json();

      if (data.url) {
        setImageUrl(data.url); // ✅ Update image with Cloudinary URL
        console.log("Uploaded to Cloudinary:", data.url);

        // Update DB with new image URL
        await fetch(`/api/course/${course.courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseOutput: {
              ...JSON.parse(course.courseOutput || "{}"),
              imageUrl: data.url,
            },
          }),
        });

        if (refreshData) refreshData(true);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  let output = {};
  try {
    output = course?.courseOutput ? JSON.parse(course.courseOutput) : {};
  } catch {
    output = {};
  }

  const description = output?.description || output?.Description || "No description available";

  return (
    <div className="p-8 glass rounded-2xl shadow-xl mt-6 border border-white/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-extrabold text-3xl flex items-center gap-3">
            <span className="gradient-text">{output?.courseTitle}</span>
            <EditCourseBasicInfo course={course} refreshData={() => refreshData(true)} />
          </h2>

          <p className="text-lg text-gray-500 dark:text-gray-300 mt-4 leading-relaxed">{description}</p>

          <div className="mt-6 flex gap-3">
            <h2 className="font-semibold flex gap-2 items-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-4 py-2 rounded-lg text-sm">
              <HiOutlinePuzzlePiece className="text-xl" /> {output?.category}
            </h2>
          </div>

          <Link href={`/course/${course.courseId}/start`} className="block mt-8">
            <Button className="w-full md:w-auto px-10 py-6 text-lg shadow-2xl shadow-purple-500/20">Start Course</Button>
          </Link>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <label htmlFor="upload-image" className="cursor-pointer relative block">
            <Image
              src={selectedFile ? selectedFile : imageUrl}
              width={400}
              height={300}
              className="w-full rounded-2xl h-[300px] object-cover shadow-lg transform group-hover:scale-[1.01] transition-transform duration-300"
              alt="Course image"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change Cover</span>
            </div>
          </label>

          <Input
            type="file"
            id="upload-image"
            accept="image/*"
            className="hidden"
            onChange={onFileSelected}
            disabled={uploading}
          />

          {uploading && <p className="text-sm text-purple-500 mt-2 font-medium animate-pulse text-center">Uploading new cover...</p>}
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
