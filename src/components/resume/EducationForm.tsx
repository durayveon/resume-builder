import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Form';
import { Education } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        id: Date.now().toString(),
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    if (education.length <= 1) return;
    onChange(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Omit<Education, 'id'>, value: string) => {
    onChange(
      education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button variant="outline" className="text-sm" onClick={addEducation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Education {index + 1}</h4>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  aria-label="Remove education"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, 'degree', e.target.value)
                }
                placeholder="e.g., Bachelor of Science"
                required
              />
              <TextField
                label="Institution"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, 'institution', e.target.value)
                }
                placeholder="University name"
                required
              />
              <TextField
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  updateEducation(edu.id, 'fieldOfStudy', e.target.value)
                }
                placeholder="e.g., Computer Science"
                required
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <TextField
                    label="Start Year"
                    type="number"
                    value={edu.startYear}
                    onChange={(e) =>
                      updateEducation(edu.id, 'startYear', e.target.value)
                    }
                    placeholder="YYYY"
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="End Year (or expected)"
                    type="number"
                    value={edu.endYear}
                    onChange={(e) =>
                      updateEducation(edu.id, 'endYear', e.target.value)
                    }
                    placeholder="YYYY"
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
