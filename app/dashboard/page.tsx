'use client'

import React, { useState, useEffect } from "react"
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { useUser } from '@clerk/nextjs';
import SearchSection from "./_components/SearchSection"
import TemplateListSection from "./_components/TemplateListSection"
import useAbTest from './_components/useAbTest';

export default function Dashboard() {
  const { user } = useUser();
  const [userSearchInput, setUserSearchInput] = useState<string>("");
  const [envCheck, setEnvCheck] = useState<{ [key: string]: boolean }>({});
  const { group } = useAbTest();

  // Environment check for development/debugging
  useEffect(() => {
    const checkEnv = {
      hasApiKey: !!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
      hasDbUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
    };
    setEnvCheck(checkEnv);
  }, []);

  // Typewriter effect for welcome message
  const [text] = useTypewriter({
    words: [
      `Welcome aboard, ${user?.firstName || 'Guest'}! 🐰✨\n\nI'm Bunny, your new social media sidekick, and trust me, I'm all ears for whatever you need! 😆 Whether you're here to level up your socials or just chill with an AI rabbit who's got the hoppin' tips for going viral, you're in the right place!\n\nSo buckle up – or should I say, hop right in! – and let's make some social media magic together. 🪄🐇\n\n(And don't worry, I promise not to eat all your carrots… just a few! 🥕)`
    ],
    loop: 1,
    typeSpeed: 30,
    deleteSpeed: 10,
  })

  return (
    <div className="relative min-h-screen bg-black">
      <div>
        <SearchSection onSearchInput={(value: string) => setUserSearchInput(value)} />
        <TemplateListSection userSearchInput={userSearchInput} />
      </div>
      {/* Environment Status (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-3 bg-black/80 rounded-lg text-white text-xs">
          <div className="font-bold mb-1">Environment Status:</div>
          <div className={`${envCheck.hasApiKey ? 'text-green-400' : 'text-red-400'}`}>API Key: {envCheck.hasApiKey ? '✓' : '✗'}</div>
          <div className={`${envCheck.hasDbUrl ? 'text-green-400' : 'text-red-400'}`}>Database: {envCheck.hasDbUrl ? '✓' : '✗'}</div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <a href="/dashboard/test" className="text-blue-400 hover:text-blue-300">Test Page</a>
          </div>
        </div>
      )}
    </div>
  );
}
