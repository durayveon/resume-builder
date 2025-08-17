import { useState } from 'react';
import { Button } from '@/components/Button';
import { X, Plus } from 'lucide-react';

interface CertificationsFormProps {
  certifications: string[];
  onChange: (certifications: string[]) => void;
}

export function CertificationsForm({ certifications, onChange }: CertificationsFormProps) {
  const [newCert, setNewCert] = useState('');

  const addCertification = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      onChange([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Certifications</h3>
        <p className="text-sm text-gray-600 mb-4">
          List your professional certifications and the year obtained (if applicable).
        </p>
      </div>

      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2">
                <span className="flex-1">{cert || 'Certification name'}</span>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Remove certification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., AWS Certified Solutions Architect (2023)"
          className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <Button
          type="button"
          onClick={addCertification}
          disabled={!newCert.trim()}
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}
