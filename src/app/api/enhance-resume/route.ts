import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    if (!resumeText) {
      return NextResponse.json(
        { message: 'No resume text provided.' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert resume editor and career coach. A user has uploaded their existing resume for enhancement.
      Your task is to analyze the provided resume text, then rewrite and reformat it to be significantly more professional, impactful, and ATS-friendly.

      **Original Resume Text:**
      """
      ${resumeText}
      """

      **Your Instructions:**
      1.  **Analyze and Identify Weaknesses:** Read through the original text and identify areas for improvement. Look for passive language, weak action verbs, inconsistent formatting, and missed opportunities to showcase achievements.
      2.  **Rewrite for Impact:** Transform responsibilities into quantifiable achievements. Replace weak phrases with powerful, action-oriented language. Ensure the professional summary is concise and compelling.
      3.  **Standardize Formatting:** Reformat the entire resume into a clean, modern, and professional layout. Use clear headings (Summary, Work Experience, Education, Skills) and consistent use of bullet points.
      4.  **Ensure Professional Tone:** The final output must be polished, professional, and ready for a job application.
      5.  **Output Only the Resume:** The final output should be only the full, enhanced resume text, starting with the candidate's name. Do not include any of your own analysis, comments, or introductory phrases.

      Begin enhancing the resume now.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const enhancedResume = completion.choices[0]?.message?.content;

    return NextResponse.json({ resume: enhancedResume });

  } catch (error: any) {
    console.error('Error in /api/enhance-resume:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
