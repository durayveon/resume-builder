'use client';

import { ResumeStudio } from '@/components/resume/ResumeStudio';
import { ResumeStorageProvider } from '@/contexts/ResumeStorageContext';

export default function ResumeBuilderPage() {
  return (
    <ResumeStorageProvider>
      <div className="min-h-screen bg-gray-50">
        <ResumeStudio />
      </div>
    </ResumeStorageProvider>
  );
}
