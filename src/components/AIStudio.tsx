'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { TextareaField } from '@/components/Fields'
import ReactMarkdown from 'react-markdown'

function ResumePreview({ resume }: { resume: string }) {
  return (
    <div className="h-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
      <div className="prose prose-sm h-full w-full max-w-none text-gray-700">
        {resume ? (
          <ReactMarkdown>{resume}</ReactMarkdown>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Your generated resume will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function AIStudio() {
  const [userInput, setUserInput] = useState('')
  const [resume, setResume] = useState('')

  async function generateResume() {
    setResume('Generating...')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume.')
      }

      const data = await response.json()
      setResume(data.resume)
    } catch (error) {
      console.error(error)
      setResume('Failed to generate resume. Please try again.')
    }
  }
  return (
    <Container className="py-16 sm:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI Resume Studio
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Tell us about yourself in your own words, and our AI will craft the
            perfect resume for you.
          </p>
          <div className="mt-8 flex-auto">
            <TextareaField
              label="Describe your experience"
              placeholder="I'm a software engineer with 5 years of experience building web applications..."
              className="h-full"
              rows={10}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          <Button className="mt-6 w-full" onClick={generateResume}>Generate with GPT-4o</Button>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Live Preview
          </h2>
          <div className="mt-6 flex-auto">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </Container>
  )
}
