// app/dashboard/_components/sidebar.js
"use client"
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaHistory, FaPowerOff } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { Progress } from "../../../components/progress"
import UserCourseListContext from '../../_context/UserCourseListContext';
import { cn } from '../../../lib/utils';

function Sidebar({ closeSidebar }) {
    const { UserCourseList, setUserCourseList } = useContext(UserCourseListContext)
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const Menu = [
        {
            id: 1,
            title: "Home",
            icon: <FaHome />,
            path: "/dashboard",
        },
        {
            id: 2,
            title: "Explore",
            icon: <BsStack />,
            path: "/dashboard/explore"
        },
        {
            id: 5,
            title: "History",
            icon: <FaHistory />,
            path: "/dashboard"
        },
        {
            id: 3,
            title: "Upgrade",
            icon: <IoShieldCheckmark />,
            path: "/dashboard/upgrade"
        },
        {
            id: 4,
            title: "Logout",
            icon: <FaPowerOff />,
            path: "/dashboard/logout"
        }
    ]

    return (
        <div className="flex glass w-64 h-full flex-col border-r border-white/20 shadow-[8px_0_30px_rgba(0,0,0,0.1)] overflow-y-auto relative z-20 transition-all duration-300">
            {/* Logo */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 blur-xl"></div>
                <h1 className="text-3xl font-black gradient-text relative z-10 drop-shadow-md">Rverse</h1>
                {/* Mobile Close Button */}
                <button
                    className="md:hidden text-gray-400 hover:text-white transition-colors z-10 bg-white/5 p-2 rounded-full"
                    onClick={() => closeSidebar && closeSidebar()}
                >
                    ✕
                </button>
            </div>

            {/* Navigation Menu */}
            <ul className="space-y-3 flex-1 p-5">
                {Menu.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <li key={item.id}>
                            <Link href={item.path} onClick={() => closeSidebar && closeSidebar()}>
                                <div className={cn(
                                    "flex items-center gap-4 cursor-pointer rounded-2xl p-3.5 transition-all duration-500 card-hover",
                                    isActive
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_8px_20px_-6px_rgba(236,72,153,0.5)] border border-white/20 scale-[1.02]"
                                        : "text-gray-400 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-white border border-transparent"
                                )}>
                                    <div className={cn("text-xl transition-transform duration-300", isActive && "scale-110")}>
                                        {item.icon}
                                    </div>
                                    <h2 className="text-[15px] font-bold tracking-wide">{item.title}</h2>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="p-5 mt-auto">
                {/* Progress Section */}
                <div className="mb-6 p-5 glass rounded-2xl border border-white/10 card-hover group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-3 relative z-10">
                        <span className="text-sm font-bold text-gray-300">Credits Used</span>
                        <span className="text-sm font-black text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded-md">{UserCourseList?.length || 0}/5</span>
                    </div>
                    <Progress value={(UserCourseList?.length / 5) * 100} className="h-2.5 bg-gray-800 shadow-inner rounded-full overflow-hidden" />
                    <h2 className="text-xs text-gray-400 mt-3 font-medium group-hover:text-purple-300 transition-colors relative z-10">Upgrade for unlimited</h2>
                </div>

                {/* User Button at bottom (Hydration Safe) */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 shadow-lg cursor-pointer hover:shadow-purple-500/20 card-hover">
                    {mounted ? (
                        <UserButton
                            showName={true}
                            appearance={{
                                elements: {
                                    avatarBox: "w-11 h-11 ring-2 ring-purple-500/50 hover:ring-pink-500 transition-all shadow-md",
                                    userButtonBox: "font-bold text-gray-200",
                                }
                            }}
                        />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-700 animate-pulse ring-2 ring-gray-600"></div>
                            <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar