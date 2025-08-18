'use client'

import React, { useState, useRef } from 'react'
import { SparklesIcon, DocumentArrowUpIcon, ArrowDownTrayIcon, PencilIcon, ChartBarIcon, BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import { AnalysisReport } from './AnalysisReport'
import { useSession } from 'next-auth/react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ResumeStudio() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({ name: '', linkedin: '', talents: '' })
  const [refinedFormData, setRefinedFormData] = useState<any>({ name: '', email: '', phone: '', linkedin: '', summary: '', experience: [], education: [], skills: '' })
  const [generatedResume, setGeneratedResume] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const resumePreviewRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRefinedFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRefinedFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperience = [...refinedFormData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setRefinedFormData((prev: any) => ({ ...prev, experience: updatedExperience }));
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...refinedFormData.education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setRefinedFormData((prev: any) => ({ ...prev, education: updatedEducation }));
  };

  const addExperience = () => {
    setRefinedFormData((prev: any) => ({
      ...prev,
      experience: [...prev.experience, { position: '', company: '', duration: '', responsibilities: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExperience = refinedFormData.experience.filter((_: any, i: number) => i !== index);
    setRefinedFormData((prev: any) => ({ ...prev, experience: updatedExperience }));
  };

  const addEducation = () => {
    setRefinedFormData((prev: any) => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    const updatedEducation = refinedFormData.education.filter((_: any, i: number) => i !== index);
    setRefinedFormData((prev: any) => ({ ...prev, education: updatedEducation }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File is too large. Please upload a file smaller than 2MB.');
        return;
      }
      if (!['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setError('Invalid file type. Please upload a TXT, PDF, or DOCX file.');
        return;
      }
      setUploadedFile(file);
      setError('');
    }
  };

  const handleUploadAndEnhance = async () => {
    if (!uploadedFile) {
      setError('Please select a file to upload first.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedResume('');

    try {
      // Note: FileReader is async. We need to wrap it in a Promise to use await properly.
      const getText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
      };

      const resumeText = await getText(uploadedFile);

      const response = await fetch('/api/enhance-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enhance resume.');
      }

      const result = await response.json();
      setGeneratedResume(result.resume);
      setUploadedFile(null); // Clear the file input after success

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLinkedInFetch = async () => {
    if (!formData.linkedin) {
      setError('Please provide a LinkedIn URL to fetch.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedResume('');

    try {
      // Step 1: Scrape LinkedIn profile
      const scrapeResponse = await fetch('/api/scrape-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: formData.linkedin }),
      });

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        throw new Error(errorData.message || 'Failed to fetch LinkedIn data.');
      }

      const profileData = await scrapeResponse.json();

      // Step 2: Generate resume with the scraped data
      const generateResponse = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.message || 'Failed to generate resume from LinkedIn data.');
      }

      const result = await generateResponse.json();
      setGeneratedResume(result.resume);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedResumes = async () => {
    if (!session) return;
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const resumes = await response.json();
        setSavedResumes(resumes);
      }
    } catch (error) {
      console.error('Error fetching saved resumes:', error);
    }
  };

  React.useEffect(() => {
    fetchSavedResumes();
  }, [session]);

  const handleSaveResume = async () => {
    setIsSaving(true);
    if (!generatedResume || !session) {
      alert('You must be signed in to save a resume.');
      return;
    }

    const title = window.prompt('Enter a title for your resume:', `Resume - ${new Date().toLocaleDateString()}`);
    if (!title) return;

    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          content: generatedResume,
        }),
      });

      if (!response.ok) throw new Error('Failed to save resume');
      
      const savedResume = await response.json();
      setSavedResumes([...savedResumes, savedResume]);
      alert('Resume saved successfully!');
      await fetchSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      setError('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resumePreviewRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null, // Use element's background
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete resume');
      
      await fetchSavedResumes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!generatedResume) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: generatedResume }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to generate resume.');
      }

      const result = await response.json();
      setGeneratedResume(result.resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resume/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refinedFormData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to refine resume.');
      }

      const result = await response.json();
      setGeneratedResume(result.resume);
      setIsRefining(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex justify-between items-center pb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resume Studio</h1>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            {isRefining ? (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Edit & Refine Your Resume</h2>
                <p className="mt-4 text-gray-600">The AI has created a first draft. Now, fine-tune the details to make it perfect.</p>
                <form onSubmit={handleRefineSubmit} className="mt-8 space-y-8">
                    {/* Personal Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                      <input type="text" name="name" value={refinedFormData.name} onChange={handleRefinedFormChange} placeholder="Full Name" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                      <input type="email" name="email" value={refinedFormData.email} onChange={handleRefinedFormChange} placeholder="Email" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                      <input type="tel" name="phone" value={refinedFormData.phone} onChange={handleRefinedFormChange} placeholder="Phone" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                      <input type="url" name="linkedin" value={refinedFormData.linkedin} onChange={handleRefinedFormChange} placeholder="LinkedIn URL" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                      <textarea name="summary" value={refinedFormData.summary} onChange={handleRefinedFormChange} rows={4} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>

                    {/* Experience */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      {refinedFormData.experience.map((exp: any, index: number) => (
                        <div key={index} className="space-y-2 rounded-md border border-gray-200 bg-white p-4">
                          <input type="text" name="position" value={exp.position} onChange={(e) => handleExperienceChange(index, e)} placeholder="Position" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                          <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} placeholder="Company" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                          <input type="text" name="duration" value={exp.duration} onChange={(e) => handleExperienceChange(index, e)} placeholder="Duration (e.g., 2020 - Present)" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                          <textarea name="responsibilities" value={exp.responsibilities} onChange={(e) => handleExperienceChange(index, e)} placeholder="Responsibilities & Achievements" rows={3} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"></textarea>
                          <button type="button" onClick={() => removeExperience(index)} className="text-sm text-red-600 hover:text-red-500">Remove</button>
                        </div>
                      ))}
                      <button type="button" onClick={addExperience} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">+ Add Experience</button>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                       {refinedFormData.education.map((edu: any, index: number) => (
                         <div key={index} className="space-y-2 rounded-md border border-gray-200 bg-white p-4">
                           <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Degree" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                           <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="Institution" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                           <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} placeholder="Year of Completion" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                           <button type="button" onClick={() => removeEducation(index)} className="text-sm text-red-600 hover:text-red-500">Remove</button>
                         </div>
                       ))}
                       <button type="button" onClick={addEducation} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">+ Add Education</button>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <textarea name="skills" value={refinedFormData.skills} onChange={handleRefinedFormChange} placeholder="Comma-separated skills (e.g., React, Node.js, Project Management)" rows={3} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>

                    <div className="mt-8">
                      <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                        {loading ? 'Updating...' : 'Update & Regenerate Resume'}
                      </button>
                    </div>
                  </form>
              </div>
            ) : (
                <div>
                  {/* Upload and Enhance Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Have a Resume Already?</h2>
                    <p className="mt-4 text-gray-600">Upload your existing resume, and our AI will analyze, reformat, and enhance it in seconds.</p>
                    <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <label htmlFor="resume-upload" className="mt-4 block text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        <span>Upload a file</span>
                        <input id="resume-upload" name="resume-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx" />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">{uploadedFile ? uploadedFile.name : 'TXT, DOCX, or PDF up to 2MB'}</p>
                      {uploadedFile && (
                        <button onClick={handleUploadAndEnhance} disabled={loading} className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                          {loading ? 'Enhancing...' : 'Enhance This Resume'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gray-50 px-2 text-sm text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Generate from Scratch Section */}
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create a New Resume</h2>
                    <p className="mt-4 text-gray-600">Just provide your name, LinkedIn (optional), and a brief on your talents. Our AI will craft a stunning, professional resume draft in seconds.</p>
                    <form onSubmit={handleSubmit} className="mt-8">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-700">Full Name</label>
                          <div className="mt-2">
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Jane Doe" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-700">LinkedIn Profile URL (Optional)</label>
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <input type="url" name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleInputChange} className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="https://linkedin.com/in/janedoe" />
                            <button type="button" onClick={handleLinkedInFetch} disabled={loading || !formData.linkedin} className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
                              <SparklesIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                              Fetch & Generate
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="talents" className="block text-sm font-medium leading-6 text-gray-700">Your Skills & Gifts</label>
                          <div className="mt-2">
                            <textarea name="talents" id="talents" rows={5} value={formData.talents} onChange={handleInputChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Describe your key skills, experiences, and what makes you unique. The more detail, the better the result!"></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8">
                        <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50">
                          {loading ? 'Generating...' : 'Generate AI Resume Now'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            )}
          </div>

          {/* Resume Preview Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resume Preview</h2>
              {generatedResume && (
                <div className="flex flex-wrap gap-2">
                  {session?.user?.email && (
                    <button onClick={handleSaveResume} disabled={isSaving} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                      <BookmarkIcon className="h-4 w-4 mr-1.5" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                  <button onClick={() => setIsRefining(true)} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <PencilIcon className="h-4 w-4 mr-1.5" />
                    Edit
                  </button>
                  <button onClick={handleAnalyze} disabled={loading} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                    <ChartBarIcon className="h-4 w-4 mr-1.5" />
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button onClick={handleDownloadPdf} disabled={isDownloading} className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              )}
            </div>
            <div className="relative mt-6 rounded-lg bg-white p-8 border border-gray-200" ref={resumePreviewRef} style={{ minHeight: '600px', backgroundColor: '#ffffff' }}>
              {generatedResume ? (
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedResume}</pre>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <p className="text-lg">Your resume will appear here</p>
                </div>
              )}
            </div>
            <AnalysisReport analysis={analysisResult} onClose={() => setAnalysisResult(null)} />
          </div>

        </div>

        {/* Saved Resumes Section */}
        {session?.user?.email && savedResumes.length > 0 && (
          <div className="mt-16 rounded-lg bg-gray-50 p-6 border border-gray-200">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Your Saved Resumes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedResumes.map((resume) => (
                <div key={resume.id} className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{resume.name || 'Untitled Resume'}</h3>
                    <button onClick={() => handleDeleteResume(resume.id)} className="text-red-600 hover:text-red-500">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{new Date(resume.createdAt).toLocaleDateString()}</p>
                  <div className="text-xs text-gray-600 line-clamp-3 mb-3">{resume.content.substring(0, 150)}...</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setGeneratedResume(resume.content);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}