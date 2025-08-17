'use client';

import { ResumeStudio } from '@/components/resume/ResumeStudio';
import { ResumeProvider } from '@/contexts/ResumeStorageContext';

export default function ResumeBuilderPage() {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-gray-50">
        <ResumeStudio />
      </div>
    </ResumeProvider>
  );
}
