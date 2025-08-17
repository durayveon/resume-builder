'use client';

import { FeatureShowcase } from '@/components/ui/FeatureShowcase';

const features = [
  {
    id: 'resume-builder',
    title: 'AI-Powered Resume Builder',
    description: 'Create professional, ATS-optimized resumes in minutes with our intelligent resume builder.',
    image: '/features/resume-builder.jpg',
  },
  {
    id: 'job-matching',
    title: 'Smart Job Matching',
    description: 'Get matched with the best job opportunities based on your skills and preferences.',
    image: '/features/job-matching.jpg',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Practice with AI-powered mock interviews and get detailed feedback on your performance.',
    image: '/features/interview-prep.jpg',
  },
  {
    id: 'career-coaching',
    title: 'Personalized Career Coaching',
    description: 'Get expert guidance and personalized advice to advance your career.',
    image: '/features/career-coaching.jpg',
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Amazing Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover how our platform can help you land your dream job with powerful tools and resources.
        </p>
      </div>
      
      <FeatureShowcase 
        features={features} 
        className="max-w-6xl mx-auto"
      />
      
      <div className="mt-16 text-center text-gray-600">
        <p>Click on any feature to learn more, or let the showcase auto-play.</p>
        <p className="mt-2 text-sm text-gray-500">
          Hover over the showcase to pause the auto-scroll.
        </p>
      </div>
    </div>
  );
}
