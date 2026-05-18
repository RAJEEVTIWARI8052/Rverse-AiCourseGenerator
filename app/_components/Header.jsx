"use client";

import React, { useEffect, useState } from 'react'
import { Button } from '../../components/button'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-between items-center p-5 shadow-sm border-b border-white/10 glass sticky top-0 z-50">
      <Link href="/">
        <h1 className="text-xl md:text-2xl font-bold gradient-text cursor-pointer">Rverse AI</h1>
      </Link>
      <div className='flex gap-4 items-center'>
        {mounted && (
          <>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
