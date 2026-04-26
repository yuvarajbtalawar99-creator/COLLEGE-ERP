import React from 'react';
import { Check, Lock } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, getStepState }) => {
    return (
        <div className="w-full py-4 overflow-x-auto">
            <div className="flex items-center justify-between relative min-w-[500px] md:min-w-full md:max-w-3xl mx-auto px-4">
                {/* Background line */}
                <div className="absolute left-4 right-4 top-[18px] h-0.5 bg-slate-200 z-0">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-primary-600 transition-all duration-700 ease-out"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const stepIndex = index + 1;
                    const state = getStepState
                        ? getStepState(stepIndex)
                        : (stepIndex < currentStep ? 'COMPLETED' : stepIndex === currentStep ? 'IN_PROGRESS' : 'NOT_STARTED');

                    const isCompleted = state === 'COMPLETED';
                    const isActive = state === 'IN_PROGRESS';
                    const isLocked = state === 'NOT_STARTED';

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center flex-shrink-0">
                            <div
                                className={`
                                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 text-sm font-semibold border-2
                                    ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                                        : isActive
                                            ? 'bg-primary-600 border-primary-600 text-white ring-4 ring-primary-100 shadow-lg shadow-primary-600/25 step-pulse'
                                            : 'bg-white border-slate-200 text-slate-300'}
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={3} />
                                ) : isLocked ? (
                                    <Lock size={12} />
                                ) : (
                                    stepIndex
                                )}
                            </div>

                            <div className="absolute top-12 flex flex-col items-center whitespace-nowrap">
                                <span className={`text-[10px] font-semibold transition-colors duration-300 ${
                                    isCompleted ? 'text-green-600' :
                                    isActive ? 'text-primary-700' :
                                    'text-slate-400'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
