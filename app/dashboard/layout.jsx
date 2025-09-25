"use client"
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'
import UserCourseListContext from '../_context/UserCourseListContext'
import React, { useState } from 'react'

export default function DashboardLayout({ children }) {
  const [userCourseList, setUserCourseList] = useState([])

  return (
    <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div><Header /></div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ UserCourseListContext.Provider>
  )
}