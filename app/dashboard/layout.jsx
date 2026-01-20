"use client"
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'
import UserCourseListContext from '../_context/UserCourseListContext'
import React, { useState } from 'react'

export default function DashboardLayout({ children }) {
  const [userCourseList, setUserCourseList] = useState([])
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {openSidebar && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
            <div className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-black animate-in slide-in-from-left">
              <Sidebar closeSidebar={() => setOpenSidebar(false)} />
            </div>
            {/* Click outside to close */}
            <div className="flex-1 h-full" onClick={() => setOpenSidebar(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setOpenSidebar={setOpenSidebar} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="md:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserCourseListContext.Provider>
  )
}