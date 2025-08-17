'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/Button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Linkedin, Loader2, CheckCircle } from 'lucide-react';

type LinkedInProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  headline: string;
  summary: string;
  location: string;
  profilePicture: string;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear?: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    authority: string;
    licenseNumber?: string;
    startDate?: string;
    endDate?: string;
  }>;
};

type LinkedInImportProps = {
  onImportComplete: (profile: any) => void;
  onCancel?: () => void;
};

export function LinkedInImport({ onImportComplete, onCancel }: LinkedInImportProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<LinkedInProfile | null>(null);
  const [selectedItems, setSelectedItems] = useState({
    experiences: true,
    education: true,
    skills: true,
    certifications: true,
  });
  const [currentStep, setCurrentStep] = useState<'connect' | 'review' | 'complete'>('connect');

  const handleConnectLinkedIn = async () => {
    setIsLoading(true);
    try {
      // This would typically redirect to LinkedIn OAuth
      // For now, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate fetching LinkedIn data
      const mockLinkedInData: LinkedInProfile = {
        id: '123456789',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        headline: 'Senior Software Engineer at Tech Corp',
        summary: 'Experienced software engineer with a passion for building scalable applications...',
        location: 'San Francisco, California',
        profilePicture: '',
        experiences: [
          {
            id: 'exp1',
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            isCurrent: true,
            description: 'Leading a team of developers to build innovative solutions...',
          },
          {
            id: 'exp2',
            title: 'Software Engineer',
            company: 'Web Solutions Inc',
            startDate: '2017-06-01',
            endDate: '2019-12-31',
            isCurrent: false,
            description: 'Developed and maintained web applications using modern frameworks...',
          },
        ],
        education: [
          {
            id: 'edu1',
            school: 'Stanford University',
            degree: 'Master of Science',
            fieldOfStudy: 'Computer Science',
            startYear: '2015',
            endYear: '2017',
          },
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect',
            authority: 'Amazon Web Services',
            startDate: '2020-01-01',
          },
        ],
      };

      setImportedData(mockLinkedInData);
      setCurrentStep('review');
      
      toast({
        title: 'Success',
        description: 'Successfully connected to LinkedIn',
      });
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to LinkedIn. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (section: keyof typeof selectedItems) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleImportSelected = () => {
    if (!importedData) return;
    
    // Format the data to match our resume structure
    const formattedData = {
      personalInfo: {
        fullName: `${importedData.firstName} ${importedData.lastName}`,
        email: importedData.email,
        phone: importedData.phone || '',
        linkedIn: `https://www.linkedin.com/in/${importedData.id}`,
        portfolio: '',
      },
      summary: importedData.summary,
      experiences: selectedItems.experiences
        ? importedData.experiences.map(exp => ({
            id: exp.id,
            company: exp.company,
            position: exp.title,
            startDate: exp.startDate,
            endDate: exp.endDate || '',
            responsibilities: exp.description
              ? [exp.description]
              : [`Worked as ${exp.title} at ${exp.company}`],
            isCurrent: exp.isCurrent,
          }))
        : [],
      education: selectedItems.education
        ? importedData.education.map(edu => ({
            id: edu.id,
            degree: `${edu.degree} in ${edu.fieldOfStudy}`,
            institution: edu.school,
            fieldOfStudy: edu.fieldOfStudy,
            startYear: edu.startYear,
            endYear: edu.endYear || '',
          }))
        : [],
      skills: selectedItems.skills ? [...importedData.skills] : [],
      certifications: selectedItems.certifications
        ? importedData.certifications.map(cert => cert.name)
        : [],
    };

    onImportComplete(formattedData);
    setCurrentStep('complete');
    
    toast({
      title: 'Success',
      description: 'Profile data imported successfully',
    });
  };

  const renderConnectStep = () => (
    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
        <Linkedin className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Import from LinkedIn</h3>
      <p className="text-gray-600 mb-6">
        Connect your LinkedIn account to automatically import your work experience, education, and skills.
      </p>
      <Button
        onClick={handleConnectLinkedIn}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Linkedin className="mr-2 h-4 w-4" />
            Connect with LinkedIn
          </>
        )}
      </Button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 text-sm text-gray-600 hover:text-gray-900"
        >
          Or create resume manually
        </button>
      )}
    </div>
  );

  const renderReviewStep = () => {
    if (!importedData) return null;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Review Imported Data</h3>
          <p className="text-sm text-gray-600">
            Select the information you'd like to import to your resume.
          </p>
        </div>

        {/* Profile Summary */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h4 className="font-medium">Profile Summary</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {importedData.summary || 'No summary available'}
              </p>
            </div>
          </div>
        </div>

        {/* Experiences */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="import-experiences"
                checked={selectedItems.experiences}
                onChange={() => handleToggleSelect('experiences')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="import-experiences" className="ml-2 font-medium">
                Work Experience
              </label>
            </div>
            <span className="text-sm text-gray-500">
              {importedData.experiences.length} positions
            </span>
          </div>
          {selectedItems.experiences && (
            <div className="p-4 space-y-4">
              {importedData.experiences.map((exp) => (
                <div key={exp.id} className="pl-2 border-l-2 border-blue-200">
                  <div className="font-medium">{exp.title}</div>
                  <div className="text-sm text-gray-600">
                    {exp.company} • {exp.isCurrent ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`}
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="import-education"
                checked={selectedItems.education}
                onChange={() => handleToggleSelect('education')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="import-education" className="ml-2 font-medium">
                Education
              </label>
            </div>
            <span className="text-sm text-gray-500">
              {importedData.education.length} institutions
            </span>
          </div>
          {selectedItems.education && (
            <div className="p-4 space-y-3">
              {importedData.education.map((edu) => (
                <div key={edu.id} className="pl-2 border-l-2 border-blue-200">
                  <div className="font-medium">{edu.school}</div>
                  <div className="text-sm text-gray-600">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  <div className="text-sm text-gray-500">
                    {edu.startYear} - {edu.endYear || 'Present'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="import-skills"
                checked={selectedItems.skills}
                onChange={() => handleToggleSelect('skills')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="import-skills" className="ml-2 font-medium">
                Skills
              </label>
            </div>
            <span className="text-sm text-gray-500">
              {importedData.skills.length} skills
            </span>
          </div>
          {selectedItems.skills && (
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {importedData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {importedData.certifications.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="import-certifications"
                  checked={selectedItems.certifications}
                  onChange={() => handleToggleSelect('certifications')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="import-certifications" className="ml-2 font-medium">
                  Certifications
                </label>
              </div>
              <span className="text-sm text-gray-500">
                {importedData.certifications.length} certifications
              </span>
            </div>
            {selectedItems.certifications && (
              <div className="p-4 space-y-2">
                {importedData.certifications.map((cert, i) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-gray-600">{cert.authority}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('connect')}
          >
            Back
          </Button>
          <Button
            onClick={handleImportSelected}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                Import Selected
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="text-center p-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Import Complete!</h3>
      <p className="text-gray-600 mb-6">
        Your LinkedIn data has been successfully imported. You can now review and edit your resume.
      </p>
      <Button onClick={onCancel}>
        Continue to Resume Builder
      </Button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {currentStep === 'connect' && renderConnectStep()}
      {currentStep === 'review' && renderReviewStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
}
