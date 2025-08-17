'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'


interface Job {
  title: string
  company: { display_name: string }
  location: { display_name: string }
  description: string
  redirect_url: string
}

function JobListItem({ job }: { job: Job }) {
    const descriptionSnippet = job.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
      <p className="text-sm font-medium text-gray-600">
        {job.company.display_name} - {job.location.display_name}
      </p>
      <p className="mt-2 text-sm text-gray-500">{descriptionSnippet}</p>
      <a href={job.redirect_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800">
        View Job &rarr;
      </a>
    </div>
  )
}

export function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs.')
        }
        const data = await response.json()
        setJobs(data.results) // Adzuna API returns jobs in a 'results' property
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Job Board
      </h1>
      <p className="mt-4 text-lg text-slate-700">
        Find your next opportunity with our curated list of top tech jobs.
      </p>
      <div className="mt-12 space-y-8">
        {loading && <p>Loading jobs...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && jobs.map((job, index) => (
          <JobListItem key={index} job={job} />
        ))}
      </div>
    </Container>
  )
}
