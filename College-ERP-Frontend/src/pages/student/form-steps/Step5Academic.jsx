import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight, School, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const boardMaxMarksMap = {
    KSEAB: 625,
    CBSE: 500
};

const Step5Academic = ({ onNext, onPrev, data, updateData }) => {
    const [loading, setLoading] = useState(false);
    const [sslcMarksError, setSslcMarksError] = useState('');
    const [pucMarksError, setPucMarksError] = useState({});
    const [hasDiploma, setHasDiploma] = useState(!!(data.diplomaUniversity || data.diplomaFinalYearObtained));
    const [diplomaMarksError, setDiplomaMarksError] = useState('');

    const calculateSSLC = (updatedData = data) => {
        const obtained = parseFloat(updatedData.sslcMarksObtained) || 0;
        const max = parseFloat(updatedData.sslcMaxMarks) || 0;
        if (max > 0) {
            const perc = (obtained / max) * 100;
            updateData({ sslcPercentage: perc.toFixed(2) });
        }
    };

    const calculatePUC = (updatedData = data) => {
        const phys = parseFloat(updatedData.physicsMarks) || 0;
        const math = parseFloat(updatedData.mathsMarks) || 0;
        const opt = parseFloat(updatedData.optionalMarks) || 0;
        const max = 300;

        const agg = phys + math + opt;
        const perc = (agg / max) * 100;
        updateData({
            pucAggregate: agg,
            pucPercentage: perc.toFixed(2),
            pucMaxMarks: max
        });
    };

    const calculateDiploma = (updatedData = data) => {
        const obtained = parseFloat(updatedData.diplomaFinalYearObtained) || 0;
        const max = 800;
        const perc = (obtained / max) * 100;
        updateData({ diplomaPercentage: perc.toFixed(2), diplomaFinalYearMaxMarks: max });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sslcMarksError) {
            toast.error('Please fix SSLC marks errors before submitting.');
            return;
        }
        if (Object.values(pucMarksError).some(e => e)) {
            toast.error('Please fix PUC marks errors before submitting.');
            return;
        }
        if (hasDiploma && diplomaMarksError) {
            toast.error('Please fix Diploma marks errors before submitting.');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                sslcBoard: data.sslcBoard,
                sslcYear: parseInt(data.sslcYear),
                sslcRegisterNumber: data.sslcRegisterNumber,
                sslcMarksObtained: parseFloat(data.sslcMarksObtained),
                sslcMaxMarks: parseFloat(data.sslcMaxMarks),
                sslcPercentage: parseFloat(data.sslcPercentage),
                sslcAttempts: parseInt(data.sslcAttempts),
                pucBoard: data.pucBoard || undefined,
                pucYear: data.pucYear ? parseInt(data.pucYear) : undefined,
                pucRegisterNumber: data.pucRegisterNumber || undefined,
                physicsMarks: data.physicsMarks ? parseFloat(data.physicsMarks) : undefined,
                mathsMarks: data.mathsMarks ? parseFloat(data.mathsMarks) : undefined,
                optionalSubject: data.optionalSubject || undefined,
                optionalMarks: data.optionalMarks ? parseFloat(data.optionalMarks) : undefined,
                pucMaxMarks: data.pucMaxMarks ? parseFloat(data.pucMaxMarks) : undefined,
                pucAggregate: data.pucAggregate ? parseFloat(data.pucAggregate) : undefined,
                pucPercentage: data.pucPercentage ? parseFloat(data.pucPercentage) : undefined,
                pucAttempts: data.pucAttempts ? parseInt(data.pucAttempts) : undefined,
                diplomaUniversity: data.diplomaUniversity || undefined,
                diplomaYear: data.diplomaYear ? parseInt(data.diplomaYear) : undefined,
                diplomaRegisterNumber: data.diplomaRegisterNumber || undefined,
                diplomaFinalYearMaxMarks: data.diplomaFinalYearMaxMarks ? parseFloat(data.diplomaFinalYearMaxMarks) : undefined,
                diplomaFinalYearObtained: data.diplomaFinalYearObtained ? parseFloat(data.diplomaFinalYearObtained) : undefined,
                diplomaPercentage: data.diplomaPercentage ? parseFloat(data.diplomaPercentage) : undefined,
                diplomaAttempts: data.diplomaAttempts ? parseInt(data.diplomaAttempts) : undefined,
            };

            const res = await api.post('/academic/add', payload);
            if (res.data.success) {
                toast.success('Academic details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save academic details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };

        // When board changes, auto-set max marks and reset obtained/percentage
        if (name === 'sslcBoard') {
            const maxMarks = boardMaxMarksMap[value] || '';
            updatedFields.sslcMaxMarks = maxMarks;
            updatedFields.sslcMarksObtained = data.sslcMarksObtained || '';
            updateData(updatedFields);
            setSslcMarksError('');
            const combinedData = { ...data, ...updatedFields };
            calculateSSLC(combinedData);
            return;
        }

        // Validate marks obtained against max marks
        if (name === 'sslcMarksObtained') {
            const obtained = parseFloat(value);
            const max = parseFloat(data.sslcMaxMarks) || 0;
            if (value !== '' && obtained < 0) {
                setSslcMarksError('Marks cannot be negative');
            } else if (value !== '' && max > 0 && obtained > max) {
                setSslcMarksError(`Marks cannot exceed Max Marks (${max})`);
            } else {
                setSslcMarksError('');
            }
        }

        updateData(updatedFields);

        const combinedData = { ...data, ...updatedFields };
        if (name === 'sslcMarksObtained') {
            calculateSSLC(combinedData);
        } else if (name === 'diplomaFinalYearObtained') {
            // Validate diploma marks
            const obtained = parseFloat(value);
            if (value !== '' && obtained < 0) {
                setDiplomaMarksError('Marks cannot be negative');
            } else if (value !== '' && obtained > 800) {
                setDiplomaMarksError('Marks cannot exceed Max Marks (800)');
            } else {
                setDiplomaMarksError('');
            }
            calculateDiploma(combinedData);
        }
    };

    const handlePucChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };

        // Validate individual marks (0-100)
        if (['physicsMarks', 'mathsMarks', 'optionalMarks'].includes(name)) {
            const marks = parseFloat(value);
            const fieldLabel = name === 'physicsMarks' ? 'Physics' : name === 'mathsMarks' ? 'Maths' : (data.optionalSubject || 'Optional');
            if (value !== '' && marks < 0) {
                setPucMarksError(prev => ({ ...prev, [name]: `${fieldLabel} marks cannot be negative` }));
            } else if (value !== '' && marks > 100) {
                setPucMarksError(prev => ({ ...prev, [name]: `${fieldLabel} marks cannot exceed 100` }));
            } else {
                setPucMarksError(prev => ({ ...prev, [name]: '' }));
            }
        }

        // When optional subject changes, reset optional marks
        if (name === 'optionalSubject') {
            updatedFields.optionalMarks = data.optionalMarks || '';
            setPucMarksError(prev => ({ ...prev, optionalMarks: '' }));
        }

        updateData(updatedFields);
        calculatePUC({ ...data, ...updatedFields });
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }) => (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5 mt-8 first:mt-0">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <Icon size={18} />
            </div>
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            {/* SSLC Section */}
            <div>
                <SectionHeader icon={School} title="SSLC (10th Standard) Details" subtitle="Secondary education academic records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board <span className="text-red-500">*</span></label>
                        <select required name="sslcBoard" className="input-premium h-11" value={data.sslcBoard || ''} onChange={handleChange}>
                            <option value="" disabled>Select Board...</option>
                            <option value="KSEAB">KSEAB</option>
                            <option value="CBSE">CBSE</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcYear" className="input-premium h-11" value={data.sslcYear || ''} onChange={handleChange} placeholder="2021" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number <span className="text-red-500">*</span></label>
                        <input required type="text" name="sslcRegisterNumber" className="input-premium h-11 uppercase" value={data.sslcRegisterNumber || ''} onChange={handleChange} placeholder="e.g. 1234567" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Max Marks <span className="text-red-500">*</span></label>
                        <input readOnly type="number" name="sslcMaxMarks" className="input-premium h-11 bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600 font-semibold" value={data.sslcMaxMarks || ''} placeholder="Select board first" />
                        <p className="text-[11px] text-slate-400">Auto-filled based on selected board</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Marks Obtained <span className="text-red-500">*</span></label>
                        <input
                            required
                            type="number"
                            name="sslcMarksObtained"
                            className={`input-premium h-11 ${sslcMarksError ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            value={data.sslcMarksObtained || ''}
                            onChange={handleChange}
                            placeholder="580"
                            min="0"
                            max={data.sslcMaxMarks || undefined}
                        />
                        {sslcMarksError && (
                            <p className="text-xs text-red-500 font-medium">{sslcMarksError}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="sslcPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.sslcPercentage || ''} placeholder="0.00" />
                        <p className="text-[11px] text-slate-400">Percentage is auto-calculated</p>
                    </div>
                </div>
            </div>

            {/* PUC Details */}
            <div>
                <SectionHeader icon={GraduationCap} title="PUC (12th Standard) Details" subtitle="Optional — Senior secondary records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board <span className="text-red-500">*</span></label>
                        <select required name="pucBoard" className="input-premium h-11" value={data.pucBoard || ''} onChange={handleChange}>
                            <option value="" disabled>Select Board...</option>
                            <option value="PUE">PUC (Karnataka Board)</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                        </select>
                        <p className="text-[11px] text-slate-400">Select your 12th board</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing</label>
                        <input type="number" name="pucYear" className="input-premium h-11" value={data.pucYear || ''} onChange={handleChange} placeholder="2023" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number</label>
                        <input type="text" name="pucRegisterNumber" className="input-premium h-11 uppercase" value={data.pucRegisterNumber || ''} onChange={handleChange} placeholder="7654321" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Physics Marks <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="physicsMarks"
                            className={`input-premium h-11 ${pucMarksError.physicsMarks ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            value={data.physicsMarks || ''}
                            onChange={handlePucChange}
                            placeholder="e.g. 95"
                            min="0"
                            max="100"
                        />
                        {pucMarksError.physicsMarks && (
                            <p className="text-xs text-red-500 font-medium">{pucMarksError.physicsMarks}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Maths Marks <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="mathsMarks"
                            className={`input-premium h-11 ${pucMarksError.mathsMarks ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            value={data.mathsMarks || ''}
                            onChange={handlePucChange}
                            placeholder="e.g. 98"
                            min="0"
                            max="100"
                        />
                        {pucMarksError.mathsMarks && (
                            <p className="text-xs text-red-500 font-medium">{pucMarksError.mathsMarks}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Optional Subject <span className="text-red-500">*</span></label>
                        <select
                            name="optionalSubject"
                            className="input-premium h-11"
                            value={data.optionalSubject || ''}
                            onChange={handlePucChange}
                        >
                            <option value="" disabled>Select Optional Subject...</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Biology">Biology</option>
                        </select>
                        <p className="text-[11px] text-slate-400">Select one optional subject (Chemistry / Biology / CS)</p>
                    </div>
                    {data.optionalSubject && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">{data.optionalSubject} Marks <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="optionalMarks"
                                className={`input-premium h-11 ${pucMarksError.optionalMarks ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                value={data.optionalMarks || ''}
                                onChange={handlePucChange}
                                placeholder={`e.g. 96`}
                                min="0"
                                max="100"
                            />
                            {pucMarksError.optionalMarks && (
                                <p className="text-xs text-red-500 font-medium">{pucMarksError.optionalMarks}</p>
                            )}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="pucPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.pucPercentage || ''} placeholder="0.00" />
                        <p className="text-[11px] text-slate-400">Percentage is auto-calculated (PCM / 300 × 100)</p>
                    </div>
                </div>
            </div>

            {/* Diploma Details */}
            <div>
                <SectionHeader icon={BookOpen} title="Diploma Details" subtitle="Optional — Vocational education records" />

                <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors mb-5">
                    <input
                        type="checkbox"
                        checked={hasDiploma}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setHasDiploma(checked);
                            if (checked) {
                                updateData({
                                    diplomaUniversity: 'DTE',
                                    diplomaFinalYearMaxMarks: 800
                                });
                            } else {
                                updateData({
                                    diplomaUniversity: '',
                                    diplomaYear: '',
                                    diplomaRegisterNumber: '',
                                    diplomaFinalYearMaxMarks: '',
                                    diplomaFinalYearObtained: '',
                                    diplomaPercentage: '',
                                    diplomaAttempts: ''
                                });
                                setDiplomaMarksError('');
                            }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-700">I have Diploma qualification</span>
                </label>

                {hasDiploma && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Board <span className="text-red-500">*</span></label>
                            <select name="diplomaUniversity" className="input-premium h-11 bg-slate-50 cursor-not-allowed" value={data.diplomaUniversity || 'DTE'} disabled>
                                <option value="DTE">DTE (Department of Technical Education)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Diploma Type <span className="text-red-500">*</span></label>
                            <select className="input-premium h-11 bg-slate-50 cursor-not-allowed" value="Polytechnic" disabled>
                                <option value="Polytechnic">Polytechnic (Diploma)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Year of Passing <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                name="diplomaYear"
                                className="input-premium h-11"
                                value={data.diplomaYear || ''}
                                onChange={handleChange}
                                placeholder="e.g. 2023"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Register Number <span className="text-red-500">*</span></label>
                            <input required type="text" name="diplomaRegisterNumber" className="input-premium h-11 uppercase" value={data.diplomaRegisterNumber || ''} onChange={handleChange} placeholder="e.g. D12345" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Final Year Max Marks <span className="text-red-500">*</span></label>
                            <input readOnly type="number" name="diplomaFinalYearMaxMarks" className="input-premium h-11 bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600 font-semibold" value={800} />
                            <p className="text-[11px] text-slate-400">Fixed at 800 for Polytechnic Diploma</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Marks Obtained (Final Year) <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                name="diplomaFinalYearObtained"
                                className={`input-premium h-11 ${diplomaMarksError ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                value={data.diplomaFinalYearObtained || ''}
                                onChange={handleChange}
                                placeholder="e.g. 650"
                                min="0"
                                max="800"
                            />
                            {diplomaMarksError && (
                                <p className="text-xs text-red-500 font-medium">{diplomaMarksError}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                            <input readOnly type="number" step="0.01" name="diplomaPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.diplomaPercentage || ''} placeholder="0.00" />
                            <p className="text-[11px] text-slate-400">Percentage is auto-calculated</p>
                        </div>
                    </div>
                )}
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

export default Step5Academic;
