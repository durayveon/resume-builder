'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ResumeStudio from '@/components/ResumeStudio' // Adjusted import path
import { Header } from '@/components/Header'

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main>
          <ResumeStudio />
        </main>
      </div>
    )
  }

  return null
}
