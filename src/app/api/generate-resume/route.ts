import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateSimplePrompt = (name: string, linkedin: string, talents: string) => `
You are an expert resume writer. Your task is to create a complete, professional, one-page resume based on the high-level information provided by a user. 
The user has provided their name, an optional LinkedIn profile URL, and a free-form description of their skills, experiences, and unique talents.

**User-Provided Information:**
- **Full Name:** ${name}
- **LinkedIn Profile:** ${linkedin || 'Not provided'}
- **Skills, Gifts, and Experiences:** ${talents}

**Your Task:**
1.  **Analyze the Input:** Carefully analyze the 'Skills, Gifts, and Experiences' text. Identify key skills, job titles, accomplishments, projects, and potential career themes. If a LinkedIn profile is provided, assume you can infer standard career progression, job responsibilities, and educational background from it.
2.  **Structure the Resume:** Generate a standard, professional resume structure including Contact Information, a powerful Summary, Work Experience with achievements, Education, and a Skills section.
3.  **Generate Content:** Write compelling, professional content. The final output must be a complete, well-formatted, plain-text resume.

**Important Instructions:**
- Elaborate professionally on the user's input without contradicting it.
- If input is sparse, create a strong, generalized resume for a role that aligns with the provided clues.
- The output must be only the resume text, starting with the name.

Begin generating the resume now.
`;

const generateDetailedPrompt = (profile: any) => `
You are an expert resume writer and career strategist. Your task is to transform structured data from a user's professional profile into a world-class, polished, and achievement-oriented resume.

**Structured Profile Data:**
- **Full Name:** ${profile.fullName}
- **Headline:** ${profile.headline}
- **Summary:** ${profile.summary}
- **Work Experience:**
  ${profile.experience.map((job: any) => `
    - **Title:** ${job.title}
    - **Company:** ${job.company}
    - **Duration:** ${job.duration}
    - **Description:** ${job.description}
  `).join('')}
- **Education:**
  ${profile.education.map((edu: any) => `
    - **School:** ${edu.school}
    - **Degree:** ${edu.degree}
    - **Duration:** ${edu.duration}
  `).join('')}
- **Skills:** ${profile.skills.join(', ')}

**Your Task:**
1.  **Synthesize and Enhance:** Do not just copy the data. Synthesize it. Transform the descriptions from passive responsibilities into active, quantifiable achievements.
2.  **Craft a Powerful Summary:** Write a compelling professional summary (3-4 sentences) based on the user's headline and overall experience.
3.  **Format Professionally:** Structure the output into a clean, modern, ATS-friendly resume format. Use standard sections: Contact Info, Summary, Skills, Work Experience, Education.
4.  **Refine Bullet Points:** For each job, create 3-5 powerful bullet points. Start each with a strong action verb. Focus on impact and results (e.g., 'Led a team that increased efficiency by 25%' instead of 'Responsible for leading a team').

**Important Instructions:**
- The output must be only the complete resume text. Do not include any comments or introductory phrases.
- Infer professional contact details (email, phone).

Begin crafting the enhanced resume now.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    let prompt;
    // Check if detailed profile data is provided, otherwise use simple form data
    if (body.profileData) {
      prompt = generateDetailedPrompt(body.profileData);
    } else {
      const { name, linkedin, talents } = body;
      if (!name || !talents) {
        return NextResponse.json({ message: 'Name and talents are required for simple generation.' }, { status: 400 });
      }
      prompt = generateSimplePrompt(name, linkedin, talents);
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiGeneratedResume = completion.choices[0]?.message?.content;

    if (!aiGeneratedResume) {
      throw new Error('AI failed to generate a response.');
    }

    return NextResponse.json({ resume: aiGeneratedResume });

  } catch (error) {
    console.error('Error generating resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Error generating resume: ${errorMessage}` }, { status: 500 });
  }
}
