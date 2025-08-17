import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Construct the prompt for the AI
    const prompt = `
    Analyze the following resume and provide a detailed analysis based on the job description.
    
    JOB DESCRIPTION:
    ${jobDescription || 'No job description provided. Analyze for general best practices.'}
    
    RESUME DATA:
    ${JSON.stringify(resume, null, 2)}
    
    Please provide a comprehensive analysis with the following sections:
    1. Overall score (1-100) based on content quality, ATS compatibility, and job description match
    2. Key strengths (3-5 bullet points)
    3. Areas for improvement with specific suggestions (categorized by section)
    4. ATS compatibility score (1-100) with identified issues
    5. Keyword matching analysis (if job description is provided)
    
    Format the response as a JSON object with the following structure:
    {
      "score": number,
      "strengths": string[],
      "improvements": [
        {
          "section": string,
          "message": string,
          "priority": "high" | "medium" | "low",
          "suggestion": string
        }
      ],
      "atsCompatibility": {
        "score": number,
        "issues": string[],
        "suggestions": string[]
      },
      "keywordMatch": {
        "matched": string[],
        "missing": string[]
      }
    }
    `;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume reviewer and career coach. Provide detailed, constructive feedback to help improve the resume.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 2000,
    });

    // Extract and parse the analysis
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Try to parse the JSON response
    try {
      const parsedAnalysis = JSON.parse(content);
      return NextResponse.json(parsedAnalysis);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse AI analysis' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
