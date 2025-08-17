'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';

type AnalysisResult = {
  score: number;
  strengths: string[];
  improvements: Array<{
    section: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  atsCompatibility: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
};

type ResumeAnalysisProps = {
  resumeData: any;
  jobDescription?: string;
  onAnalysisComplete?: (result: AnalysisResult) => void;
};

export function ResumeAnalysis({
  resumeData,
  jobDescription = '',
  onAnalysisComplete,
}: ResumeAnalysisProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(
    null
  );

  const analyzeResume = async () => {
    if (!resumeData) {
      toast({
        title: 'Error',
        description: 'No resume data to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze resume');

      const data = await response.json();
      setResult(data);
      onAnalysisComplete?.(data);

      toast({
        title: 'Analysis Complete',
        description: `Your resume scored ${data.score}/100`,
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = () => {
    // This would be implemented to update the resume data
    toast({
      title: 'Suggestion Applied',
      description: 'The suggestion has been applied to your resume.',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!result) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Resume Analysis</h3>
        <p className="text-gray-600 mb-4">
          Get detailed feedback on your resume and improve your chances of
          getting noticed by recruiters.
        </p>
        <Button onClick={analyzeResume} disabled={isAnalyzing} className="mt-2">
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Resume Analysis</h3>
          <p className="text-sm text-gray-600">
            Based on industry standards and job description matching
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <span className="text-2xl font-bold">{result.score}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Compatibility */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium mb-3 flex items-center">
          <span className="mr-2">ATS Compatibility</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${result.atsCompatibility.score > 70 ? 'bg-green-100 text-green-800' : result.atsCompatibility.score > 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
          >
            {result.atsCompatibility.score}%
          </span>
        </h4>

        {result.atsCompatibility.issues.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Potential Issues:
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {result.atsCompatibility.issues.map((issue, i) => (
                <li key={i} className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.atsCompatibility.suggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Suggestions:
            </p>
            <ul className="space-y-2">
              {result.atsCompatibility.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start">
                  <ArrowUpRight className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Keyword Matching */}
      {jobDescription && result.keywordMatch && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Keyword Match</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">
                Matched Keywords
              </p>
              <div className="flex flex-wrap gap-1">
                {result.keywordMatch.matched.length > 0 ? (
                  result.keywordMatch.matched.map((keyword, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No keywords matched</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-red-700 mb-2">
                Missing Keywords
              </p>
              <div className="flex flex-wrap gap-1">
                {result.keywordMatch.missing.length > 0 ? (
                  result.keywordMatch.missing.map((keyword, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    All important keywords matched!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      <div className="space-y-4">
        <h4 className="font-medium">Improvement Suggestions</h4>

        <div className="space-y-3">
          {result.improvements.map((improvement, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${selectedSuggestion === i ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedSuggestion(i)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${getPriorityColor(improvement.priority)}`}
                    >
                      {improvement.priority.charAt(0).toUpperCase() +
                        improvement.priority.slice(1)}{' '}
                      Priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {improvement.section}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{improvement.message}</p>
                  {selectedSuggestion === i && (
                    <div className="mt-2 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        Suggestion:
                      </p>
                      <p className="text-sm text-gray-700">
                        {improvement.suggestion}
                      </p>
                      <Button
                        className="mt-2 text-sm px-3 py-1"
                        onClick={e => {
                          e.stopPropagation();
                          applySuggestion();
                        }}
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  )}
                </div>
                <button
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedSuggestion(selectedSuggestion === i ? null : i);
                  }}
                >
                  {selectedSuggestion === i ? '▲' : '▼'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Your Resume's Strengths
          </h4>
          <ul className="space-y-1">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-green-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setResult(null)}
          className="mt-2"
        >
          Back to Editor
        </Button>
      </div>
    </div>
  );
}
