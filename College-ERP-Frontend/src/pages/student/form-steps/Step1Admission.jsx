import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronRight, CheckCircle2, XCircle, Fingerprint, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Step1Admission = ({ onNext, data, updateData }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Validation states
    const [isCheckingAadhaar, setIsCheckingAadhaar] = useState(false);
    const [aadhaarError, setAadhaarError] = useState('');
    const [isCheckingCet, setIsCheckingCet] = useState(false);
    const [cetError, setCetError] = useState('');

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await api.get('/branches');
                if (res.data.success) setBranches(res.data.data);
            } catch (err) {
                toast.error('Failed to load branches');
            }
        };
        fetchBranches();
    }, []);

    // ── Aadhaar Debounced Check ────────────────────────────
    useEffect(() => {
        const checkAadhaarUniqueness = async () => {
            const val = data.aadhaar;
            if (!val || val.length !== 12 || isNaN(val)) {
                if (val && val.length > 0 && (val.length !== 12 || isNaN(val))) {
                    setAadhaarError('Aadhaar must be a 12-digit number');
                } else {
                    setAadhaarError('');
                }
                return;
            }

            setIsCheckingAadhaar(true);
            setAadhaarError('');

            try {
                const res = await api.post('/student/check-aadhaar', { aadhaar: val });
                if (res.data.exists) {
                    setAadhaarError('This Aadhaar is already registered with another application.');
                } else {
                    setAadhaarError('');
                }
            } catch (err) {
                console.error('Aadhaar check failed', err);
            } finally {
                setIsCheckingAadhaar(false);
            }
        };

        const timer = setTimeout(checkAadhaarUniqueness, 600);
        return () => clearTimeout(timer);
    }, [data.aadhaar]);

    // ── CET Number Debounced Check ─────────────────────────
    useEffect(() => {
        const checkCetUniqueness = async () => {
            const val = data.cetNumber || data.dcetNumber;
            const type = data.admissionType;

            if (!val || val.length < 3 || type === 'MANAGEMENT') {
                setCetError('');
                return;
            }

            setIsCheckingCet(true);
            setCetError('');

            try {
                const res = await api.post('/student/check-cet', { 
                    cetNumber: val,
                    type: type
                });
                if (res.data.exists) {
                    setCetError(`This ${type} registration number is already in use.`);
                } else {
                    setCetError('');
                }
            } catch (err) {
                console.error('CET check failed', err);
            } finally {
                setIsCheckingCet(false);
            }
        };

        const timer = setTimeout(checkCetUniqueness, 600);
        return () => clearTimeout(timer);
    }, [data.cetNumber, data.dcetNumber, data.admissionType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (aadhaarError || cetError) {
            toast.error('Please resolve the errors before proceeding.');
            return;
        }

        if (!data.aadhaar || data.aadhaar.length !== 12) {
            toast.error('Please enter a valid 12-digit Aadhaar number.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                admissionType: data.admissionType,
                branchId: data.branchId ? parseInt(data.branchId) : null,
                aadhaar: data.aadhaar,
                cetNumber: data.cetNumber,
                dcetNumber: data.dcetNumber
            };

            const res = await api.post('/student/create', payload);
            if (res.data.success) {
                toast.success('Admission info saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save admission info');
        } finally {
            setLoading(false);
        }
    };

    const isFormDisabled = loading || isCheckingAadhaar || isCheckingCet || !!aadhaarError || !!cetError;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-slate-900">Step 1: Admission Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Admission Type */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Admission Type <span className="text-red-500">*</span></label>
                    <select
                        required
                        className="input-premium h-11"
                        value={data.admissionType || ''}
                        onChange={(e) => updateData({ admissionType: e.target.value, cetNumber: '', dcetNumber: '' })}
                    >
                        <option value="" disabled>Select admission type...</option>
                        <option value="KCET">KCET (Karnataka Common Entrance Test)</option>
                        <option value="DCET">DCET (Diploma Entrance Test)</option>
                        <option value="MANAGEMENT">Management Quota</option>
                    </select>
                </div>

                {/* Preferred Branch */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Preferred Branch <span className="text-red-500">*</span></label>
                    <select
                        required
                        className="input-premium h-11"
                        value={data.branchId || ''}
                        onChange={(e) => updateData({ branchId: e.target.value })}
                    >
                        <option value="" disabled>Select preferred engineering branch...</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                        ))}
                    </select>
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Fingerprint size={16} className="text-slate-400" />
                        Aadhaar Number (UIDAI) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            required
                            type="text"
                            maxLength={12}
                            placeholder="12-digit Aadhaar Number"
                            className={`input-premium h-11 pr-10 ${
                                aadhaarError ? 'border-red-500 ring-red-50' : 
                                (data.aadhaar?.length === 12 && !isCheckingAadhaar) ? 'border-emerald-500 ring-emerald-50' : ''
                            }`}
                            value={data.aadhaar || ''}
                            onChange={(e) => updateData({ aadhaar: e.target.value.replace(/\D/g, '') })}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            {isCheckingAadhaar && <Loader2 size={18} className="animate-spin text-slate-400" />}
                            {!isCheckingAadhaar && data.aadhaar?.length === 12 && !aadhaarError && <CheckCircle2 size={18} className="text-emerald-500" />}
                            {!isCheckingAadhaar && aadhaarError && <XCircle size={18} className="text-red-500" />}
                        </div>
                    </div>
                    {aadhaarError ? (
                        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
                            <XCircle size={12} /> {aadhaarError}
                        </p>
                    ) : (
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Info size={12} /> Aadhaar is required to prevent duplicate application profiles.
                        </p>
                    )}
                </div>

                {/* KCET Number */}
                {data.admissionType === 'KCET' && (
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">KCET Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                className={`input-premium h-11 uppercase pr-10 ${cetError ? 'border-red-500' : ''}`}
                                value={data.cetNumber || ''}
                                onChange={(e) => updateData({ cetNumber: e.target.value.toUpperCase() })}
                                placeholder="e.g. 26QC001"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                {isCheckingCet && <Loader2 size={18} className="animate-spin text-slate-400" />}
                                {!isCheckingCet && data.cetNumber?.length > 3 && !cetError && <CheckCircle2 size={18} className="text-emerald-500" />}
                                {!isCheckingCet && cetError && <XCircle size={18} className="text-red-500" />}
                            </div>
                        </div>
                        {cetError && <p className="text-[11px] font-medium text-red-500">{cetError}</p>}
                    </div>
                )}

                {/* DCET Number */}
                {data.admissionType === 'DCET' && (
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">DCET Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                className={`input-premium h-11 uppercase pr-10 ${cetError ? 'border-red-500' : ''}`}
                                value={data.dcetNumber || ''}
                                onChange={(e) => updateData({ dcetNumber: e.target.value.toUpperCase() })}
                                placeholder="e.g. D1457"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                {isCheckingCet && <Loader2 size={18} className="animate-spin text-slate-400" />}
                                {!isCheckingCet && data.dcetNumber?.length > 3 && !cetError && <CheckCircle2 size={18} className="text-emerald-500" />}
                                {!isCheckingCet && cetError && <XCircle size={18} className="text-red-500" />}
                            </div>
                        </div>
                        {cetError && <p className="text-[11px] font-medium text-red-500">{cetError}</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center pt-6 border-t border-slate-100 mt-8">
                <button 
                    type="submit" 
                    disabled={isFormDisabled} 
                    className={`btn-primary h-11 px-8 ${isFormDisabled ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <span className="flex items-center gap-2">
                            Save & Continue
                            <ChevronRight size={16} />
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step1Admission;
