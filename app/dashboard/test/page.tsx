'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className='p-5 text-white'>
      <h1 className='text-2xl font-bold mb-4'>Test Page</h1>
      <p className='mb-4'>This is a test page to verify routing is working correctly.</p>
      
      <div className='space-y-2'>
        <p><strong>Environment Variables:</strong></p>
        <p>API Key: {process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY ? '✓ Set' : '✗ Not Set'}</p>
        <p>Database URL: {process.env.NEXT_PUBLIC_DRIZZLE_DB_URL ? '✓ Set' : '✗ Not Set'}</p>
      </div>
      
      <div className='mt-6'>
        <Link href='/dashboard'>
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
} 