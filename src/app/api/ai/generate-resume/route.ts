import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, existingResume } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Construct the prompt for the AI
    const prompt = `
    Create a professional resume based on the following job description and existing resume information.
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    EXISTING RESUME INFORMATION:
    ${JSON.stringify(existingResume, null, 2)}
    
    Please generate a well-structured resume with the following sections:
    1. Contact Information
    2. Professional Summary
    3. Work Experience (with bullet points highlighting achievements)
    4. Education
    5. Skills (tailored to the job description)
    6. Certifications (if any)
    
    Format the response as a JSON object with the following structure:
    {
      "personalInfo": {
        "fullName": string,
        "email": string,
        "phone": string,
        "linkedIn": string,
        "portfolio": string
      },
      "summary": string,
      "experiences": [
        {
          "company": string,
          "position": string,
          "startDate": string,
          "endDate": string,
          "responsibilities": string[],
          "isCurrent": boolean
        }
      ],
      "education": [
        {
          "degree": string,
          "institution": string,
          "fieldOfStudy": string,
          "startYear": string,
          "endYear": string
        }
      ],
      "skills": string[],
      "certifications": string[]
    }
    `;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer and career coach. Create professional, ATS-friendly resumes that highlight the candidate\'s strengths and match the job requirements.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract and parse the generated resume
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Try to parse the JSON response
    try {
      const parsedResume = JSON.parse(content);
      return NextResponse.json(parsedResume);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
