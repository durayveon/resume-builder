import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-lg bg-slate-800 p-4 shadow-md">
      <div className="flex items-center">
        <div className="rounded-md bg-slate-700 p-2">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};
