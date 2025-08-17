'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

type Resume = {
  id: string;
  title: string;
  data: any; // The actual resume data
  createdAt: string;
  updatedAt: string;
  isCurrent?: boolean;
};

type ResumeStorageContextType = {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  saveResume: (resumeData: any, title?: string, id?: string) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  setCurrentResume: (id: string | null) => void;
  createNewResume: () => Resume;
};

const ResumeStorageContext = createContext<ResumeStorageContextType | undefined>(
  undefined
);

export function ResumeStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResumeState] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Load saved resumes from localStorage or API
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setIsLoading(true);
        
        if (status === 'authenticated') {
          // TODO: Fetch from API when backend is ready
          // const response = await fetch('/api/resumes');
          // const data = await response.json();
          // setResumes(data);
        } else {
          // Fallback to localStorage for unauthenticated users
          const savedResumes = localStorage.getItem('resumes');
          if (savedResumes) {
            setResumes(JSON.parse(savedResumes));
          }
        }
      } catch (err) {
        console.error('Error loading resumes:', err);
        setError('Failed to load saved resumes');
      } finally {
        setIsLoading(false);
      }
    };

    loadResumes();
  }, [status]);

  // Save resumes to localStorage whenever they change
  useEffect(() => {
    if (status !== 'authenticated') {
      localStorage.setItem('resumes', JSON.stringify(resumes));
    }
  }, [resumes, status]);

  const saveResume = async (
    resumeData: any,
    title = 'Untitled Resume',
    id?: string
  ): Promise<Resume> => {
    try {
      const now = new Date().toISOString();
      let updatedResumes: Resume[] = [];
      let savedResume: Resume;

      if (id) {
        // Update existing resume
        updatedResumes = resumes.map((resume) =>
          resume.id === id
            ? {
                ...resume,
                title,
                data: resumeData,
                updatedAt: now,
              }
            : resume
        );
        savedResume = updatedResumes.find((r) => r.id === id)!;
      } else {
        // Create new resume
        const newResume: Resume = {
          id: uuidv4(),
          title,
          data: resumeData,
          createdAt: now,
          updatedAt: now,
        };
        updatedResumes = [newResume, ...resumes];
        savedResume = newResume;
      }

      setResumes(updatedResumes);

      if (status === 'authenticated') {
        // TODO: Save to API when backend is ready
        // await fetch('/api/resumes', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(savedResume),
        // });
      }

      return savedResume;
    } catch (err) {
      console.error('Error saving resume:', err);
      throw new Error('Failed to save resume');
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const updatedResumes = resumes.filter((resume) => resume.id !== id);
      setResumes(updatedResumes);

      if (currentResume?.id === id) {
        setCurrentResumeState(null);
      }

      if (status === 'authenticated') {
        // TODO: Delete from API when backend is ready
        // await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      throw new Error('Failed to delete resume');
    }
  };

  const setCurrentResume = (id: string | null) => {
    if (!id) {
      setCurrentResumeState(null);
      return;
    }

    const resume = resumes.find((r) => r.id === id);
    if (resume) {
      setCurrentResumeState(resume);
    }
  };

  const createNewResume = (): Resume => {
    const newResume: Resume = {
      id: uuidv4(),
      title: 'Untitled Resume',
      data: {
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          linkedIn: '',
          portfolio: '',
        },
        summary: '',
        experiences: [
          {
            id: '1',
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            responsibilities: [''],
            isCurrent: false,
          },
        ],
        education: [
          {
            id: '1',
            degree: '',
            institution: '',
            fieldOfStudy: '',
            startYear: '',
            endYear: '',
          },
        ],
        skills: [''],
        certifications: [''],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResumes([newResume, ...resumes]);
    setCurrentResumeState(newResume);
    return newResume;
  };

  return (
    <ResumeStorageContext.Provider
      value={{
        resumes,
        currentResume,
        isLoading,
        error,
        saveResume,
        deleteResume,
        setCurrentResume,
        createNewResume,
      }}
    >
      {children}
    </ResumeStorageContext.Provider>
  );
}

export function useResumeStorage() {
  const context = useContext(ResumeStorageContext);
  if (context === undefined) {
    throw new Error(
      'useResumeStorage must be used within a ResumeStorageProvider'
    );
  }
  return context;
}
