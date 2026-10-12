import React, { useState, useEffect } from 'react';
import { Check, Loader2, Sparkles, Scan, Search, BrainCircuit } from 'lucide-react';

const ANALYSIS_STEPS = [
  { id: 1, title: 'Image uploaded & preprocessed', detail: 'Normalizing resolution, color balance and dimensions' },
  { id: 2, title: 'Detecting object & contours', detail: 'Isolating focal object from campus background' },
  { id: 3, title: 'Identifying category & attributes', detail: 'Classifying category taxonomy, brand marks and color' },
  { id: 4, title: 'Extracting visual features', detail: 'Generating 512-dimension visual embedding vector' },
  { id: 5, title: 'Comparing with found items', detail: 'Computing cosine similarity against active campus database' },
  { id: 6, title: 'Ranking possible matches', detail: 'Weighting proximity, date of loss, and color likeness' },
];

const AIAnalysisLoader = ({ onComplete, durationMs = 2800 }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepDuration = durationMs / ANALYSIS_STEPS.length;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-soft max-w-lg mx-auto text-center">
      {/* Visual pulse icon */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 mb-6 text-blue-600">
        <BrainCircuit className="w-10 h-10 animate-pulse text-blue-600" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Analyzing your item...
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
        Running visual similarity extraction and comparing with campus custody records.
      </p>

      {/* Progress Bar */}
      <div className="mt-6 mb-8">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
          <span>Simulation Progress</span>
          <span className="text-blue-600 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step checklist */}
      <div className="space-y-3 text-left bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                idx > currentStepIndex ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-700' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </p>
                {isCurrent && (
                  <p className="text-[11px] text-slate-500 mt-0.5 animate-fadeIn">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIAnalysisLoader;
