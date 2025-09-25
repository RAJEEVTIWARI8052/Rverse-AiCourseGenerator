// /Users/rajeevtiwari/Desktop/nextjs/ai-course-generator/app/layout.jsx
"use client"

import React, { useState } from "react"
import Header from "../dashboard/_components/Header"
import UserInputContext from "../_context/UserInputContext"

function CreateCourseLayout({ children }) {
  const [userCourseInput, setUserCourseInput] = useState({
    category: "",
    topic: "",
    Level: "",
    Duration: "",
    noOfChapters: "",
    DisplayVideo: "",
  })

  return (
    <UserInputContext.Provider value={{ userCourseInput, setUserCourseInput }}>
      <Header />
      {children}
    </UserInputContext.Provider>
  )
}

export default CreateCourseLayout