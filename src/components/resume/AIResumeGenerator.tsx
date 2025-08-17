'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ResumeData, TabType } from '@/types/resume';
import { ResumeTabs } from './ResumeTabs';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/Form';

export function AIResumeGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('personal');
  const [jobDescription, setJobDescription] = useState('');
  const [showGenerator, setShowGenerator] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedIn: '',
      portfolio: ''
    },
    summary: '',
    experiences: [{
      id: '1',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
      isCurrent: false
    }],
    education: [{
      id: '1',
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: ''
    }],
    skills: [''],
    certifications: ['']
  });

  const handleGenerateWithAI = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a job description to generate a resume',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          existingResume: resumeData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate resume');
      }
      
      const data = await response.json();
      setResumeData(data);
      setShowGenerator(false);
      setCurrentTab('preview');
      
      toast({
        title: 'Success',
        description: 'Resume generated successfully!',
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateResumeData = (updates: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSaveResume = async () => {
    try {
      // TODO: Implement save functionality
      // This could save to a database, local storage, or trigger a download
      console.log('Saving resume:', resumeData);
      
      toast({
        title: 'Success',
        description: 'Resume saved successfully!',
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to save resume. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      {showGenerator ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Generate Resume with AI</h2>
          <p className="text-gray-600">
            Enter the job description and we'll help you create a tailored resume
          </p>
          
          <div className="space-y-4">
            <TextArea
              label="Paste the job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the job description here to generate a tailored resume..."
              required
            />
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !jobDescription.trim()}
                className="w-full sm:w-auto"
              >
                {isGenerating ? 'Generating...' : 'Generate Resume with AI'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setShowGenerator(false);
                  setCurrentTab('personal');
                }}
                className="w-full sm:w-auto"
              >
                Start with Blank Template
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Resume</h2>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowGenerator(true)}
              >
                Back to Generator
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Set test resume data
                  setResumeData({
                    personalInfo: {
                      fullName: 'John Doe',
                      email: 'john.doe@example.com',
                      phone: '+1 (555) 123-4567',
                      linkedIn: 'linkedin.com/in/johndoe',
                      portfolio: 'johndoe.dev'
                    },
                    summary: 'Senior Software Engineer with 5+ years of experience building scalable web applications using React and Node.js.',
                    experiences: [{
                      id: '1',
                      company: 'TechCorp',
                      position: 'Senior Software Engineer',
                      startDate: '2020-01',
                      endDate: '2023-12',
                      isCurrent: false,
                      responsibilities: [
                        'Led a team of 5 developers to build a React-based dashboard',
                        'Optimized application performance, reducing load times by 40%',
                        'Implemented CI/CD pipelines using GitHub Actions'
                      ]
                    }],
                    education: [{
                      id: '1',
                      degree: 'B.S. Computer Science',
                      institution: 'State University',
                      fieldOfStudy: 'Computer Science',
                      startYear: '2016',
                      endYear: '2020'
                    }],
                    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
                    certifications: ['AWS Certified Developer', 'Google Cloud Professional']
                  });
                  setCurrentTab('preview');
                }}
              >
                Load Test Resume
              </Button>
              <Button variant="outline" onClick={() => setShowGenerator(true)}>
                Regenerate with AI
              </Button>
              <Button onClick={handleSaveResume}>
                Save Resume
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <ResumeTabs
              resumeData={resumeData}
              onUpdate={updateResumeData}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
          </div>
        </div>
      )}
    </div>
  );
}
