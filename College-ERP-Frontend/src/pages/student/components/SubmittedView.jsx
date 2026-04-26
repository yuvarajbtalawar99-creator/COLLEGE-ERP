import React, { useState } from 'react';
import {
    CheckCircle,
    Clock,
    XCircle,
    FileText,
    Download,
    Eye,
    ArrowLeft,
    ShieldCheck,
    Calendar,
    Tag,
    GraduationCap,
    HelpCircle,
    ExternalLink,
    Search,
    AlertTriangle,
    Award
} from 'lucide-react';
import Step7Review from '../form-steps/Step7Review';
import ActivityTimeline from '../../../components/ActivityTimeline';
import StatusBadge from '../../../components/StatusBadge';

const SubmittedView = ({ statusData, fullDetails, onDownloadPDF }) => {
    const [viewMode, setViewMode] = useState('DASHBOARD');

    const getStatusConfig = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return {
                    label: 'Application Submitted',
                    desc: 'Your application has been received and is waiting to be reviewed by the admissions team.',
                    icon: Clock,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    gradient: 'from-blue-600 to-indigo-600',
                    badgeBg: 'bg-blue-100 text-blue-700'
                };
            case 'UNDER_REVIEW':
                return {
                    label: 'Under Review',
                    desc: 'An admission officer is currently reviewing your application and verifying your details.',
                    icon: Search,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    gradient: 'from-amber-500 to-orange-500',
                    badgeBg: 'bg-amber-100 text-amber-700'
                };
            case 'DOCUMENT_VERIFIED':
                return {
                    label: 'Documents Verified',
                    desc: 'Your documents have been verified successfully. Your application is now awaiting final approval.',
                    icon: ShieldCheck,
                    color: 'text-teal-600',
                    bg: 'bg-teal-50',
                    border: 'border-teal-200',
                    gradient: 'from-teal-500 to-cyan-500',
                    badgeBg: 'bg-teal-100 text-teal-700'
                };
            case 'ADMISSION_CONFIRMED':
                return {
                    label: 'Admission Confirmed',
                    desc: 'Congratulations! Your admission has been approved. Your College ID has been generated.',
                    icon: CheckCircle,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    gradient: 'from-emerald-500 to-green-500',
                    badgeBg: 'bg-emerald-100 text-emerald-700'
                };
            case 'REJECTED':
                return {
                    label: 'Application Rejected',
                    desc: 'Unfortunately, your application has not been approved. Please see the rejection reason below.',
                    icon: XCircle,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    gradient: 'from-red-500 to-rose-500',
                    badgeBg: 'bg-red-100 text-red-700'
                };
            case 'USN_ASSIGNED':
                return {
                    label: 'USN Assigned',
                    desc: 'Your final VTU USN has been assigned. You are now fully enrolled in the university.',
                    icon: Award,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    gradient: 'from-purple-600 to-indigo-600',
                    badgeBg: 'bg-purple-100 text-purple-700'
                };
            default:
                return {
                    label: 'Application Submitted',
                    desc: 'Your application is being processed.',
                    icon: Clock,
                    color: 'text-slate-600',
                    bg: 'bg-slate-50',
                    border: 'border-slate-200',
                    gradient: 'from-slate-500 to-slate-600',
                    badgeBg: 'bg-slate-100 text-slate-700'
                };
        }
    };

    const applicationStatus = statusData?.applicationStatus;
    const config = getStatusConfig(applicationStatus);
    const StatusIcon = config.icon;
    const timeline = statusData?.timeline || {};
    const isApproved = applicationStatus === 'ADMISSION_CONFIRMED';
    const isRejected = applicationStatus === 'REJECTED';

    if (viewMode === 'REVIEW') {
        return (
            <div className="space-y-6 animate-fade-in pb-12">
                <button
                    onClick={() => setViewMode('DASHBOARD')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold transition-all"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <Step7Review readOnly={true} details={fullDetails} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* ═══ STATUS BANNER ═══ */}
            <div className={`relative overflow-hidden p-8 rounded-2xl border-2 ${config.border} ${config.bg}`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`size-16 rounded-2xl flex items-center justify-center shadow-lg ${config.bg} border-2 ${config.border} ${config.color}`}>
                            <StatusIcon size={32} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h2 className={`text-2xl font-black ${config.color} tracking-tight`}>
                                    {config.label}
                                </h2>
                            </div>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-lg">
                                {config.desc}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={applicationStatus} />
                </div>
            </div>

            {/* ═══ INFO GRID ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tracking Info */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Tag size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tracking Info</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Application ID</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">#{statusData?.studentId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Date Submitted</p>
                            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Calendar size={14} className="text-slate-300" />
                                {timeline.submittedAt
                                    ? new Date(timeline.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                                    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Selection */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                        <GraduationCap size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Selected Program</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Admission Type</p>
                            <p className="text-lg font-black text-primary-900 uppercase">
                                {fullDetails?.admissionType || 'Regular'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Selected Branch</p>
                            <p className="text-lg font-black text-primary-900 uppercase">
                                {fullDetails?.branch?.name || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* College ID (if approved or assigned USN) */}
                    {(isApproved || applicationStatus === 'USN_ASSIGNED') && statusData?.tempCollegeId && (
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between mt-2">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">College ID</p>
                                <p className="text-2xl font-black text-emerald-700 font-mono tracking-wider">{statusData.tempCollegeId}</p>
                            </div>
                            <CheckCircle size={28} className="text-emerald-500" />
                        </div>
                    )}

                    {/* VTU USN (major success milestone) */}
                    {statusData?.vtuUsn && (
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 flex items-center justify-between mt-4">
                            <div>
                                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">VTU USN</p>
                                <p className="text-2xl font-black text-purple-700 font-mono tracking-wider">{statusData.vtuUsn}</p>
                            </div>
                            <Award size={28} className="text-purple-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ REJECTION REASON (if rejected) ═══ */}
            {isRejected && statusData?.rejectionRemark && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-red-900">Rejection Reason</h3>
                            <p className="text-xs text-red-500">From Admissions Office</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-4">
                        <p className="text-sm text-red-800 leading-relaxed font-medium italic">
                            "{statusData.rejectionRemark}"
                        </p>
                    </div>
                    <p className="text-xs text-red-500 font-medium">
                        Please contact the admissions office for further guidance or clarification.
                    </p>
                </div>
            )}

            {/* ═══ ACTIVITY TIMELINE ═══ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                    <Award size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Application Progress</span>
                </div>
                <ActivityTimeline timeline={timeline} />
            </div>

            {/* ═══ QUICK ACTIONS ═══ */}
            <div className={`bg-gradient-to-br ${config.gradient} p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group border border-white/5`}>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-24"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-3 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
                            <ShieldCheck size={12} />
                            Secured Application
                        </div>
                        <h3 className="text-3xl font-black tracking-tight leading-none">
                            {isApproved ? 'Welcome Aboard!' : isRejected ? 'What\'s Next?' : 'Next Steps'}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
                            {isApproved
                                ? 'Download your admission acknowledgment and keep it safe for future reference.'
                                : isRejected
                                    ? 'Contact the admissions office for clarification or guidance on reapplication.'
                                    : 'Your application is being processed. Keep a copy of your acknowledgment for verification.'
                            }
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setViewMode('REVIEW')}
                            className="w-full sm:w-auto h-14 px-8 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Eye size={20} />
                            View Application
                        </button>
                        {(isApproved || !isRejected) && (
                            <button
                                onClick={onDownloadPDF}
                                className="w-full sm:w-auto h-14 px-8 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                <Download size={20} />
                                {isApproved ? 'Download Acknowledgment' : 'Download PDF'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ HELP CARD ═══ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 shadow-inner">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 tracking-tight">Application Support</h4>
                        <p className="text-sm text-slate-500 font-medium">Contact the nodal office for any discrepancies.</p>
                    </div>
                </div>
                <button className="h-12 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-sm font-bold text-slate-700 whitespace-nowrap transition-all">
                    Contact Admissions
                    <ExternalLink size={16} />
                </button>
            </div>
        </div>
    );
};

export default SubmittedView;
