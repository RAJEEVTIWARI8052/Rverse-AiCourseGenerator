// app/dashboard/_components/sidebar.js
"use client"
import React from 'react'
import Link from 'next/link'
import { FaHome } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";
import { UserButton } from "@clerk/nextjs";
import { Progress } from "../../../components/progress"
import UserCourseList from './UserCourseList';
import UserCourseListContext from '../../_context/UserCourseListContext';
import { useContext } from 'react';




function Sidebar() {
    const {UserCourseList,setUserCourseList} = useContext(UserCourseListContext)
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
            id:4,
            title:"Logout",
            icon: <FaPowerOff />,
            path: "/dashboard/logout"
        }
    ]

    return (
        <div className="fixed h-full w-64 p-5 shadow-md bg-white border-r">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">Rverse</span>
                </div>
            </div>
            
            <hr className='my-5' />
            
            {/* Navigation Menu */}
            <ul className="space-y-2">
                {Menu.map((item) => (
                    <li key={item.id}>
                        <Link href={item.path}>
                            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-black rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                <div className="text-xl">
                                    {item.icon}
                                </div>
                                <h2 className="text-sm font-medium">{item.title}</h2>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            
            {/* Progress Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Usage</span>
                    <span className="text-sm text-gray-500">33%</span>
                </div>
                <Progress value={UserCourseList?.length / 5} className="h-2" />
                <h2 className="text-xs text-gray-500 mt-2">{UserCourseList?.length}Out of 5 courses</h2>
            </div>
            
            {/* User Button at bottom */}
            <div className="absolute bottom-5 left-5">
                <UserButton 
                    showName={true}
                    appearance={{
                        elements: {
                            avatarBox: "w-10 h-10"
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Sidebar