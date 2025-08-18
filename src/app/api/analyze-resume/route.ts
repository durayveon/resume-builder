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
      return NextResponse.json({ message: 'OpenAI API key is not configured.' }, { status: 500 });
    }

    if (!resumeText) {
      return NextResponse.json({ message: 'No resume text provided for analysis.' }, { status: 400 });
    }

    const prompt = `
      You are a world-class career coach and resume analyst. Your task is to provide a detailed, constructive analysis of the following resume. 
      The user needs actionable feedback to improve their resume for top-tier job applications.

      **Resume Text to Analyze:**
      """
      ${resumeText}
      """

      **Analysis Instructions:**
      Provide your analysis in a structured JSON format. The JSON object should have the following keys:
      - "overallScore": A numerical score from 0 to 100, representing the overall quality of the resume.
      - "summaryFeedback": A string containing specific feedback on the professional summary. Comment on its impact, clarity, and length.
      - "actionVerbsFeedback": A string analyzing the use of action verbs in the work experience section. Note if they are strong and varied, or weak and repetitive.
      - "quantificationFeedback": A string assessing how well the resume uses numbers and metrics to show impact (e.g., "Increased sales by 20%").
      - "formattingFeedback": A string providing feedback on the resume's formatting, including consistency, readability, and use of white space.
      - "finalVerdict": A concluding paragraph summarizing the key strengths and the single most important area for improvement.

      **IMPORTANT:** Your output must be only the raw JSON object, without any surrounding text, explanations, or markdown formatting.

      Begin your analysis now.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // Optimized for JSON mode
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const analysisResult = completion.choices[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('AI failed to generate an analysis.');
    }

    // The model should return a valid JSON string, so we parse it before sending.
    const analysisJson = JSON.parse(analysisResult);

    return NextResponse.json(analysisJson);

  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during analysis.', error: error.message },
      { status: 500 }
    );
  }
}
