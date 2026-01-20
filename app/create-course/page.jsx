"use client"

import React, { useContext, useEffect, useState } from "react"
import { HiClipboardDocumentCheck, HiLightBulb, HiMiniSquares2X2 } from "react-icons/hi2"
import { Button } from "../../components/button"
import SelectCategory from "./_components/SelectCategory"
import TopicDescription from "./_components/TopicDescription"
import SelectOptions from "./_components/SelectOptions"
import UserInputContext from "../_context/UserInputContext"
import LoadingDialog from "./_components/LoadingDialog"
import { useUser } from "@clerk/nextjs"
import { generateCourseLayout } from "../../lib/groq"
import { createCourseRecord } from "./actions/saveCourse"
import { useRouter } from "next/navigation"
import { IoEllipsisVerticalOutline } from "react-icons/io5"
function CreateCoursePage() {
  const StepperOptions = [
    { id: 1, name: "Category", icon: HiMiniSquares2X2 },
    { id: 2, name: "Topics & desc", icon: HiLightBulb },
    { id: 3, name: "Options", icon: HiClipboardDocumentCheck },
  ]

  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Validation per step
  const checkStatus = () => {
    if (activeIndex === 0 && !userCourseInput?.category) return true
    if (activeIndex === 1 && !userCourseInput?.topic) return true
    if (
      activeIndex === 2 &&
      (!userCourseInput?.Level ||
        !userCourseInput?.Duration ||
        !userCourseInput?.noOfChapters ||
        !userCourseInput?.DisplayVideo)
    ) {
      return true
    }
    return false
  }

  // Generate course & save
  const GenerateCourseLayout = async () => {
    if (!user) return
    setLoading(true)
    setError(null) // Reset error

    // ... (existing code)

    const userInfo = {
      emailAddress: user.primaryEmailAddress?.emailAddress || "anonymous",
      userName: user.fullName || "Anonymous",
      userProfileImage: user.imageUrl || "",
    }

    const BASIC_PROMPT =
      "Generate a Course Tutorial. Output ONLY valid JSON with this structure: { \"courseTitle\": \"string\", \"chapters\": [{ \"chapterName\": \"string\", \"about\": \"string\", \"duration\": \"string\" }] }. Details:"
    const USER_INPUT_PROMPT = `Category:${userCourseInput?.category}, Topic:${userCourseInput?.topic}, Level:${userCourseInput?.Level}, Duration:${userCourseInput?.Duration}, NoOfChapters:${userCourseInput?.noOfChapters}`
    const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT

    try {
      const generatedText = await generateCourseLayout(FINAL_PROMPT)
      if (!generatedText) {
        throw new Error("No content generated");
      }

      let courseLayout
      try {
        const cleanText = generatedText.replace(/```json\n|\n```/g, "").trim()
        courseLayout = JSON.parse(cleanText)
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError)
        throw new Error("Invalid AI response format");
      }

      const newCourse = await createCourseRecord(courseLayout, userCourseInput, userInfo)

      if (newCourse?.courseId) {
        router.replace(`/create-course/${newCourse.courseId}`)
      } else {
        console.error("Course ID missing from DB insert:", newCourse)
      }

      // ... (existing code)

    } catch (err) {
      console.error("Error generating course:", err)
      setError("Error generating course. Please try again, or check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) return <div className="p-6 text-center">Loading authentication...</div>
  if (!user) return <div className="p-6 text-center">Please sign in to create a course.</div>

  return (
    <div className="p-6">
      {/* Stepper */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-4xl font-bold gradient-text mb-4">Create Your Course</h2>
        <div className="flex justify-center p-4 gap-2">
          {StepperOptions.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center flex-1 max-w-[100px] mb-2">
              <div
                className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 ${activeIndex >= index
                  ? "bg-purple-600 text-white shadow-lg scale-110"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                  }`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h2 className="hidden md:block md:text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">{item.name}</h2>
              {index < StepperOptions.length - 1 && (
                <div
                  className={`h-1 flex-1 w-full rounded-full mt-2 transition-all duration-500 ${activeIndex > index ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* Step Component */}
        {activeIndex === 0 ? (
          <SelectCategory />
        ) : activeIndex === 1 ? (
          <TopicDescription />
        ) : (
          <SelectOptions />
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          <Button
            disabled={activeIndex === 0}
            variant="outline"
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
          {activeIndex < 2 ? (
            <Button disabled={checkStatus()} onClick={() => setActiveIndex(activeIndex + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={GenerateCourseLayout} disabled={checkStatus() || loading}>
              {loading ? "Generating..." : "Generate Course Layout"}
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
            <HiLightBulb className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <LoadingDialog loading={loading} />
    </div>
  )
}

export default CreateCoursePage
