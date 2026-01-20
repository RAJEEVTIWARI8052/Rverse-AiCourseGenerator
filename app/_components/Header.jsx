import React from 'react'
import { Button } from '../../components/button'
import Link from 'next/link'

function Header() {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm border-b border-white/10 glass sticky top-0 z-50">
      <h1 className="text-xl md:text-2xl font-bold gradient-text">Rverse AI</h1>
      <div className='flex gap-4 items-center'>
        <Link href="/dashboard">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  )
}

export default Header
