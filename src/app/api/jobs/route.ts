import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.ADZUNA_APP_ID
  const apiKey = process.env.ADZUNA_API_KEY

  if (!appId || !apiKey) {
    return NextResponse.json(
      { error: 'Adzuna API credentials are not configured.' },
      { status: 500 },
    )
  }

  const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=20&what=javascript%20developer&content-type=application/json`

  try {
    const response = await fetch(adzunaUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to fetch jobs from Adzuna API.')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching jobs.' },
      { status: 500 },
    )
  }
}
