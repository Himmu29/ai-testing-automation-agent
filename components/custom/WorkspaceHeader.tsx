import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader() {
  return (
    <div className='flex w-full items-center justify-between p-4 border-b '>
        {/* Logo */}
        <Image src={'/logo.svg'} alt="Logo" width={50} height={50} />

        {/* Menu Options */}
        <ul className='flex gap-5 text-xl '>
            <li className='hover:text-blue-500 cursor-pointer'>Workspace</li>
            <li className='hover:text-blue-500 cursor-pointer'>Pricing</li>
            <li className='hover:text-blue-500 cursor-pointer'>Support</li>
        </ul>

        {/* User Button  */}

        <UserButton/>
    </div>
  )
}

export default WorkspaceHeader