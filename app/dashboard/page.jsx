"use client";

import React from "react";
import AddCourse from "./_components/AddCourse";
import UserCourseList from "./_components/UserCourseList";

export default function DashboardPage() {
  return (
    <div>
      <AddCourse />
      <UserCourseList />
    </div>
  );
}
