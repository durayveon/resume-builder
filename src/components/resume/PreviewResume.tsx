import { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { generatePdf } from '@/lib/pdf/generatePdf';
import { toast } from '@/components/ui/use-toast';

interface PreviewResumeProps {
  data: ResumeData;
}

export function PreviewResume({ data }: PreviewResumeProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      // Generate the PDF
      const pdfBlob = await generatePdf(data);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.fullName || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Resume downloaded successfully!',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resume Preview</h3>
        <Button onClick={handleDownload} disabled={isGeneratingPdf}>
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </>
          )}
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-gray-600">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.linkedIn && (
              <span>• <a href={data.personalInfo.linkedIn} className="text-blue-600 hover:underline">LinkedIn</a></span>
            )}
            {data.personalInfo.portfolio && (
              <span>• <a href={data.personalInfo.portfolio} className="text-blue-600 hover:underline">Portfolio</a></span>
            )}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Summary</h2>
            <p className="whitespace-pre-line">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experiences.some(exp => exp.company || exp.position) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Experience</h2>
            <div className="space-y-6">
              {data.experiences.map((exp, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{exp.position || 'Position'}</h3>
                    <div className="text-gray-600">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="text-gray-600">{exp.company}</div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      {exp.responsibilities
                        .filter(resp => resp.trim() !== '')
                        .map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{edu.degree || 'Degree'}</h3>
                    <div className="text-gray-600">
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </div>
                  </div>
                  <div className="text-gray-600">
                    {edu.institution}
                    {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.some(skill => skill.trim() !== '') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills
                .filter(skill => skill.trim() !== '')
                .map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.some(cert => cert.trim() !== '') && (
          <div>
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Certifications</h2>
            <ul className="list-disc pl-5 space-y-1">
              {data.certifications
                .filter(cert => cert.trim() !== '')
                .map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
