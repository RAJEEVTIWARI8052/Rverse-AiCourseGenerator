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
        await fetch(`/api/course/${course.courseId}/update`, {
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
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-2xl flex items-center gap-2">
            {output?.courseTitle}
            <EditCourseBasicInfo course={course} refreshData={() => refreshData(true)} />
          </h2>

          <p className="text-xl text-gray-400 mt-3">{description}</p>
          <h2 className="font-medium mt-2 flex gap-2 items-center bg-blue-500 text-white p-1 rounded">
            <HiOutlinePuzzlePiece /> {output?.category}
          </h2>

          <Link href={`/course/${course.courseId}/start`}>
            <Button className="w-full mt-5">Start</Button>
          </Link>
        </div>

        <div>
          <label htmlFor="upload-image" className="cursor-pointer">
            <Image
              src={selectedFile ? selectedFile : imageUrl}
              width={300}
              height={300}
              className="w-full rounded-xl h-[250px] object-cover"
              alt="Course image"
            />
          </label>

          <Input
            type="file"
            id="upload-image"
            accept="image/*"
            className="hidden"
            onChange={onFileSelected}
            disabled={uploading}
          />

          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
