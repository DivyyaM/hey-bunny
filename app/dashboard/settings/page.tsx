import { UserProfile } from '@clerk/nextjs'
import React from 'react'

// @ts-ignore
import { dark } from '@clerk/themes'

function Settings() {
  return (
    <div className='min-h-screen bg-[#18181b] text-white p-8'>
        <UserProfile appearance={{baseTheme : dark}}   routing="hash" />
    </div>
  )
}

export default Settings