import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json()

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 })
    }

    const systemPrompt = `You are an expert resume writer. Your task is to craft a professional, concise, and impactful resume based on the user's provided experience. The output should be in Markdown format and include sections for Summary, Experience, and Skills.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    const generatedResume = completion.choices[0]?.message?.content

    if (!generatedResume) {
      return NextResponse.json(
        { error: 'Failed to generate resume from AI.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ resume: generatedResume })
  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
