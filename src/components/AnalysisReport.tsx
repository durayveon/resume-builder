'use client'

import { CheckCircleIcon, LightBulbIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ScoreCircle = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score > 80 ? 'text-green-400' : score > 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-slate-700"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className={`stroke-current ${scoreColor}`}
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${scoreColor}`}>
        {score}
      </div>
    </div>
  );
};

const FeedbackCard = ({ icon: Icon, title, feedback }: { icon: React.ElementType, title: string, feedback: string }) => (
  <div className="rounded-lg bg-slate-800/50 p-4 ring-1 ring-white/10">
    <div className="flex items-center">
      <Icon className="h-6 w-6 text-indigo-400" />
      <h3 className="ml-3 text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="mt-2 text-slate-300">{feedback}</p>
  </div>
);

export const AnalysisReport = ({ analysis, onClose }: { analysis: any, onClose: () => void }) => {
  if (!analysis) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm p-6 overflow-auto animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white">AI Resume Analysis</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <div className="my-6 flex flex-col items-center justify-center text-center">
          <ScoreCircle score={analysis.overallScore} />
          <p className="mt-4 text-lg font-semibold text-white">Overall Score</p>
        </div>

        <div className="space-y-4">
          <FeedbackCard icon={DocumentTextIcon} title="Summary Feedback" feedback={analysis.summaryFeedback} />
          <FeedbackCard icon={PencilIcon} title="Action Verbs" feedback={analysis.actionVerbsFeedback} />
          <FeedbackCard icon={CheckCircleIcon} title="Quantification" feedback={analysis.quantificationFeedback} />
          <FeedbackCard icon={LightBulbIcon} title="Formatting & Clarity" feedback={analysis.formattingFeedback} />
        </div>

        <div className="mt-6 rounded-lg bg-indigo-900/20 p-4 ring-1 ring-indigo-500/30">
          <h3 className="font-semibold text-indigo-300">Final Verdict</h3>
          <p className="mt-2 text-slate-300">{analysis.finalVerdict}</p>
        </div>
        
        <div className="mt-6 text-center">
          <button onClick={onClose} className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-500">Close Analysis</button>
        </div>
      </div>
    </div>
  );
};
