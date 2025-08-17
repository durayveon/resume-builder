import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <section
      id="start-your-career"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Land your dream job faster
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Join thousands of professionals who've accelerated their job search with our
            AI-powered tools. Your next career move starts here.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Button href="/ai-studio" color="white" className="px-8">
              Build Your Resume - It's Free
            </Button>
            <Button href="/pricing" variant="outline" className="px-8 text-white border-white hover:bg-white/10">
              See Premium Features
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
