"use client";

import { useState, useRef } from "react";
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    Loader2,
    ExternalLink,
    Copy,
    Shield,
    Database,
    Zap,
    Sparkles,
    ArrowLeft,
    Home,
    Layers,
    Clock,
    AlertCircle
} from "lucide-react";
import api from "../../../src/lib/api";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../src/lib/store/authStore";

export default function Page() {
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();


    const { user } = useUserStore();


    console.log('userdtat', user);

    const uploadPdf = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("❌ Please upload a PDF file only.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            alert("❌ File size must be under 50MB.");
            return;
        }

        setFileName(file.name);
        setFileSize((file.size / (1024 * 1024)).toFixed(2));
        setLoading(true);
        setLoadingStatus("📤 Uploading to Cloudinary...");
        setUploadProgress(0);
        setPdfUrl("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pdf_upload");
        formData.append("resource_type", "raw");

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            // 1. Upload PDF to Cloudinary
            const cloudinaryRes = await fetch(
                "https://api.cloudinary.com/v1_1/dsmcyigy6/raw/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const cloudinaryData = await cloudinaryRes.json();
            clearInterval(progressInterval);
            setUploadProgress(95);

            if (!cloudinaryData.secure_url) {
                alert("❌ Cloudinary Upload Failed!");
                setLoading(false);
                setUploadProgress(0);
                return;
            }

            console.log("PDF Cloudinary URL:", cloudinaryData.secure_url);

            // 2. RAG Processing
            setLoadingStatus("🧠 Indexing in RAG Pipeline...");
            setUploadProgress(98);

            const { data: ragData } = await api.post("/rag/upload", {
                pdfUrl: cloudinaryData.secure_url,
                adminId: user?._id || "unknown_admin",
            });

            console.log("RAG Response:", ragData);

            if (ragData.success) {
                setPdfUrl(cloudinaryData.secure_url);
                setUploadProgress(100);
                setLoadingStatus("✅ Successfully Indexed!");

                // Show success message
                setTimeout(() => {
                    setLoadingStatus("");
                }, 2000);
            } else {
                alert(
                    `⚠️ Cloudinary upload successful, but RAG indexing failed: ${ragData.message || "Unknown Error"}`
                );
                setLoading(false);
                setUploadProgress(0);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong!"
            );
            setLoading(false);
            setUploadProgress(0);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setUploadProgress(0);
            }, 1500);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            // Trigger upload with the dropped file
            const inputEvent = { target: { files: [file] } };
            uploadPdf(inputEvent);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">

            {/* Top Navigation */}
            <div className="border-b border-slate-800/60 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => router.push('/admin')}
                                className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <Home size={18} className="sm:size-20" />
                            </button>
                            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                                    <Shield size={16} className="sm:size-18" />
                                </div>
                                <div>
                                    <h1 className="text-sm sm:text-base font-bold text-white">Policy Upload</h1>
                                    <p className="text-[10px] sm:text-xs text-slate-400">Admin • RAG Document Management</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] sm:text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 border border-indigo-500/20">
                        <Sparkles size={12} className="sm:size-14" />
                        RAG Pipeline
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                        Upload Refund Policy
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
                        Upload your policy documents to the RAG database for AI-powered admin assistance
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-sm">

                    {/* Upload Area */}
                    <div
                        onClick={() => !loading && fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-2xl sm:rounded-3xl 
                            flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 
                            text-center transition-all duration-300
                            ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : ''}
                            ${loading
                                ? 'border-slate-700 bg-slate-800/20 cursor-not-allowed'
                                : pdfUrl
                                    ? 'border-emerald-500/50 bg-emerald-500/5 cursor-pointer hover:border-emerald-400/70'
                                    : 'border-slate-700 bg-slate-800/40 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/60'
                            }
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={uploadPdf}
                            disabled={loading}
                            hidden
                        />

                        {loading ? (
                            <div className="flex flex-col items-center w-full max-w-md">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-700 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-spin" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <Zap size={12} className="text-white" />
                                    </div>
                                </div>

                                <span className="text-sm font-semibold text-slate-200 mt-4">{loadingStatus}</span>

                                {/* Progress Bar */}
                                <div className="w-full mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 mt-1.5">{uploadProgress}%</span>

                                <span className="text-xs text-slate-500 mt-2 truncate max-w-[200px] sm:max-w-[300px]">
                                    📄 {fileName}
                                </span>
                            </div>
                        ) : pdfUrl ? (
                            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
                                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                                </div>
                                <span className="text-lg font-bold text-emerald-400 mt-4">Upload Complete!</span>
                                <span className="text-sm text-slate-300 mt-1">{fileName}</span>
                                <span className="text-xs text-slate-500 mt-0.5">{fileSize} MB • Indexed in RAG</span>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                    <Database size={14} className="text-indigo-400" />
                                    <span>Ready for AI queries</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 border-2 border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                    <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <span className="text-base font-semibold text-slate-200">
                                    {isDragging ? 'Drop your PDF here' : 'Drop your PDF here or click to browse'}
                                </span>
                                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <FileText size={12} />
                                    PDF up to 50MB
                                </span>
                                <div className="flex items-center gap-3 mt-4 text-[10px] text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Layers size={12} className="text-slate-600" />
                                        Auto-indexed
                                    </span>
                                    <span className="w-px h-3 bg-slate-700"></span>
                                    <span className="flex items-center gap-1">
                                        <Zap size={12} className="text-slate-600" />
                                        RAG Ready
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* URL Section - Show after successful upload */}
                    {pdfUrl && !loading && (
                        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl sm:rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                                <span>Document URL</span>
                                <span className="w-px h-3 bg-slate-700"></span>
                                <span className="text-emerald-400 font-normal uppercase">✓ Indexed</span>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-700/50 group">
                                <span className="text-[10px] sm:text-xs text-slate-400 font-mono truncate select-all flex-1">
                                    {pdfUrl}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(pdfUrl);
                                        // Show toast or feedback
                                        const btn = document.getElementById('copy-btn');
                                        if (btn) {
                                            btn.innerHTML = '✓';
                                            setTimeout(() => {
                                                btn.innerHTML = '📋';
                                            }, 2000);
                                        }
                                    }}
                                    id="copy-btn"
                                    className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition shrink-0"
                                    title="Copy URL"
                                >
                                    📋
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
                                >
                                    <ExternalLink size={14} />
                                    <span>View Document</span>
                                </a>
                                <button
                                    onClick={() => {
                                        setPdfUrl("");
                                        setFileName("");
                                        setFileSize("");
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-all border border-slate-700 active:scale-[0.98]"
                                >
                                    <UploadCloud size={14} />
                                    <span>Upload Another</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info Footer */}
                    <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-xs text-slate-500 border-t border-slate-800/60 pt-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Shield size={12} className="text-indigo-400" />
                                Secure
                            </span>
                            <span className="w-px h-3 bg-slate-700"></span>
                            <span className="flex items-center gap-1">
                                <Database size={12} className="text-violet-400" />
                                RAG Ready
                            </span>
                            <span className="w-px h-3 bg-slate-700"></span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} className="text-slate-500" />
                                Auto-indexed
                            </span>
                        </div>
                        <span className="text-slate-600">
                            {fileName ? `📄 ${fileName}` : 'Ready to upload'}
                        </span>
                    </div>
                </div>

                {/* Guidelines Card */}
                <div className="mt-4 sm:mt-6 bg-slate-900/40 border border-slate-800/40 rounded-xl p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <AlertCircle size={14} className="text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-white">Upload Guidelines</h4>
                            <ul className="text-[10px] sm:text-xs text-slate-400 mt-1 space-y-0.5">
                                <li>• Upload PDF documents only (max 50MB)</li>
                                <li>• Document will be automatically indexed in RAG database</li>
                                <li>• Once indexed, AI agent can query this document</li>
                                <li>• Supports multiple documents for policy management</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}