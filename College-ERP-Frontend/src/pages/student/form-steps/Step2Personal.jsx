import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Step2Personal = ({ onNext, onPrev, data, updateData }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...data };
            payload.studiedInKarnataka = payload.studiedInKarnataka === 'true' || payload.studiedInKarnataka === true;

            if (payload.dateOfBirth && payload.dateOfBirth.includes('/')) {
                const parts = payload.dateOfBirth.split('/');
                if (parts.length === 3) {
                    const [d, m, y] = parts;
                    const fullYear = y.length === 2 ? `20${y}` : y;
                    payload.dateOfBirth = `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                }
            }

            const parsedDate = new Date(payload.dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                setLoading(false);
                return toast.error("Invalid Date of Birth. Please check the format (DD/MM/YYYY).");
            }

            const res = await api.post('/personal/add', payload);
            if (res.data.success) {
                toast.success('Personal details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save personal details');
        } finally {
            setLoading(false);
        }
    };

    const formatDOB = (value) => {
        const d = value.replace(/\D/g, '').slice(0, 8);
        if (d.length <= 2) return d;
        if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
        return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    };

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'dateOfBirth') {
            value = formatDOB(value);
        }
        updateData({ [e.target.name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-slate-900">Step 2: Personal Details</h2>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-xs font-semibold">
                    Basic Information
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Full Name (As per SSLC) <span className="text-red-500">*</span></label>
                    <input required type="text" name="fullName" className="input-premium h-11 uppercase" value={data.fullName || ''} onChange={handleChange} placeholder="e.g. ARIHANT DESAI" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
                    <select required name="gender" className="input-premium h-11" value={data.gender || ''} onChange={handleChange}>
                        <option value="" disabled>Select gender...</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="text"
                        name="dateOfBirth"
                        className="input-premium h-11"
                        value={data.dateOfBirth || ''}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                    <select required name="category" className="input-premium h-11" value={data.category || ''} onChange={handleChange}>
                        <option value="" disabled>Select Category</option>
                        {['GM', 'OBC', 'SC', 'ST', '2A', '2B', '3A', '3B', 'Category 1', 'Others'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Religion <span className="text-red-500">*</span></label>
                    <select required name="religion" className="input-premium h-11" value={data.religion || ''} onChange={handleChange}>
                        <option value="" disabled>Select religion...</option>
                        {['HINDU', 'MUSLIM', 'CHRISTIAN', 'JAIN', 'SIKH', 'BUDDHIST', 'OTHER'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nationality <span className="text-red-500">*</span></label>
                    <select required name="nationality" className="input-premium h-11" value={data.nationality || ''} onChange={handleChange}>
                        <option value="" disabled>Select nationality...</option>
                        <option value="INDIAN">Indian</option>
                        <option value="NRI">NRI</option>
                        <option value="FOREIGN">Foreign</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Area Type <span className="text-red-500">*</span></label>
                    <select required name="areaType" className="input-premium h-11" value={data.areaType || ''} onChange={handleChange}>
                        <option value="" disabled>Select area type...</option>
                        <option value="URBAN">Urban</option>
                        <option value="RURAL">Rural</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Karnataka Resident (7yrs) <span className="text-red-500">*</span></label>
                    <select required name="studiedInKarnataka" className="input-premium h-11" value={data.studiedInKarnataka !== undefined ? String(data.studiedInKarnataka) : ''} onChange={handleChange}>
                        <option value="" disabled>Select...</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm text-red-800 font-medium">
                    <strong>Note:</strong> Your application will be rejected if you submit incorrect personal details. Please double-check your name and DOB as per SSLC records.
                </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn-secondary h-10 px-5 flex items-center gap-2"
                >
                    <ChevronLeft size={16} />
                    Back
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary h-10 px-6 flex items-center gap-2"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Save & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step2Personal;
