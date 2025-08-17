export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  isCurrent: boolean;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
};

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  portfolio: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
};

export type ExperienceField = keyof Omit<Experience, 'id'>;
export type EducationField = keyof Omit<Education, 'id'>;

export type FormField = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => string | undefined;
};

export type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'certifications' | 'preview';

export const formTabs: { id: TabType; label: string }[] = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'preview', label: 'Preview' },
];
