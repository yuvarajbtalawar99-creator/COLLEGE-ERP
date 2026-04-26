import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Step3Parent = ({ onNext, onPrev, data, updateData }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...data };
            if (payload.annualIncome) {
                payload.annualIncome = parseFloat(payload.annualIncome);
            }

            const res = await api.post('/parent/add', payload);
            if (res.data.success) {
                toast.success('Parent details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save parent details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-slate-900">Step 3: Parent Information</h2>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-xs font-semibold">
                    Parent Details
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Father's Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="fatherName" className="input-premium h-11" value={data.fatherName || ''} onChange={handleChange} placeholder="e.g. Mr. Smith" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Mother's Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="motherName" className="input-premium h-11" value={data.motherName || ''} onChange={handleChange} placeholder="e.g. Mrs. Smith" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Parent Mobile No. <span className="text-red-500">*</span></label>
                    <input required type="tel" name="parentMobile" className="input-premium h-11" value={data.parentMobile || ''} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Parent Email ID</label>
                    <input type="email" name="parentEmail" className="input-premium h-11" value={data.parentEmail || ''} onChange={handleChange} placeholder="parent@example.com" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Father's Occupation <span className="text-red-500">*</span></label>
                    <input required type="text" name="occupation" className="input-premium h-11" value={data.occupation || ''} onChange={handleChange} placeholder="Profession / Business" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Annual Income (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                        <input required type="number" min="0" name="annualIncome" className="input-premium pl-8 h-11" value={data.annualIncome || ''} onChange={handleChange} placeholder="5,00,000" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
                <button type="button" onClick={onPrev} className="btn-secondary h-10 px-5 flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary h-10 px-6 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Save & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step3Parent;
