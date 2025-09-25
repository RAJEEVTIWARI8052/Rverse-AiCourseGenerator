// app/create-course/actions/saveCourse.js
"use server";

import { insertCourse } from "../../../configs/db.server";
import { v4 as uuidv4 } from "uuid";

export async function saveCourseLayout(courseLayout, userCourseInput, userInfo) {
  try {
    const id = uuidv4();

    const newCourse = await insertCourse({
      courseId: id,
      name: userCourseInput?.topic || "Untitled Course",
      category: userCourseInput?.category || "Uncategorized",
      level: userCourseInput?.Level || "Beginner",
      includeVideo: userCourseInput?.DisplayVideo || "Yes",
      Duration: userCourseInput?.Duration || "",
      noOfChapters: userCourseInput?.noOfChapters || 0,
      courseOutput: courseLayout,
      createdBy: userInfo?.emailAddress || "unknown@system",
      userName: userInfo?.userName || "Anonymous",
      userProfileImage: userInfo?.userProfileImage || "",
      createdAt: new Date(),
    });

    return newCourse; // should be the inserted row with courseId
  } catch (err) {
    console.error("saveCourseLayout error:", err);
    throw err;
  }
}
