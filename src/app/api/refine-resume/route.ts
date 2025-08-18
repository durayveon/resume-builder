import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    const { name, email, phone, linkedin, summary, experience, education, skills } = body;

    // Construct a detailed prompt for the AI to refine the resume
    const prompt = `
      You are an expert resume writer. A user has provided detailed, structured information to refine their resume. 
      Your task is to take this data and generate a perfectly formatted, professional, one-page resume.

      **Candidate Information:**
      - **Full Name:** ${name}
      - **Contact:** ${email} | ${phone} ${linkedin ? `| ${linkedin}` : ''}

      **Professional Summary:**
      ${summary}

      **Work Experience:**
      ${experience.map((exp: any) => `
        - **Position:** ${exp.position}
        - **Company:** ${exp.company}
        - **Duration:** ${exp.duration}
        - **Key Responsibilities & Achievements:**\n${exp.responsibilities.split('\n').map((line: string) => `          - ${line}`).join('\n')}
      `).join('')}

      **Education:**
      ${education.map((edu: any) => `
        - **Degree:** ${edu.degree}
        - **Institution:** ${edu.institution}
        - **Year of Completion:** ${edu.year}
      `).join('')}

      **Skills:**
      ${skills}

      **Instructions:**
      - Format the output as a clean, professional, plain-text resume.
      - Use strong action verbs and professional language.
      - Ensure the layout is clean, with clear headings for each section.
      - The final output should be only the resume text, starting with the name. Do not include any introductory phrases.

      Begin generating the refined resume now.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const refinedResume = completion.choices[0]?.message?.content;

    return NextResponse.json({ resume: refinedResume });

  } catch (error: any) {
    console.error('Error in /api/refine-resume:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
