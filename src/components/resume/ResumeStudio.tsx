'use client';

import { useState } from 'react';
import { useResumeStorage } from '@/contexts/ResumeStorageContext';
import { AIResumeGenerator } from './AIResumeGenerator';
import { ResumeAnalysis } from './ResumeAnalysis';
import { LinkedInImport } from './LinkedInImport';
import { Button } from '@/components/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart2, Upload, Download, Save, Plus, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ViewMode = 'editor' | 'preview' | 'analysis';

export function ResumeStudio() {
  const { toast } = useToast();
  const { currentResume, saveResume, createNewResume } = useResumeStorage();
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [jobDescription, setJobDescription] = useState('');
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);

  const handleSaveResume = async () => {
    if (!resumeData) return;
    
    setIsSaving(true);
    try {
      await saveResume(
        resumeData,
        `Resume ${new Date().toLocaleDateString()}`
      );
      
      toast({
        title: 'Success',
        description: 'Resume saved successfully',
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to save resume',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    toast({
      title: 'Export to PDF',
      description: 'This feature is coming soon!',
    });
  };

  const handleNewResume = () => {
    createNewResume();
    setResumeData(null);
    setViewMode('editor');
  };

  const handleLinkedInImportComplete = (data: any) => {
    setResumeData(data);
    setShowLinkedInImport(false);
    setViewMode('editor');
  };

  if (showLinkedInImport) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => setShowLinkedInImport(false)}
          className="mb-4"
        >
          ← Back to editor
        </Button>
        <LinkedInImport onImportComplete={handleLinkedInImportComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resume Studio</h2>
          <p className="text-sm text-gray-500">
            Create and optimize your professional resume
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleNewResume}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowLinkedInImport(true)}
            className="flex items-center gap-1"
          >
            <Linkedin className="h-4 w-4 text-[#0077B5]" />
            <span>Import from LinkedIn</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          
          <Button
            onClick={handleSaveResume}
            disabled={isSaving || !resumeData}
            className="flex items-center gap-1"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-1">↻</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as ViewMode)}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-1"
              disabled={!resumeData}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
          </TabsList>
          
          {viewMode === 'editor' && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste job description for AI enhancement"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="text-sm px-3 py-1.5 border rounded-md w-64"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={!jobDescription.trim()}
              >
                Enhance with AI
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="editor" className="mt-0">
          <div className="bg-white rounded-lg border p-6">
            <AIResumeGenerator 
              initialData={resumeData}
              jobDescription={jobDescription}
              onChange={setResumeData}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="bg-white rounded-lg border p-8 max-w-3xl mx-auto">
            {resumeData ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">
                    {resumeData.personalInfo?.fullName || 'Your Name'}
                  </h1>
                  <p className="text-gray-600">
                    {resumeData.personalInfo?.email}
                    {resumeData.personalInfo?.phone && ` • ${resumeData.personalInfo.phone}`}
                  </p>
                  {resumeData.personalInfo?.linkedIn && (
                    <p className="text-blue-600 text-sm">
                      {resumeData.personalInfo.linkedIn}
                    </p>
                  )}
                </div>

                {resumeData.summary && (
                  <div>
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                      Professional Summary
                    </h2>
                    <p className="whitespace-pre-line">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experiences?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                      Work Experience
                    </h2>
                    {resumeData.experiences.map((exp: any, i: number) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {exp.company || 'Company Name'}
                          </h3>
                          <p className="text-gray-600">
                            {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                          </p>
                        </div>
                        <p className="text-gray-700 font-medium">
                          {exp.position || 'Job Title'}
                        </p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {exp.responsibilities?.map((resp: string, j: number) => (
                            <li key={j}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                      Education
                    </h2>
                    {resumeData.education.map((edu: any, i: number) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {edu.institution || 'Institution Name'}
                          </h3>
                          <p className="text-gray-600">
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        </div>
                        <p className="text-gray-700">
                          {edu.degree || 'Degree'}
                          {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.certifications?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                      Certifications
                    </h2>
                    <ul className="list-disc pl-5">
                      {resumeData.certifications.map((cert: string, i: number) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No resume data available. Start by creating a new resume.
                </p>
                <Button onClick={handleNewResume} className="mt-4">
                  Create New Resume
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <div className="bg-white rounded-lg border p-6">
            {resumeData ? (
              <ResumeAnalysis 
                resumeData={resumeData} 
                jobDescription={jobDescription}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No resume data available for analysis. Please create a resume first.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
