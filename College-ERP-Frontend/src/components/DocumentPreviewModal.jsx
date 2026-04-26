import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText, Loader2, ExternalLink } from 'lucide-react';

const DocumentPreviewModal = ({ isOpen, onClose, documentUrl, documentLabel }) => {
    const [zoom, setZoom] = useState(1);
    const [finalUrl, setFinalUrl] = useState('');

    useEffect(() => {
        if (!isOpen || !documentUrl) return;

        // Resolve full URL
        let url = documentUrl;
        if (!url.startsWith('http')) {
            url = `${window.location.protocol}//${window.location.hostname}:5000/${url.replace(/\\/g, '/')}`;
        }
        setFinalUrl(url);
    }, [documentUrl, isOpen]);

    if (!isOpen || !documentUrl) return null;

    const isPDF = finalUrl.includes("/raw/upload") || finalUrl.toLowerCase().endsWith(".pdf");

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">{documentLabel || 'Document Preview'}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Previewing uploaded file</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="uppercase text-[10px] tracking-wider text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                                {isPDF ? 'PDF' : 'IMAGE'}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isPDF && (
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 mr-2">
                                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="w-8 h-8 rounded-md text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900">
                                    <ZoomOut size={16} />
                                </button>
                                <span className="text-xs font-mono font-bold text-slate-600 w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
                                <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="w-8 h-8 rounded-md text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900">
                                    <ZoomIn size={16} />
                                </button>
                            </div>
                        )}
                        <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-50">
                            <ExternalLink size={14} className="text-slate-400" /> Open
                        </a>
                        <a href={finalUrl} download className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50">
                            <Download size={16} />
                        </a>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button onClick={onClose} className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-100/50 flex items-center justify-center min-h-[600px] relative">
                    {isPDF ? (
                        <div className="w-full h-full flex flex-col items-center gap-4">
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(finalUrl)}&embedded=true`}
                                width="100%"
                                height="600px"
                                title={documentLabel}
                                style={{ border: "none" }}
                            />
                            <div className="bg-white/80 backdrop-blur border border-slate-200 px-4 py-2 flex justify-between items-center w-full rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-red-500" />
                                    <span className="text-sm font-medium text-slate-600">PDF not loading?</span>
                                </div>
                                <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-md">
                                    Open in new tab <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center overflow-auto">
                            <img
                                src={finalUrl}
                                alt={documentLabel}
                                className="max-w-full rounded-lg shadow-lg transition-transform duration-300 bg-white"
                                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;
