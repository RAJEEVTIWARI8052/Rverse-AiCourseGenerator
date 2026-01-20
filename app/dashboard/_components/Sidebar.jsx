// app/dashboard/_components/sidebar.js
"use client"
import React, { useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaPowerOff } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { Progress } from "../../../components/progress"
import UserCourseListContext from '../../_context/UserCourseListContext';
import { cn } from '../../../lib/utils';

function Sidebar({ closeSidebar }) {
    const { UserCourseList, setUserCourseList } = useContext(UserCourseListContext)
    const pathname = usePathname();

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
        <div className="flex bg-white dark:bg-black w-64 h-full flex-col border-r shadow-lg md:shadow-none overflow-y-auto">
            {/* Logo */}
            <div className="flex justify-between items-center p-5 border-b md:border-b-0">
                <h1 className="text-3xl font-bold gradient-text">Rverse</h1>
                {/* Mobile Close Button */}
                <button
                    className="md:hidden text-gray-500"
                    onClick={() => closeSidebar && closeSidebar()}
                >
                    ✕
                </button>
            </div>

            {/* Navigation Menu */}
            <ul className="space-y-4 flex-1 p-5">
                {Menu.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <li key={item.id}>
                            <Link href={item.path} onClick={() => closeSidebar && closeSidebar()}>
                                <div className={cn(
                                    "flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-300",
                                    isActive
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-white/5 hover:scale-105"
                                )}>
                                    <div className="text-xl">
                                        {item.icon}
                                    </div>
                                    <h2 className="text-sm font-medium">{item.title}</h2>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="p-5">
                {/* Progress Section */}
                <div className="mb-6 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Credits Used</span>
                        <span className="text-sm text-gray-500">{UserCourseList?.length || 0}/5</span>
                    </div>
                    <Progress value={(UserCourseList?.length / 5) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    <h2 className="text-xs text-gray-500 mt-2">Upgrade for more</h2>
                </div>

                {/* User Button at bottom */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
                    <UserButton
                        showName={true}
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10 ring-2 ring-purple-500"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Sidebar