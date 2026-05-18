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

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass p-10 rounded-3xl text-center animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/30 mb-4"></div>
        <p className="text-gray-400">Loading authentication...</p>
      </div>
    </div>
  )

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass p-10 rounded-3xl text-center">
        <p className="text-2xl font-bold gradient-text mb-2">Sign In Required</p>
        <p className="text-gray-400">Please sign in to create a course.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative">
      {/* Background depth layers */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-700/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="p-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-300 tracking-widest uppercase">AI Course Builder</span>
          </div>
          <h2 className="text-5xl font-black gradient-text mb-3">Create Your Course</h2>
          <p className="text-gray-400 text-lg">3 steps to your personalized AI curriculum</p>
        </div>

        {/* 3D Stepper */}
        <div className="relative mb-12">
          {/* Progress line behind steps */}
          <div className="absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-white/5 rounded-full z-0" />
          <div
            className="absolute top-[28px] left-[10%] h-[2px] bg-gradient-to-r from-purple-600 to-pink-500 rounded-full z-0 transition-all duration-700"
            style={{ width: `${(activeIndex / (StepperOptions.length - 1)) * 80}%` }}
          />

          <div className="flex justify-around relative z-10">
            {StepperOptions.map((item, index) => (
              <div key={item.id} className="flex flex-col items-center gap-3">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 border ${
                    activeIndex >= index
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 border-pink-500/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110"
                      : "bg-white/5 border-white/10 text-gray-500"
                  }`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                  activeIndex >= index ? "text-purple-300" : "text-gray-600"
                }`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden mb-8 card-hover"
          style={{ boxShadow: "0 25px 50px -10px rgba(88,28,135,0.3), inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          {activeIndex === 0 ? (
            <SelectCategory />
          ) : activeIndex === 1 ? (
            <TopicDescription />
          ) : (
            <SelectOptions />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ← Previous
          </button>

          {activeIndex < 2 ? (
            <button
              disabled={checkStatus()}
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="px-10 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={GenerateCourseLayout}
              disabled={checkStatus() || loading}
              className="relative overflow-hidden group px-10 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.8)] hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating AI Course...
                </span>
              ) : "🚀 Generate Course"}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 glass rounded-2xl border border-red-500/30 flex items-start gap-3 bg-red-500/5">
            <HiLightBulb className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
      </div>

      <LoadingDialog loading={loading} />
    </div>
  )
}

export default CreateCoursePage
