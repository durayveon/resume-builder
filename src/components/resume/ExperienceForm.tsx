import { Button } from '@/components/Button';
import { TextField, TextArea } from '@/components/Form';
import { Experience } from '@/types/resume';
import { Trash2, Plus } from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        responsibilities: [''],
        isCurrent: false,
      },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length <= 1) return;
    onChange(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof Omit<Experience, 'id'>,
    value: any
  ) => {
    onChange(
      experiences.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const updateResponsibilities = (id: string, responsibilities: string[]) => {
    updateExperience(id, 'responsibilities', responsibilities);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button variant="outline" className="text-sm" onClick={addExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Experience {index + 1}</h4>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  aria-label="Remove experience"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Company"
                value={exp.company}
                onChange={e =>
                  updateExperience(exp.id, 'company', e.target.value)
                }
                placeholder="Company name"
                required
              />
              <TextField
                label="Position"
                value={exp.position}
                onChange={e =>
                  updateExperience(exp.id, 'position', e.target.value)
                }
                placeholder="Job title"
                required
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <TextField
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={e =>
                      updateExperience(exp.id, 'startDate', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    disabled={exp.isCurrent}
                    onChange={e =>
                      updateExperience(exp.id, 'endDate', e.target.value)
                    }
                    required={!exp.isCurrent}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={e =>
                      updateExperience(exp.id, 'isCurrent', e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    I currently work here
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              {exp.responsibilities.map((resp, i) => (
                <div key={i} className="flex space-x-2">
                  <TextArea
                    value={resp}
                    onChange={e => {
                      const newResponsibilities = [...exp.responsibilities];
                      newResponsibilities[i] = e.target.value;
                      updateResponsibilities(exp.id, newResponsibilities);
                    }}
                    rows={2}
                    placeholder="Responsibility or achievement"
                    required
                  />
                  {i === exp.responsibilities.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newResponsibilities = [
                          ...exp.responsibilities,
                          '',
                        ];
                        updateResponsibilities(exp.id, newResponsibilities);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-start pt-2"
                      aria-label="Add responsibility"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
