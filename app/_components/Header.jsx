import React from 'react'
import Image from 'next/image'
function Header() {
  return (
    <div className="flex justify-between p-5 shadow-sm">
        <Image src={"./Rverse.svg"}  alt="Rverse Logo"  width={200} height={200} />
    </div>

  )
}

export default Header
