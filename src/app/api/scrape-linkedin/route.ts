import { NextRequest, NextResponse } from 'next/server';

// This is a mock response to simulate a LinkedIn profile scraping API.
// In a real-world application, this would be replaced with a call to a service like Bright Data, Apify, or a custom scraping solution.
const mockLinkedInProfile = {
  fullName: 'Jane Doe',
  headline: 'Senior Software Engineer at Tech Corp | Cloud & DevOps Enthusiast',
  summary: 'Experienced Senior Software Engineer with a demonstrated history of working in the computer software industry. Skilled in cloud computing (AWS, Azure), DevOps practices (Docker, Kubernetes), and back-end development (Node.js, Python). Strong engineering professional with a Bachelor of Science (B.S.) focused in Computer Science from a top-tier university.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      duration: 'Jan 2022 - Present',
      description: 'Designing and implementing scalable cloud-native applications. Leading a team of developers on critical projects and mentoring junior engineers. Driving the adoption of DevOps best practices across the organization.',
    },
    {
      title: 'Software Engineer',
      company: 'Innovate Solutions',
      duration: 'Jun 2019 - Dec 2021',
      description: 'Developed and maintained microservices for the company\'s flagship product. Contributed to a 20% improvement in application performance by optimizing database queries and refactoring legacy code.',
    },
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Science - BS, Computer Science',
      duration: '2015 - 2019',
    },
  ],
  skills: ['AWS', 'Microsoft Azure', 'Docker', 'Kubernetes', 'Terraform', 'Node.js', 'Python', 'Go', 'React', 'TypeScript', 'CI/CD', 'Agile Methodologies'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkedinUrl } = body;

    if (!linkedinUrl) {
      return NextResponse.json({ message: 'LinkedIn URL is required.' }, { status: 400 });
    }

    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would validate the URL and call a scraping service here.
    console.log(`Simulating scraping for: ${linkedinUrl}`);

    // Return the mocked data
    return NextResponse.json(mockLinkedInProfile);

  } catch (error: any) {
    console.error('Error in /api/scrape-linkedin:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.', error: error.message },
      { status: 500 }
    );
  }
}
