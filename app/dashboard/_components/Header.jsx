import React from 'react'
import Image from 'next/image'
import {UserButton} from "@clerk/nextjs"
function Header() {
  return (
    <div className="flex justify-between p-5 shadow-sm">
      <img
        src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4bb.png" 
        alt="Logo" 
        width={100} 
        height={100} 
      />
      <UserButton />
    </div>
  )
}

export default Header