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

function EditChapters({ course, index, refreshData }) {
  let parsedOutput = {};
  try {
    parsedOutput = course?.courseOutput
      ? JSON.parse(course.courseOutput)
      : { chapters: [] };
  } catch {
    parsedOutput = { chapters: [] };
  }

  const chapter = parsedOutput.chapters[index] || {};
  const [name, setName] = useState(chapter.chapterName || "");
  const [about, setAbout] = useState(chapter.about || "");

  useEffect(() => {
    setName(chapter.chapterName || "");
    setAbout(chapter.about || "");
  }, [course, index]);

  const onUpdateHandler = async () => {
    try {
      const updatedChapters = [...parsedOutput.chapters];
      updatedChapters[index] = { ...updatedChapters[index], chapterName: name, about };

      const updatedOutput = { ...parsedOutput, chapters: updatedChapters };

      // EditChapters.jsx
      const res = await fetch(`/api/course/${course.courseId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseOutput: updatedOutput }), // ✅ remove extra stringify
      });


      if (!res.ok) throw new Error("Failed to update chapter");

      console.log("✅ Chapter updated");

      if (refreshData) refreshData();
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
          <DialogTitle>Edit Chapter Title & Description</DialogTitle>
          <DialogDescription>
            Update the details below and click "Update" to save your changes.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          <div>
            <label>Chapter Title</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter chapter title"
            />
          </div>

          <div>
            <label>Chapter Description</label>
            <Textarea
              className="h-40"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Enter chapter description"
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

export default EditChapters;
