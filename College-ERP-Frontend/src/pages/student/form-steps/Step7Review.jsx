import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import {
    Loader2,
    CheckCircle,
    ChevronLeft,
    ShieldCheck,
    User,
    Users,
    MapPin,
    GraduationCap,
    Edit3,
    FileText,
    Download,
    AlertCircle,
    ArrowRight,
    Camera,
    Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Step7Review = ({ onPrev, readOnly = false, details: externalDetails = null }) => {
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000/uploads';
    const [loading, setLoading] = useState(!externalDetails);
    const [submitting, setSubmitting] = useState(false);
    const [details, setDetails] = useState(externalDetails);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    // Fetch full application details if not provided externally
    useEffect(() => {
        if (externalDetails) {
            setDetails(externalDetails);
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await api.get('/application/full-details');
                if (res.data.success) {
                    setDetails(res.data.data);
                }
            } catch (error) {
                toast.error("Failed to load application details for review.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    const handleSubmit = async () => {
        if (!isConfirmed) {
            toast.error("Please confirm your details before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/student/submit');
            if (res.data.success) {
                toast.success('Application Submitted Successfully!');
                setIsSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
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
            link.setAttribute('download', `Acknowledgment_${details.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error(error.code === 'ECONNABORTED' ? "PDF generation is taking longer than expected. Please try again." : "Failed to download PDF acknowledgment.");
        }
    };

    const handleEdit = (stepNumber) => {
        localStorage.setItem('admission_form_step', stepNumber.toString());
        // Forcing a small delay to ensure local storage is set before re-render/logic
        setTimeout(() => window.location.reload(), 50);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 size={40} className="animate-spin text-primary-600" />
                <p className="text-slate-500 font-medium">Preparing application review...</p>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="space-y-8 animate-fade-in py-8 text-center max-w-2xl mx-auto">
                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
                    <CheckCircle size={40} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
                    <p className="text-slate-500">Your application (ID: <span className="font-bold text-slate-800">{details.id}</span>) has been successfully recorded and is now under review.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-6 mt-10">
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-8 text-left">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Application ID</p>
                            <p className="text-lg font-bold text-slate-900">#{details.id}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Submitted</p>
                            <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-bold text-green-600 flex items-center gap-1.5">
                                <ShieldCheck size={20} /> SUBMITTED
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 bg-primary-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-[0.98]"
                        >
                            <Download size={20} />
                            Download Acknowledgment PDF
                        </button>
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <ArrowRight size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-400">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        );
    }

    const ReviewSection = ({ icon: Icon, title, step, children }) => (
        <div className="review-card group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm text-primary-600 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
                </div>
                {!readOnly && (
                    <button
                        onClick={() => handleEdit(step)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        <Edit3 size={14} />
                        Edit
                    </button>
                )}
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    {children}
                </div>
            </div>
        </div>
    );

    const DataItem = ({ label, value, highlight = false }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`text-sm font-semibold break-words transition-colors duration-300 ${highlight ? 'text-primary-700 font-bold' : 'text-slate-700'
                }`}>
                {value || <span className="text-slate-300 font-medium italic">Not provided</span>}
            </p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Professional Header & Profile */}
            <div className="bg-gradient-to-br from-slate-900 to-primary-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                            <ShieldCheck size={12} className="text-blue-300" />
                            Application Review Phase
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Verify Your Information</h2>
                        <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                            Please conduct a final review of all entered details. Your application will be locked for editing once submitted.
                        </p>
                    </div>

                    <div className="flex items-center gap-5 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                        <div className="relative group">
                            <div className="size-20 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-primary-400 shadow-xl">
                                {details.studentdocuments?.photo ? (
                                    <img
                                        src={details.studentdocuments.photo.startsWith('http') ? details.studentdocuments.photo : `${uploadsBaseUrl}/${details.studentdocuments.photo}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={32} className="text-white/40" />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white p-1.5 rounded-full shadow-lg">
                                <Camera size={12} />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold leading-tight uppercase tracking-tight">
                                {details.studentpersonaldetails?.fullName || 'Guest Applicant'}
                            </p>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                App ID: <span className="text-primary-300 font-bold tracking-wider">#{details.id}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Cards Grid */}
            <div className="space-y-6">
                {/* Course & Branch */}
                <ReviewSection icon={GraduationCap} title="Choice of Course" step={1}>
                    <DataItem label="Admission Type" value={details.admissionType} highlight={true} />
                    <DataItem label="Preferred Branch" value={details.branch?.name} highlight={true} />
                    {details.cetNumber && <DataItem label="CET/Rank No." value={details.cetNumber} />}
                    {details.dcetNumber && <DataItem label="DCET/Rank No." value={details.dcetNumber} />}
                </ReviewSection>

                {/* Personal Details */}
                <ReviewSection icon={User} title="Personal Details" step={2}>
                    <DataItem label="Full Name" value={details.studentpersonaldetails?.fullName} />
                    <DataItem label="Date of Birth" value={details.studentpersonaldetails?.dateOfBirth ? new Date(details.studentpersonaldetails.dateOfBirth).toLocaleDateString() : null} />
                    <DataItem label="Gender" value={details.studentpersonaldetails?.gender} />
                    <DataItem label="Category" value={details.studentpersonaldetails?.category} />
                    <DataItem label="Religion" value={details.studentpersonaldetails?.religion} />
                    <DataItem label="Nationality" value={details.studentpersonaldetails?.nationality} />
                    <DataItem label="Studied in Karnataka" value={details.studentpersonaldetails?.studiedInKarnataka ? 'Yes' : 'No'} />
                    <DataItem label="Area Type" value={details.studentpersonaldetails?.areaType} />
                </ReviewSection>

                {/* Parent Details */}
                <ReviewSection icon={Users} title="Parent Details" step={3}>
                    <DataItem label="Father's Name" value={details.studentparentdetails?.fatherName} />
                    <DataItem label="Mother's Name" value={details.studentparentdetails?.motherName} />
                    <DataItem label="Parent Contact" value={details.studentparentdetails?.parentMobile} />
                    <DataItem label="Parent Email" value={details.studentparentdetails?.parentEmail || 'N/A'} />
                    <DataItem label="Occupation" value={details.studentparentdetails?.occupation} />
                    <DataItem label="Annual Income" value={details.studentparentdetails?.annualIncome ? `₹${Number(details.studentparentdetails.annualIncome).toLocaleString()}` : null} />
                </ReviewSection>

                {/* Address Details */}
                <ReviewSection icon={MapPin} title="Address Details" step={4}>
                    <div className="col-span-full border-b border-slate-50 pb-2 mb-2">
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Current Address</p>
                    </div>
                    <DataItem label="Address" value={details.studentaddress?.Address} />
                    <DataItem label="City / Taluk" value={`${details.studentaddress?.City} / ${details.studentaddress?.Taluk}`} />
                    <DataItem label="District / Pincode" value={`${details.studentaddress?.district_studentaddress_DistrictIdTodistrict?.name} - ${details.studentaddress?.Pincode}`} />

                    <div className="col-span-full border-b border-slate-50 pb-2 mb-2 mt-4">
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Permanent Address</p>
                    </div>
                    <DataItem label="Address" value={details.studentaddress?.permanentAddress} />
                    <DataItem label="City / Taluk" value={`${details.studentaddress?.permanentCity} / ${details.studentaddress?.permanentTaluk}`} />
                    <DataItem label="District / Pincode" value={`${details.studentaddress?.district_studentaddress_permanentDistrictIdTodistrict?.name} - ${details.studentaddress?.permanentPincode}`} />
                </ReviewSection>

                {/* Academic Details */}
                <ReviewSection icon={GraduationCap} title="Academic Record" step={5}>
                    <div className="col-span-full border-b border-slate-50 pb-2 mb-2">
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">SSLC / 10th Standard</p>
                    </div>
                    <DataItem label="Board" value={details.studentacademicdetails?.sslcBoard} />
                    <DataItem label="Year" value={details.studentacademicdetails?.sslcYear} />
                    <DataItem label="Percentage" value={`${details.studentacademicdetails?.sslcPercentage}%`} />

                    {details.studentacademicdetails?.pucBoard && (
                        <>
                            <div className="col-span-full border-b border-slate-50 pb-2 mb-2 mt-4">
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">PUC / 12th Standard</p>
                            </div>
                            <DataItem label="Board" value={details.studentacademicdetails?.pucBoard} />
                            <DataItem label="Year" value={details.studentacademicdetails?.pucYear} />
                            <DataItem label="PCM Aggregate" value={`${details.studentacademicdetails?.pucAggregate || details.studentacademicdetails?.pucPercentage}%`} />
                        </>
                    )}
                </ReviewSection>

                {/* Documents */}
                <ReviewSection icon={FileText} title="Attached Documents" step={6}>
                    <DataItem label="Photo" value={details.studentdocuments?.photo ? '✅ Uploaded' : '❌ Missing'} />
                    <DataItem label="Signature" value={details.studentdocuments?.signature ? '✅ Uploaded' : '❌ Missing'} />
                    <DataItem label="SSLC Marks Card" value={details.studentdocuments?.sslcMarkscard ? '✅ Uploaded' : '❌ Missing'} />
                    <DataItem label="PUC Marks Card" value={details.studentdocuments?.pucMarkscard ? '✅ Uploaded' : '❌ Missing'} />
                    <DataItem label="Study Certificate" value={details.studentdocuments?.studyCertificate ? '✅ Uploaded' : '❌ Missing'} />
                </ReviewSection>
            </div>

            {/* Submission Section - Hidden in readOnly */}
            {!readOnly && (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl mt-12 mb-8">
                    <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-amber-900">Final Declaration</h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                I hereby declare that the information provided above is true and accurate to the best of my knowledge.
                                I understand that any misleading information may lead to the cancellation of my admission application.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="peer size-6 rounded-lg border-2 border-slate-300 text-primary-600 focus:ring-primary-600/20 transition-all checked:bg-primary-600 appearance-none"
                                />
                                <CheckCircle size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 select-none">
                                I have reviewed all the details and confirm they are correct.
                            </span>
                        </label>

                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => handleEdit(1)}
                                className="btn-secondary h-14 px-8 flex items-center justify-center gap-3 text-sm font-bold rounded-2xl"
                            >
                                <ChevronLeft size={20} />
                                Discard & Edit
                            </button>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full sm:w-auto h-14 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Printer size={20} />
                                    Print Draft
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !isConfirmed}
                                    className={`
                                        w-full sm:w-auto h-14 px-12 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl
                                        ${!isConfirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale' : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-primary-600/30'}
                                    `}
                                >
                                    {submitting ? (
                                        <Loader2 size={22} className="animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck size={20} />
                                            Finalize & Submit
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step7Review;
