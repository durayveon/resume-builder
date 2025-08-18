'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-8 w-24 rounded-md bg-slate-700 animate-pulse" />
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        {session.user?.image ? (
          <img src={session.user.image} alt={session.user.name || 'User'} className="h-8 w-8 rounded-full" />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-slate-400" />
        )}
        <button 
          onClick={() => signOut()} 
          className="flex items-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-500">
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => signIn('google')} 
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
      Sign In with Google
    </button>
  )
}
