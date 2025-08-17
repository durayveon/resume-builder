'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { CertificationsForm } from './CertificationsForm';
import { PreviewResume } from './PreviewResume';
import { ResumeData, formTabs, TabType } from '@/types/resume';

interface ResumeTabsProps {
  resumeData: ResumeData;
  onUpdate: (updates: Partial<ResumeData>) => void;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ResumeTabs({
  resumeData,
  onUpdate,
  currentTab,
  onTabChange,
}: ResumeTabsProps) {
  return (
    <Tabs 
      value={currentTab} 
      onValueChange={(value) => onTabChange(value as TabType)} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-6 mb-6">
        {formTabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="capitalize">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfoForm
          data={resumeData.personalInfo}
          onChange={(data: any) => onUpdate({ personalInfo: data })}
        />
      </TabsContent>

      <TabsContent value="experience">
        <ExperienceForm
          experiences={resumeData.experiences}
          onChange={(experiences: any) => onUpdate({ experiences })}
        />
      </TabsContent>

      <TabsContent value="education">
        <EducationForm
          education={resumeData.education}
          onChange={(education: any) => onUpdate({ education })}
        />
      </TabsContent>

      <TabsContent value="skills">
        <SkillsForm
          skills={resumeData.skills}
          onChange={(skills: string[]) => onUpdate({ skills })}
        />
      </TabsContent>

      <TabsContent value="certifications">
        <CertificationsForm
          certifications={resumeData.certifications}
          onChange={(certifications: string[]) => onUpdate({ certifications })}
        />
      </TabsContent>

      <TabsContent value="preview">
        <PreviewResume data={resumeData} />
      </TabsContent>
    </Tabs>
  );
}
