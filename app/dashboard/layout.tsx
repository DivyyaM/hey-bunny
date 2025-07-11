'use client'

import React from 'react'
import { UserButton } from '@clerk/nextjs'
import SideNav from './_components/SideNav'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'
import { useState, useEffect } from 'react'

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-400">Error Details</summary>
                <pre className="mt-2 text-xs text-red-300 bg-red-900/20 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [userSubscription, setUserSubscription] = useState<boolean>(false);
  const [updateCreditUsage, setUpdateCreditUsage] = useState<number>(0);

  useEffect(() => {
    // Load usage from localStorage
    const savedUsage = localStorage.getItem('totalUsage');
    if (savedUsage) {
      setTotalUsage(parseInt(savedUsage));
    }

    // Load subscription status from localStorage
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
      setUserSubscription(JSON.parse(savedSubscription));
    }
  }, []);

  useEffect(() => {
    // Save usage to localStorage whenever it changes
    localStorage.setItem('totalUsage', totalUsage.toString());
  }, [totalUsage]);

  useEffect(() => {
    // Save subscription status to localStorage whenever it changes
    localStorage.setItem('userSubscription', JSON.stringify(userSubscription));
  }, [userSubscription]);

  return (
    <ErrorBoundary>
      <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
        <UserSubscriptionContext.Provider value={{ userSubscription, setUserSubscription }}>
          <UpdateCreditUsageContext.Provider value={{ updateCreditUsage, setUpdateCreditUsage }}>
            <div className='flex'>
              <SideNav />
              <div className='flex-1'>
                <div className='flex justify-between items-center p-4 bg-black'>
                  <h1 className='text-white text-2xl font-bold'>Hey Bunny</h1>
                  <UserButton />
                </div>
                {children}
              </div>
            </div>
          </UpdateCreditUsageContext.Provider>
        </UserSubscriptionContext.Provider>
      </TotalUsageContext.Provider>
    </ErrorBoundary>
  )
}