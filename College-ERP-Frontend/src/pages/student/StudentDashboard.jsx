import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    GraduationCap,
    HelpCircle,
    Users,
    Upload,
    FileText as FileDigit,
    Send,
    Loader2,
    Activity,
    LifeBuoy,
    Calendar,
    FileText,
    CreditCard,
    Download,
    CheckCircle,
    PlayCircle,
    Lock,
    ArrowRight,
    Sparkles,
    Eye,
    Clock,
    Search,
    ShieldCheck,
    XCircle,
    AlertTriangle,
    Award
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import useApplicationStatus from '../../hooks/useApplicationStatus';
import StatusBadge from '../../components/StatusBadge';
import ActivityTimeline from '../../components/ActivityTimeline';

const StudentDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        stepStatus,
        loading,
        getStepState,
        isStepAccessible,
        refetch
    } = useApplicationStatus();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 size={32} className="animate-spin text-primary-600" />
                <p className="text-slate-500 text-sm font-medium">Loading Portal...</p>
            </div>
        );
    }

    const completedCount = stepStatus?.completedCount || 0;
    const totalSteps = stepStatus?.totalSteps || 7;
    const progressPercent = stepStatus?.progressPercent || 0;
    const applicationStatus = stepStatus?.applicationStatus;
    const isSubmitted = applicationStatus && applicationStatus !== 'REGISTERED' && applicationStatus !== 'CORRECTION_REQUIRED';
    const timeline = stepStatus?.timeline || {};

    // ═══════ SUBMITTED STATUS DASHBOARD ═══════
    if (isSubmitted) {
        return <SubmittedDashboard
            stepStatus={stepStatus}
            applicationStatus={applicationStatus}
            timeline={timeline}
            navigate={navigate}
        />;
    }

    // ═══════ FORM STEPS DASHBOARD ═══════
    const steps = [
        {
            id: 1, key: 'admission', title: "Admission Details",
            subtitle: "Select admission type and preferred branch.",
            icon: GraduationCap, targetStep: 1,
        },
        {
            id: 2, key: 'personalDetails', title: "Personal Details",
            subtitle: "Basic contact info and personal identification.",
            icon: User, targetStep: 2,
        },
        {
            id: 3, key: 'parentDetails', title: "Parent Details",
            subtitle: "Parent/Guardian identification and occupation.",
            icon: Users, targetStep: 3,
        },
        {
            id: 4, key: 'addressDetails', title: "Address Details",
            subtitle: "Permanent and correspondence addresses.",
            icon: HelpCircle, targetStep: 4,
        },
        {
            id: 5, key: 'academicDetails', title: "Academic Details",
            subtitle: "High school records and standardized test scores.",
            icon: GraduationCap, targetStep: 5,
        },
        {
            id: 6, key: 'documents', title: "Document Upload",
            subtitle: "Digital copies of certificates and ID proof.",
            icon: Upload, targetStep: 6,
        },
        {
            id: 7, key: 'review', title: "Review & Submit",
            subtitle: "Verify all information before final submission.",
            icon: Send, targetStep: 7,
        }
    ];

    const handleStepClick = (step) => {
        const state = getStepState(step.id);

        if (state === 'NOT_STARTED') {
            toast.error("Complete the previous steps first to unlock this step.");
            return;
        }

        localStorage.setItem('admission_form_step', step.targetStep.toString());
        navigate('/student/application');
    };

    return (
        <div className="animate-fade-in space-y-10 pb-16">
            {/* Welcome & Overall Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admission Application</h1>
                    <p className="text-slate-500 max-w-xl">Complete the following steps to submit your application for the 2024 Academic Year.</p>
                </div>

                {/* Progress Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-w-[300px]">
                    <div className="flex items-center gap-5">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Overall Progress</span>
                                <span className="text-xs font-bold text-slate-900">{completedCount}/{totalSteps} steps</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: progressPercent === 100
                                            ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                            : 'linear-gradient(90deg, #1241a1, #3b82f6)'
                                    }}
                                ></div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                                {progressPercent === 100 ? '🎉 All steps completed!' : `${progressPercent}% completed`}
                            </p>
                        </div>
                        <div className={`size-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                            progressPercent === 100
                                ? 'bg-green-100 text-green-600'
                                : 'bg-primary-600/10 text-primary-600'
                        }`}>
                            {progressPercent === 100 ? <CheckCircle size={24} /> : <Activity size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {steps.map((step, index) => {
                    const state = getStepState(step.id);
                    const isCompleted = state === 'COMPLETED';
                    const isActive = state === 'IN_PROGRESS';
                    const isLocked = state === 'NOT_STARTED';

                    return (
                        <div
                            key={step.id}
                            onClick={() => handleStepClick(step)}
                            className={`
                                step-card group relative flex flex-col bg-white rounded-xl p-6 transition-all duration-500
                                ${isActive
                                    ? 'border-2 border-primary-600 shadow-lg shadow-primary-600/10 -translate-y-1 step-active-glow'
                                    : 'border-2 border-slate-100'}
                                ${isCompleted
                                    ? 'border-green-400 shadow-lg shadow-green-500/5'
                                    : ''}
                                ${isLocked
                                    ? 'opacity-50 cursor-not-allowed bg-slate-50/80 border-slate-200 grayscale-[20%]'
                                    : 'cursor-pointer hover:-translate-y-1.5 hover:shadow-xl'}
                            `}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            {isActive && (
                                <div className="absolute -top-3 left-6 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10 flex items-center gap-1.5 shadow-md shadow-primary-600/30">
                                    <Sparkles size={10} />
                                    Active Step
                                </div>
                            )}

                            {isCompleted && (
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                                    <div className="absolute top-2 -right-3 bg-green-500 text-white text-[8px] font-bold px-5 py-0.5 rotate-45 shadow-sm">
                                        ✓ DONE
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-5">
                                <div className={`
                                    size-12 rounded-xl flex items-center justify-center transition-all duration-500
                                    ${isCompleted ? 'bg-green-100 text-green-600 shadow-sm' : ''}
                                    ${isActive ? 'bg-primary-600/10 text-primary-600 shadow-sm' : ''}
                                    ${isLocked ? 'bg-slate-100 text-slate-300' : ''}
                                `}>
                                    {step.icon && <step.icon size={24} />}
                                </div>

                                <div className={`
                                    text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 transition-all duration-500
                                    ${isCompleted ? 'bg-green-100 text-green-700' : ''}
                                    ${isActive ? 'bg-primary-50 text-primary-700' : ''}
                                    ${isLocked ? 'bg-slate-100 text-slate-400' : ''}
                                `}>
                                    {isCompleted ? (
                                        <><CheckCircle size={12} /> Completed</>
                                    ) : isActive ? (
                                        <><PlayCircle size={12} /> In Progress</>
                                    ) : (
                                        <><Lock size={12} /> Locked</>
                                    )}
                                </div>
                            </div>

                            <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isLocked ? 'text-slate-300' : 'text-slate-900'}`}>
                                {step.id}. {step.title}
                            </h3>
                            <p className={`text-sm mb-6 leading-relaxed transition-colors duration-300 ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                {step.subtitle}
                            </p>

                            <div className="mt-auto">
                                {isLocked ? (
                                    <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-slate-300">
                                        <Lock size={12} />
                                        <span>Complete previous step to unlock</span>
                                    </div>
                                ) : (
                                    <button className={`
                                        w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                            : 'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg'
                                        }
                                    `}>
                                        {isCompleted ? 'View / Edit' : 'Continue Application'}
                                        <ArrowRight size={16} className={isCompleted ? '' : 'group-hover:translate-x-0.5 transition-transform'} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Help Card */}
                <div className="group relative flex flex-col bg-primary-600/5 rounded-xl border border-primary-600/20 p-6">
                    <div className="size-12 rounded-xl bg-primary-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-primary-600/20">
                        <LifeBuoy size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Need Help?</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">Our admission officers are here to assist you with the process.</p>
                    <button className="mt-auto py-2.5 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold text-sm hover:bg-primary-600 hover:text-white transition-all duration-300">
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 group">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600 group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Deadline</p>
                        <p className="text-base font-bold text-slate-900">August 15, 2024 (11:59 PM)</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admission Handbook</p>
                        <a href="#" className="text-base font-bold text-primary-600 hover:underline flex items-center gap-1.5">
                            Download Guide <Download size={14} />
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Fee Status</p>
                        <p className="text-base font-bold text-slate-900">⏳ Pending Submission</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ═══════════════════════════════════════════════
//  SUBMITTED STATUS DASHBOARD (Inner Component)
// ═══════════════════════════════════════════════

const SubmittedDashboard = ({ stepStatus, applicationStatus, timeline, navigate }) => {

    const getStatusMeta = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return { label: 'Application Submitted', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Your application is being reviewed by the admissions team.' };
            case 'UNDER_REVIEW':
                return { label: 'Under Review', icon: Search, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'An administrator is currently reviewing your application.' };
            case 'DOCUMENT_VERIFIED':
                return { label: 'Documents Verified', icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-100', desc: 'Your documents have been verified. Awaiting final decision.' };
            case 'ADMISSION_CONFIRMED':
                return { label: 'Admission Confirmed', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Your admission has been approved!' };
            case 'REJECTED':
                return { label: 'Application Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', desc: 'Your application was not approved.' };
            default:
                return { label: 'Processing', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100', desc: 'Your application is being processed.' };
        }
    };

    const meta = getStatusMeta(applicationStatus);
    const StatusIcon = meta.icon;
    const isApproved = applicationStatus === 'ADMISSION_CONFIRMED';
    const isRejected = applicationStatus === 'REJECTED';

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

    return (
        <div className="animate-fade-in space-y-8 pb-16 max-w-4xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Status</h1>
                <p className="text-slate-500">Track the progress of your admission application in real-time.</p>
            </div>

            {/* Status Hero Card */}
            <div className={`relative overflow-hidden p-8 rounded-2xl border-2 ${
                isRejected ? 'border-red-200 bg-red-50' :
                isApproved ? 'border-emerald-200 bg-emerald-50' :
                'border-slate-200 bg-white'
            }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`size-20 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <StatusIcon size={40} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl font-black ${meta.color} tracking-tight`}>{meta.label}</h2>
                            <StatusBadge status={applicationStatus} />
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-lg">{meta.desc}</p>
                        <p className="text-xs text-slate-400">
                            Application ID: <span className="font-bold text-slate-700">#{stepStatus?.studentId}</span>
                        </p>
                    </div>
                </div>

                {/* College ID for approved */}
                {isApproved && stepStatus?.tempCollegeId && (
                    <div className="mt-6 bg-emerald-100 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Your College ID</p>
                            <p className="text-3xl font-black text-emerald-700 font-mono tracking-wider mt-1">{stepStatus.tempCollegeId}</p>
                        </div>
                        <CheckCircle size={36} className="text-emerald-400" />
                    </div>
                )}
            </div>

            {/* Rejection Reason */}
            {isRejected && stepStatus?.rejectionRemark && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle size={20} className="text-red-600" />
                        <h3 className="text-sm font-bold text-red-900">Rejection Reason</h3>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-4">
                        <p className="text-sm text-red-800 leading-relaxed font-medium italic">
                            "{stepStatus.rejectionRemark}"
                        </p>
                    </div>
                </div>
            )}

            {/* Timeline + Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Timeline */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4 mb-5">
                        <Award size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Application Progress</span>
                    </div>
                    <ActivityTimeline timeline={timeline} />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <button
                        onClick={() => navigate('/student/application')}
                        className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary-200 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <Eye size={22} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900 text-sm">View Application</p>
                            <p className="text-xs text-slate-400">Review your submitted details</p>
                        </div>
                        <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-primary-600 transition-colors" />
                    </button>

                    {(isApproved || !isRejected) && (
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary-200 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Download size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 text-sm">
                                    {isApproved ? 'Download Acknowledgment' : 'Download PDF'}
                                </p>
                                <p className="text-xs text-slate-400">Get a copy of your application</p>
                            </div>
                            <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </button>
                    )}

                    {isRejected && (
                        <button
                            onClick={() => navigate('/student/application')}
                            className="w-full bg-red-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Activity size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Edit & Resubmit</p>
                                <p className="text-xs text-red-100">Correct your application now</p>
                            </div>
                            <ArrowRight size={16} className="ml-auto text-red-200 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                            <LifeBuoy size={22} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900 text-sm">Need Help?</p>
                            <p className="text-xs text-slate-400">Contact admissions office</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
