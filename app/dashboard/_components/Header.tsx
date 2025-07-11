import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {dark} from "@clerk/themes";

function Header() {
  const [bunnyPoints, setBunnyPoints] = useState(100);
  const [showReferral, setShowReferral] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [referralCode] = useState(() => {
    if (typeof window === 'undefined') return '';
    let code = localStorage.getItem('referralCode');
    if (!code) {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      localStorage.setItem('referralCode', code);
    }
    return code;
  });

  useEffect(() => {
    const points = parseInt(localStorage.getItem('bunnyPoints') || '100', 10);
    setBunnyPoints(points);
  }, []);

  function handleGetMorePoints() {
    setShowReferral(true);
  }

  function handleInvite() {
    // Only allow 1 reward per day
    const today = new Date().toISOString().slice(0, 10);
    const lastReward = localStorage.getItem('lastReferralReward');
    if (lastReward === today) {
      setInviteSuccess(false);
      alert('You can only earn referral points once per day!');
      return;
    }
    // Reward +20 BunnyPoints
    const newPoints = bunnyPoints + 20;
    localStorage.setItem('bunnyPoints', newPoints.toString());
    localStorage.setItem('lastReferralReward', today);
    setBunnyPoints(newPoints);
    window.dispatchEvent(new Event('bunnyPointsUpdate'));
    setInviteSuccess(true);
    setInviteEmail('');
  }

  return (
    <div className='p-5 shadow-sm bg-black flex justify-between items-center'>
      <div className='flex gap-2 items-center border-[#242424] p-2 rounded-md max-w-lg bg-[#0a0a0a] '>
        {/* <Search color='white '/>
        <input type='text' placeholder='Search...'
        className='outline-none text-white bg-[#0a0a0a] '
        /> */}
      </div>
      <div className='flex gap-5 items-center'>
        <div className='flex items-center gap-2 bg-[#23233a] px-3 py-1 rounded-full text-pink-400 font-bold shadow'>
          🥕 BunnyPoints: <span className='text-white'>{bunnyPoints}</span>
          <button onClick={handleGetMorePoints} className='ml-2 px-2 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 transition'>Get More</button>
        </div>
        <h2 className='bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 rounded-full text-sm text-white px-2'>
          🐰 Need help? Bunny’s got your back! 🌟
        </h2>
        <UserButton appearance={{baseTheme:dark}} />
      </div>
      {showReferral && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#23233a] p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#23233a] flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold text-white mb-2">Invite a Friend & Earn BunnyPoints!</h2>
            <p className="text-gray-300 mb-2 text-center">Share your referral code or invite a friend by email.<br/>Earn <span className='text-pink-400 font-bold'>+20 BunnyPoints</span> (once per day).</p>
            <div className='w-full flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <input
                  className='p-2 rounded bg-[#18181b] text-white border border-gray-700 flex-1'
                  placeholder='Friend’s email (mock)'
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
                <button
                  className='bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition'
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                >
                  Invite
                </button>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <span className='text-gray-400 text-xs'>Your referral code:</span>
                <span className='bg-black text-pink-400 px-2 py-1 rounded font-mono'>{referralCode}</span>
                <button
                  className='text-xs text-blue-400 underline ml-2'
                  onClick={() => {navigator.clipboard.writeText(referralCode); alert('Copied!')}}
                >Copy</button>
              </div>
            </div>
            {inviteSuccess && <div className='text-green-400 font-bold mt-2'>+20 BunnyPoints added! 🎉</div>}
            <button
              className='text-gray-400 underline text-xs mt-2'
              onClick={() => { setShowReferral(false); setInviteSuccess(false); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header;