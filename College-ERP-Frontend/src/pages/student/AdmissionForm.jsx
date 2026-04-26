import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HelpCircle, 
    ExternalLink, 
    ChevronLeft, 
    Loader2, 
    GraduationCap, 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StepIndicator from '../../components/StepIndicator';
import useApplicationStatus from '../../hooks/useApplicationStatus';
import Step1Admission from './form-steps/Step1Admission';
import Step2Personal from './form-steps/Step2Personal';
import Step3Parent from './form-steps/Step3Parent';
import Step4Address from './form-steps/Step4Address';
import Step5Academic from './form-steps/Step5Academic';
import Step6Documents from './form-steps/Step6Documents';
import Step7Review from './form-steps/Step7Review';
import SubmittedView from './components/SubmittedView';

const STEPS = [
    { id: 1, label: 'Admission' },
    { id: 2, label: 'Personal' },
    { id: 3, label: 'Parent' },
    { id: 4, label: 'Address' },
    { id: 5, label: 'Academic' },
    { id: 6, label: 'Documents' },
    { id: 7, label: 'Review' },
];

const AdmissionForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [formLoading, setFormLoading] = useState(true);
    const [stepTransition, setStepTransition] = useState(false);
    const [fullDetails, setFullDetails] = useState(null);
    const [submittedDetailsLoading, setSubmittedDetailsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        stepStatus,
        loading: statusLoading,
        getStepState,
        isStepAccessible,
        refetch: refetchStatus,
    } = useApplicationStatus();

    // Fetch existing form data and full details if submitted
    useEffect(() => {
        const fetchData = async () => {
            try {
                // If application is already submitted, fetch everything for the dashboard
                if (stepStatus?.applicationStatus && stepStatus.applicationStatus !== 'REGISTERED') {
                    setSubmittedDetailsLoading(true);
                    const detailRes = await api.get('/application/full-details');
                    if (detailRes.data.success) {
                        setFullDetails(detailRes.data.data);
                    }
                }

                const res = await api.get('/student/my-admission');
                if (res.data.success && res.data.data) {
                    const student = res.data.data;
                    const flattenedData = {
                        ...student,
                        ...student.studentpersonaldetails,
                        ...student.studentparentdetails,
                        ...student.studentaddress,
                        ...student.studentacademicdetails,
                        ...student.studentdocuments
                    };
                    
                    if (flattenedData.dateOfBirth) {
                        try {
                            const dateObj = new Date(flattenedData.dateOfBirth);
                            if (!isNaN(dateObj.getTime())) {
                                const d = String(dateObj.getDate()).padStart(2, '0');
                                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const y = dateObj.getFullYear();
                                flattenedData.dateOfBirth = `${d}/${m}/${y}`;
                            }
                        } catch (e) {}
                    }

                    const draft = localStorage.getItem('admission_form_draft');
                    if (draft) {
                        const parsedDraft = JSON.parse(draft);
                        setFormData({ ...flattenedData, ...parsedDraft });
                    } else {
                        setFormData(flattenedData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch admission data:", error);
                if (stepStatus?.applicationStatus && stepStatus.applicationStatus !== 'REGISTERED') {
                    toast.error('Unable to load submitted application details. Please refresh.');
                }
            } finally {
                setSubmittedDetailsLoading(false);
                setFormLoading(false);
            }
        };

        if (!statusLoading) {
            fetchData();
        }
    }, [statusLoading, stepStatus?.applicationStatus]);

    // Set initial step based on status or saved step
    useEffect(() => {
        const isEditable = !statusLoading && stepStatus && 
            (stepStatus.applicationStatus === 'REGISTERED' || stepStatus.applicationStatus === 'REJECTED');

        if (isEditable) {
            const savedStep = localStorage.getItem('admission_form_step');
            if (savedStep && parseInt(savedStep) >= 1) {
                const target = parseInt(savedStep);
                if (isStepAccessible(target)) {
                    setCurrentStep(target);
                } else {
                    setCurrentStep(stepStatus.activeStepIndex || 1);
                }
            } else if (formData.id) {
                setCurrentStep(stepStatus.activeStepIndex || 2);
            }
        }
    }, [statusLoading, stepStatus, formData.id, isStepAccessible]);

    // Save draft to localStorage 
    useEffect(() => {
        const isEditable = !formLoading && stepStatus && 
            (stepStatus.applicationStatus === 'REGISTERED' || stepStatus.applicationStatus === 'REJECTED');

        if (isEditable) {
            localStorage.setItem('admission_form_draft', JSON.stringify(formData));
            localStorage.setItem('admission_form_step', currentStep.toString());
        }
    }, [formData, currentStep, formLoading, stepStatus]);

    const handleNext = async () => {
        setStepTransition(true);
        await refetchStatus();
        setTimeout(() => {
            if (currentStep < 7) {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setStepTransition(false);
        }, 300);
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setStepTransition(true);
            setTimeout(() => {
                const prevStep = currentStep - 1;
                setCurrentStep(prevStep);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setStepTransition(false);
            }, 200);
        }
    };

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get('/application/download-pdf', {
                responseType: 'blob',
                timeout: 60000,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Admission_Acknowledgment_${stepStatus.studentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error(error.code === 'ECONNABORTED' ? "PDF generation is taking longer than expected. Please try again." : "Failed to download PDF acknowledgment.");
        }
    };

    const renderStep = () => {
        const stepProps = {
            onNext: handleNext,
            onPrev: handlePrev,
            data: formData,
            updateData: updateFormData,
        };

        switch (currentStep) {
            case 1: return <Step1Admission {...stepProps} />;
            case 2: return <Step2Personal {...stepProps} />;
            case 3: return <Step3Parent {...stepProps} />;
            case 4: return <Step4Address {...stepProps} />;
            case 5: return <Step5Academic {...stepProps} />;
            case 6: return <Step6Documents onNext={handleNext} onPrev={handlePrev} data={formData} />;
            case 7: return <Step7Review data={formData} onPrev={handlePrev} />;
            default: return null;
        }
    };

    const applicationStatus = stepStatus?.applicationStatus;
    const isSubmitted = applicationStatus && 
        applicationStatus !== 'REGISTERED' && 
        applicationStatus !== 'REJECTED';

    if (statusLoading || submittedDetailsLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in bg-slate-50">
                <div className="relative">
                    <div className="size-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                    <GraduationCap className="absolute inset-0 m-auto text-primary-600" size={24} />
                </div>
                <p className="text-slate-500 font-bold tracking-tight">Verifying entrance credentials...</p>
            </div>
        );
    }

    if (isSubmitted) {
        if (!fullDetails) {
            return (
                <div className="max-w-3xl mx-auto mt-8 bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <p className="text-slate-700 font-semibold">Application submitted successfully.</p>
                    <p className="text-slate-500 text-sm mt-2">Submitted details are temporarily unavailable. Please try again in a moment.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
                    >
                        Retry
                    </button>
                </div>
            );
        }
        return (
            <div className="animate-fade-in pb-12">
                <SubmittedView 
                    statusData={stepStatus} 
                    fullDetails={fullDetails} 
                    onDownloadPDF={handleDownloadPDF} 
                />
            </div>
        );
    }

    const loading = formLoading || statusLoading;
    const completedCount = stepStatus?.completedCount || 0;
    const totalSteps = stepStatus?.totalSteps || 7;
    const progressPercent = stepStatus?.progressPercent || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="text-primary-600" size={24} />
                        Admission Form
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-semibold">Admission Session 2024-25</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-3"
                    >
                        <ChevronLeft size={16} />
                        Back to Portal
                    </button>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Admission Progress</p>
                        <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: progressPercent === 100
                                            ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                            : 'linear-gradient(90deg, #1241a1, #3b82f6)'
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm font-bold text-primary-700">{completedCount}/{totalSteps}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Indicator */}
            <StepIndicator steps={STEPS} currentStep={currentStep} getStepState={getStepState} />

            {/* Step Status Bar */}
            <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-500 font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary-600 step-pulse"></div>
                    <span className="text-slate-500 font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-slate-500 font-medium">Locked</span>
                </div>
            </div>

            {/* Form Content Card */}
            <div className="bg-white rounded-lg border border-slate-200 min-h-[400px] relative overflow-hidden">
                <div className={`h-1 w-full transition-colors duration-500 ${
                    getStepState(currentStep) === 'COMPLETED' ? 'bg-green-500' : 'bg-primary-600'
                }`}></div>

                <div className={`p-6 lg:p-8 transition-all duration-300 ${stepTransition ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    {loading ? (
                        <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 size={32} className="animate-spin text-primary-600" />
                            <p className="text-sm font-medium text-slate-500">Loading form...</p>
                        </div>
                    ) : renderStep()}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-slate-50 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white text-primary-600 border border-slate-200 flex items-center justify-center">
                        <HelpCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Need help?</h4>
                        <p className="text-sm text-slate-500">Our admissions team is ready to guide you through the process.</p>
                    </div>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-2 py-2 px-4 whitespace-nowrap">
                    Contact Support
                    <ExternalLink size={14} />
                </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-400">
                © 2024 University Admission Cell. All rights reserved.
            </div>
        </div>
    );
};

export default AdmissionForm;
