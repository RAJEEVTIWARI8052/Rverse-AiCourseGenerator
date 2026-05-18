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
      <div className="flex h-screen overflow-hidden" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(88,28,135,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(219,39,119,0.1) 0%, transparent 60%), #060612" }}>
        {/* Ambient glow orbs */}
        <div className="fixed top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-200px] right-[-100px] w-[400px] h-[400px] rounded-full bg-pink-900/15 blur-[100px] pointer-events-none z-0" />

        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block relative z-10">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {openSidebar && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden">
            <div className="absolute top-0 left-0 h-full w-64 animate-in slide-in-from-left">
              <Sidebar closeSidebar={() => setOpenSidebar(false)} />
            </div>
            <div className="flex-1 h-full" onClick={() => setOpenSidebar(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
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