import { AIStudio } from '@/components/AIStudio'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function AIStudioPage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <AIStudio />
      </main>
      <Footer />
    </>
  )
}
