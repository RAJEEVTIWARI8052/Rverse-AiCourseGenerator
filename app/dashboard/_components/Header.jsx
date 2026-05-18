"use client";

import React, { useEffect, useState } from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import { UserButton } from "@clerk/nextjs";

function Header({ setOpenSidebar }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-between p-5 shadow-sm border-b border-white/10 glass items-center sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <HiMenuAlt2
          className="md:hidden h-7 w-7 cursor-pointer text-gray-500 hover:text-purple-600 transition-colors"
          onClick={() => setOpenSidebar && setOpenSidebar(true)}
        />
        {/* Placeholder for Breadcrumbs or Welcome text */}
      </div>
      <div className="flex items-center">
        {mounted ? (
          <UserButton 
            appearance={{
                elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-purple-500/50 hover:ring-pink-500 transition-all shadow-md",
                }
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse ring-2 ring-gray-600"></div>
        )}
      </div>
    </div>
  )
}

export default Header