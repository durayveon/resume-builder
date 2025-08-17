import { useState } from 'react';
import { Button } from '@/components/Button';
import { X } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add your skills. These will be displayed as tags on your resume.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          skill && (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-2 text-gray-500 hover:text-red-500"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill and press Enter"
          className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="whitespace-nowrap"
        >
          Add Skill
        </Button>
      </div>
    </div>
  );
}
