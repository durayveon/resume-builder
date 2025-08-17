import { JobBoard } from '@/components/JobBoard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function JobsPage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <JobBoard />
      </main>
      <Footer />
    </>
  )
}
