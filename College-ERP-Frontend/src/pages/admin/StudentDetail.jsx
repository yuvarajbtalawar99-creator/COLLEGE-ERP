import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Phone, Home, BookOpen, FileText,
    CheckCircle, ShieldAlert, Award, Globe, Map, GraduationCap,
    Eye, CheckCircle2, XCircle, Play, ShieldCheck,
    AlertTriangle, Loader2
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import ActivityTimeline from '../../components/ActivityTimeline';
import DocumentPreviewModal from '../../components/DocumentPreviewModal';
import RejectModal from '../../components/RejectModal';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');

    // Document verification checkboxes
    const [docChecks, setDocChecks] = useState({
        photoVerified: false,
        signatureVerified: false,
        marksCardVerified: false
    });

    // USN input
    const [usnInput, setUsnInput] = useState('');

    // Modals
    const [previewDoc, setPreviewDoc] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await api.get(`/admin/student/${id}`);
            if (response.data.success) {
                const s = response.data.data;
                setStudent(s);
                setDocChecks({
                    photoVerified: s.photoVerified || false,
                    signatureVerified: s.signatureVerified || false,
                    marksCardVerified: s.marksCardVerified || false
                });
                if (s.vtuUsn) setUsnInput(s.vtuUsn);
            }
        } catch (error) {
            toast.error('Failed to load student details');
            navigate('/admin/students');
        } finally {
            setLoading(false);
        }
    };

    // ── Workflow Actions ──────────────────────────────────

    const handleStartReview = async () => {
        setActionLoading('review');
        try {
            const res = await api.post(`/admin/student/${id}/start-review`);
            if (res.data.success) {
                toast.success('Review started!');
                await fetchStudent();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to start review');
        } finally {
            setActionLoading('');
        }
    };

    const handleSaveDocChecks = async (newChecks) => {
        try {
            await api.patch(`/admin/student/${id}/doc-checks`, newChecks);
        } catch (error) {
            toast.error('Failed to save verification check');
        }
    };

    const handleDocCheckChange = (field) => {
        const newChecks = { ...docChecks, [field]: !docChecks[field] };
        setDocChecks(newChecks);
        handleSaveDocChecks(newChecks);
    };

    const handleVerifyDocuments = async () => {
        setActionLoading('verify');
        try {
            const res = await api.post(`/admin/student/${id}/verify-documents`);
            if (res.data.success) {
                toast.success('Documents verified!');
                await fetchStudent();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify documents');
        } finally {
            setActionLoading('');
        }
    };

    const handleApprove = async () => {
        setActionLoading('approve');
        try {
            const res = await api.post(`/admin/student/${id}/approve`);
            if (res.data.success) {
                toast.success('Admission approved! College ID generated.');
                await fetchStudent();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading('');
        }
    };

    const handleReject = async (remark) => {
        setActionLoading('reject');
        try {
            const res = await api.post(`/admin/student/${id}/reject`, { remark });
            if (res.data.success) {
                toast.success('Application rejected');
                setShowRejectModal(false);
                await fetchStudent();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading('');
        }
    };

    const handleAssignUsn = async () => {
        if (!usnInput.trim()) {
            toast.error('Please enter a USN first');
            return;
        }
        try {
            const res = await api.post(`/admin/student/${id}/assign-usn`, { usn: usnInput });
            if (res.data.success) {
                toast.success('USN assigned successfully!');
                await fetchStudent();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign USN');
        }
    };

    // ── Render Helpers ──────────────────────────────────

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            <p className="text-slate-400 font-medium text-sm">Loading Profile...</p>
        </div>
    );
    if (!student) return null;

    const status = student.status;
    const allDocsChecked = docChecks.photoVerified && docChecks.signatureVerified && docChecks.marksCardVerified;
    const isFinalState = status === 'ADMISSION_CONFIRMED' || status === 'USN_ASSIGNED' || status === 'REJECTED';

    const DetailCard = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Icon size={18} />
                </div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                {children}
            </div>
        </div>
    );

    const InfoItem = ({ label, value, isFullWidth }) => (
        <div className={isFullWidth ? "col-span-full" : ""}>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <div className="text-sm font-medium text-slate-700">
                {value || <span className="text-slate-300 italic">Not specified</span>}
            </div>
        </div>
    );

    const timeline = {
        submittedAt: student.submittedAt,
        reviewStartedAt: student.reviewStartedAt,
        documentsVerifiedAt: student.documentsVerifiedAt,
        approvedAt: student.approvedAt,
        rejectedAt: student.rejectedAt
    };

    const documents = [
        { label: "Photo", val: student.studentdocuments?.photo },
        { label: "Signature", val: student.studentdocuments?.signature },
        { label: "SSLC Marks Card", val: student.studentdocuments?.sslcMarkscard },
        { label: "PUC / Diploma", val: student.studentdocuments?.pucMarkscard },
        { label: "Caste Certificate", val: student.studentdocuments?.casteCertificate },
        { label: "Income Certificate", val: student.studentdocuments?.incomeCertificate },
        { label: "Study Certificate", val: student.studentdocuments?.studyCertificate },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => navigate('/admin/students')}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center flex-shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold text-slate-900">
                                {student.studentpersonaldetails?.fullName || student.user?.email}
                            </h1>
                            <StatusBadge status={student.status} />
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-3">
                            <span>App ID: <span className="text-slate-700 font-medium">#{student.id}</span></span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Registered: <span className="text-slate-700 font-medium">{new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-5">

                    <DetailCard title="Admission Information" icon={FileText}>
                        <InfoItem label="Email Address" value={student.user?.email} />
                        <InfoItem label="Mobile Number" value={student.user?.mobile} />
                        <InfoItem label="Admission Type" value={student.admissionType} />
                        <InfoItem label="Selected Branch" value={student.branch?.name} />
                        {(student.cetNumber || student.dcetNumber) && (
                            <InfoItem label="Entrance Rank No." value={student.cetNumber || student.dcetNumber} />
                        )}
                        <InfoItem label="Aadhaar UID" value={student.aadhaar} />
                    </DetailCard>

                    {student.studentpersonaldetails && (
                        <DetailCard title="Personal Details" icon={User}>
                            <InfoItem label="Gender" value={student.studentpersonaldetails.gender} />
                            <InfoItem label="Date of Birth" value={new Date(student.studentpersonaldetails.dateOfBirth).toLocaleDateString()} />
                            <InfoItem label="Category" value={student.studentpersonaldetails.category} />
                            <InfoItem label="Religion" value={student.studentpersonaldetails.religion} />
                            <InfoItem label="Nationality" value={student.studentpersonaldetails.nationality} />
                            <InfoItem label="Area Type" value={student.studentpersonaldetails.areaType} />
                            <InfoItem label="Karnataka Resident" value={student.studentpersonaldetails.studiedInKarnataka ? 'Yes' : 'No'} />
                        </DetailCard>
                    )}

                    {student.studentparentdetails && (
                        <DetailCard title="Parent / Guardian" icon={Phone}>
                            <InfoItem label="Father's Name" value={student.studentparentdetails.fatherName} />
                            <InfoItem label="Mother's Name" value={student.studentparentdetails.motherName} />
                            <InfoItem label="Contact Number" value={student.studentparentdetails.parentMobile} />
                            <InfoItem label="Occupation" value={student.studentparentdetails.occupation} />
                            <InfoItem label="Annual Income" value={`₹${student.studentparentdetails.annualIncome?.toLocaleString()}`} />
                        </DetailCard>
                    )}

                    {student.studentaddress && (
                        <DetailCard title="Address" icon={Home}>
                            <InfoItem label="Current Address" value={student.studentaddress.Address} isFullWidth />
                            <InfoItem label="City" value={student.studentaddress.City} />
                            <InfoItem label="Taluk" value={student.studentaddress.Taluk} />
                            <InfoItem label="Pincode" value={student.studentaddress.Pincode} />
                            <div className="col-span-full border-t border-slate-100 pt-4" />
                            <InfoItem label="Permanent Address" value={student.studentaddress.permanentAddress} isFullWidth />
                            <InfoItem label="City" value={student.studentaddress.permanentCity} />
                            <InfoItem label="Taluk" value={student.studentaddress.permanentTaluk} />
                            <InfoItem label="Pincode" value={student.studentaddress.permanentPincode} />
                        </DetailCard>
                    )}

                    {student.studentacademicdetails && (
                        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <GraduationCap size={18} />
                                </div>
                                <h2 className="text-base font-semibold text-slate-900">Academic Records</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                                        <h3 className="text-sm font-semibold text-slate-800">SSLC (10th Standard)</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <InfoItem label="Board" value={student.studentacademicdetails.sslcBoard} />
                                        <InfoItem label="Year" value={student.studentacademicdetails.sslcYear} />
                                        <InfoItem label="Register No." value={student.studentacademicdetails.sslcRegisterNumber} />
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Percentage</p>
                                            <p className="text-base font-semibold text-green-600">{student.studentacademicdetails.sslcPercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                                {student.studentacademicdetails.pucBoard && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                            <h3 className="text-sm font-semibold text-slate-800">PUC (12th Standard)</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <InfoItem label="Board" value={student.studentacademicdetails.pucBoard} />
                                            <InfoItem label="Year" value={student.studentacademicdetails.pucYear} />
                                            <InfoItem label="Register No." value={student.studentacademicdetails.pucRegisterNumber} />
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Percentage</p>
                                                <p className="text-base font-semibold text-green-600">{student.studentacademicdetails.pucPercentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-8">

                    {/* ═══ ACTION PANEL ═══ */}
                    <div className="bg-slate-900 rounded-lg p-5 text-white space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <ShieldAlert size={16} />
                            </div>
                            <h3 className="text-sm font-semibold text-white">Admin Action Panel</h3>
                        </div>

                        {/* Current Status */}
                        <div>
                            <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-2">Current Status</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                                <StatusBadge status={student.status} />
                            </div>
                        </div>

                        {/* Contextual Actions */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-wider">Workflow Actions</label>

                            {/* Start Review */}
                            {(status === 'SUBMITTED' || status === 'RESUBMITTED') && (
                                <button
                                    onClick={handleStartReview}
                                    disabled={actionLoading === 'review'}
                                    className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === 'review' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                    Start Review
                                </button>
                            )}

                            {/* Verify Documents */}
                            {status === 'UNDER_REVIEW' && (
                                <button
                                    onClick={handleVerifyDocuments}
                                    disabled={!allDocsChecked || actionLoading === 'verify'}
                                    className={`w-full h-11 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                        allDocsChecked
                                            ? 'bg-teal-500 hover:bg-teal-600 text-white'
                                            : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    {actionLoading === 'verify' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                    Verify Documents
                                </button>
                            )}

                            {/* Approve */}
                            {status === 'DOCUMENT_VERIFIED' && (
                                <button
                                    onClick={handleApprove}
                                    disabled={actionLoading === 'approve'}
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === 'approve' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                    Approve Admission
                                </button>
                            )}

                            {/* Reject (available for non-final states) */}
                            {!isFinalState && status !== 'REGISTERED' && (
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="w-full h-11 bg-white/5 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={16} />
                                    Reject Application
                                </button>
                            )}

                            {/* Final states info */}
                            {status === 'ADMISSION_CONFIRMED' && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                                    <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
                                    <p className="text-emerald-300 text-xs font-bold">Admission Approved</p>
                                    {student.tempCollegeId && (
                                        <p className="text-emerald-200 text-lg font-mono font-bold mt-1">{student.tempCollegeId}</p>
                                    )}
                                </div>
                            )}

                                {status === 'REJECTED' && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                        <XCircle size={20} className="text-red-400 mb-2" />
                                        <p className="text-red-300 text-xs font-bold mb-1">Application Rejected</p>
                                        {student.rejectionRemark && (
                                            <p className="text-red-200/70 text-xs leading-relaxed italic">"{student.rejectionRemark}"</p>
                                        )}
                                    </div>
                                )}

                                {status === 'RESUBMITTED' && student.rejectionRemark && (
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                        <AlertTriangle size={20} className="text-indigo-400 mb-2" />
                                        <p className="text-indigo-300 text-xs font-bold mb-1">Previous Rejection Reason</p>
                                        <p className="text-indigo-200/70 text-xs leading-relaxed italic">"{student.rejectionRemark}"</p>
                                    </div>
                                )}
                        </div>

                        {/* USN Section (for confirmed admissions) */}
                        {(status === 'ADMISSION_CONFIRMED' || status === 'USN_ASSIGNED') && (
                            <div className="space-y-2 pt-3 border-t border-white/10">
                                <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-wider">VTU USN</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter USN"
                                        className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 font-mono font-semibold text-sm text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase flex-1 min-w-0"
                                        value={usnInput}
                                        onChange={(e) => setUsnInput(e.target.value.toUpperCase())}
                                    />
                                    <button
                                        onClick={handleAssignUsn}
                                        className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ DOCUMENT VERIFICATION ═══ */}
                    {student.studentdocuments && (
                        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="text-primary-600">
                                    <FileText size={18} />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">Documents & Verification</h3>
                            </div>

                            {/* Document list with preview */}
                            <div className="space-y-2">
                                {documents.map(doc => doc.val && (
                                    <div key={doc.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-white hover:border-primary-200 transition-colors border border-transparent">
                                        <span className="text-sm font-medium text-slate-800">{doc.label}</span>
                                        <button
                                            onClick={() => setPreviewDoc({ url: doc.val, label: doc.label })}
                                            className="w-8 h-8 rounded-lg bg-white text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors border border-slate-200"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Verification Checkboxes (visible during UNDER_REVIEW) */}
                            {(status === 'UNDER_REVIEW' || status === 'DOCUMENT_VERIFIED') && (
                                <div className="pt-3 border-t border-slate-100 space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Checks</label>

                                    {[
                                        { key: 'photoVerified', label: 'Photo Verified' },
                                        { key: 'signatureVerified', label: 'Signature Verified' },
                                        { key: 'marksCardVerified', label: 'Marks Card Verified' }
                                    ].map(check => (
                                        <label
                                            key={check.key}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                docChecks[check.key]
                                                    ? 'bg-emerald-50 border-emerald-200'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            } ${status === 'DOCUMENT_VERIFIED' ? 'pointer-events-none opacity-60' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={docChecks[check.key]}
                                                onChange={() => handleDocCheckChange(check.key)}
                                                disabled={status === 'DOCUMENT_VERIFIED'}
                                                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                                            />
                                            <span className={`text-sm font-medium ${docChecks[check.key] ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                {check.label}
                                            </span>
                                            {docChecks[check.key] && (
                                                <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                                            )}
                                        </label>
                                    ))}

                                    {!allDocsChecked && status === 'UNDER_REVIEW' && (
                                        <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1.5 pt-1">
                                            <AlertTriangle size={12} />
                                            All checks required before verification
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ ACTIVITY TIMELINE ═══ */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="text-primary-600">
                                <Award size={18} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">Activity Timeline</h3>
                        </div>
                        <ActivityTimeline timeline={timeline} />
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                documentUrl={previewDoc?.url}
                documentLabel={previewDoc?.label}
            />

            <RejectModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                isLoading={actionLoading === 'reject'}
            />
        </div>
    );
};

export default StudentDetail;
