"use client";

import React, { useEffect, useState } from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import { UserButton, useUser } from "@clerk/nextjs";

function Header({ setOpenSidebar }) {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-between p-4 shadow-sm border-b border-white/10 glass items-center sticky top-0 z-40">
      {/* Left: Hamburger + Welcome */}
      <div className="flex items-center gap-3">
        <HiMenuAlt2
          className="md:hidden h-7 w-7 cursor-pointer text-gray-400 hover:text-purple-400 transition-colors"
          onClick={() => setOpenSidebar && setOpenSidebar(true)}
        />
        {mounted && user && (
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-gray-500">Welcome back 👋</span>
            <span className="text-sm font-bold gradient-text">{user?.firstName || 'User'}</span>
          </div>
        )}
      </div>

      {/* Right: Profile Button */}
      <div className="flex items-center gap-3">
        {mounted ? (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-purple-500/10">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-gray-500 group-hover:text-purple-400 transition-colors font-medium">Account</span>
              <span className="text-xs font-bold text-gray-200 truncate max-w-[100px]">
                {user?.fullName || user?.firstName || 'Profile'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
              <UserButton
                showName={false}
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-purple-500/40 hover:ring-pink-500/60 transition-all shadow-md rounded-full",
                    userButtonPopoverCard: "bg-[#0d0d1a] border border-white/10 shadow-2xl rounded-2xl",
                    userButtonPopoverActionButton: "text-gray-200 hover:bg-white/10 rounded-xl",
                    userButtonPopoverActionButtonText: "text-gray-200",
                    userButtonPopoverFooter: "hidden",
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col items-end gap-1">
              <div className="h-2 w-12 bg-gray-700 animate-pulse rounded" />
              <div className="h-2.5 w-20 bg-gray-700 animate-pulse rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse ring-2 ring-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;