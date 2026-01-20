"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../../../../components/dialog";
import { FaEdit } from "react-icons/fa";
import { Input } from "../../../../components/input";
import { Textarea } from "../../../../components/textarea";
import { Button } from "../../../../components/button";
import { DialogClose } from "@radix-ui/react-dialog";

function EditCourseBasicInfo({ course, refreshData }) {
  let parsedOutput = {};
  try {
    parsedOutput = course?.courseOutput
      ? JSON.parse(course.courseOutput)
      : {};
  } catch {
    parsedOutput = {};
  }

  const [name, setName] = useState(parsedOutput?.courseTitle || "");
  const [description, setDescription] = useState(
    parsedOutput?.description || parsedOutput?.Description || ""
  );

  useEffect(() => {
    setName(parsedOutput?.courseTitle || "");
    setDescription(parsedOutput?.description || parsedOutput?.Description || "");
  }, [course, parsedOutput?.courseTitle, parsedOutput?.description, parsedOutput?.Description]);

  const onUpdateHandler = async () => {
    const updatedOutput = {
      ...parsedOutput,
      courseTitle: name,
      description,
    };

    try {
      const res = await fetch(`/api/course/${course.courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // ✅ send raw object (not stringified twice)
        body: JSON.stringify({ courseOutput: updatedOutput }),
      });

      if (!res.ok) throw new Error("Failed to update course");

      console.log("✅ Course info updated");

      if (refreshData) refreshData(true);
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <FaEdit />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course Title & Description</DialogTitle>
          <DialogDescription>
            Update the course details below and click &quot;Update&quot; to save changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Title
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Description
            </label>
            <Textarea
              className="h-40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onUpdateHandler}>Update</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCourseBasicInfo;
