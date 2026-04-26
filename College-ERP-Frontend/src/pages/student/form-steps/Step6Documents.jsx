import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, UploadCloud, CheckCircle, FileText, User, Image, ClipboardIcon, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Step6Documents = ({ onNext, onPrev, data }) => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({});

    const DOCS = [
        { name: 'photo', label: 'Recent Passport Photo', icon: User, note: 'JPG/PNG, max 5MB' },
        { name: 'signature', label: 'E-Signature / Scanned Sign', icon: ClipboardIcon, note: 'JPG/PNG, max 2MB' },
        { name: 'sslcMarkscard', label: 'SSLC / 10th Marks Card', icon: FileText, note: 'PDF/JPG, max 5MB' },
        { name: 'pucMarkscard', label: 'PUC / Diploma Marks Card', icon: GraduationCap, note: 'PDF/JPG, max 5MB' },
        { name: 'casteCertificate', label: 'Caste Certificate', icon: Image, note: 'PDF/JPG (Optional)' },
        { name: 'incomeCertificate', label: 'Income Certificate', icon: Image, note: 'PDF/JPG (Optional)' },
        { name: 'studyCertificate', label: '7 Years Study Certificate', icon: FileText, note: 'PDF/JPG, max 5MB' },
    ];

    const handleFileChange = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setFiles(prev => ({ ...prev, [docName]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPhotoPresent = files.photo || data?.photo;
        const isSignaturePresent = files.signature || data?.signature;
        const isSslcPresent = files.sslcMarkscard || data?.sslcMarkscard;

        if (!isPhotoPresent || !isSignaturePresent || !isSslcPresent) {
            toast.error('Photo, Signature, and SSLC marks card are required');
            return;
        }

        if (Object.keys(files).length === 0) {
            onNext();
            return;
        }

        setLoading(true);
        const formData = new FormData();
        Object.keys(files).forEach(key => {
            formData.append(key, files[key]);
        });

        try {
            const res = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success('Documents uploaded successfully!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload documents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-slate-900">Step 6: Document Upload</h2>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-xs font-semibold">
                    Document Verification
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCS.map(doc => {
                    const isFileSelected = !!files[doc.name];
                    const isFileInDb = !!data?.[doc.name];
                    const isComplete = isFileSelected || isFileInDb;
                    const isRequired = ['photo', 'signature', 'sslcMarkscard'].includes(doc.name);

                    return (
                        <div key={doc.name} className={`p-4 rounded-lg border transition-all ${isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-primary-300'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {isComplete ? <CheckCircle size={18} /> : <doc.icon size={18} />}
                                </div>
                                {isRequired && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${isComplete ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white'}`}>
                                        {isComplete ? 'Uploaded' : 'Required'}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{doc.label}</h3>
                            <p className="text-xs text-slate-500 mb-3">{doc.note}</p>

                            <label className="block w-full cursor-pointer">
                                <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-dashed transition-colors text-sm ${isComplete ? 'bg-white border-green-200 text-green-600 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600'}`}>
                                    <UploadCloud size={16} />
                                    {isComplete ? 'Update File' : 'Choose File'}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => handleFileChange(e, doc.name)}
                                />
                            </label>

                            {(isFileSelected || isFileInDb) && (
                                <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-white rounded border border-slate-100">
                                    <FileText size={12} className="text-primary-600" />
                                    <p className="text-[11px] font-medium text-slate-600 truncate">
                                        {isFileSelected ? files[doc.name].name : 'Previously uploaded'}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
                <button type="button" onClick={onPrev} className="btn-secondary h-10 px-5 flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary h-10 px-6 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Upload & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step6Documents;
