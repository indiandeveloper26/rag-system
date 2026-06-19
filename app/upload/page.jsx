"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, ExternalLink, Copy } from "lucide-react";

export default function Page() {
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(""); // Processing state text ko dynamic rakhne ke liye
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const fileInputRef = useRef(null);

    const uploadPdf = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("PDF only");
            return;
        }

        // UI state updates
        setFileName(file.name);
        setFileSize((file.size / (1024 * 1024)).toFixed(2));
        setLoading(true);
        setLoadingStatus("Cloudinary par upload ho raha hai..."); // 1st Step text
        setPdfUrl("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pdf_upload");
        formData.append("resource_type", "raw");

        try {
            // 1. Cloudinary Upload Request
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dsmcyigy6/raw/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.secure_url) {
                console.log("PDF Cloudinary URL:", data.secure_url);

                // State update: Status badal kar RAG indexing loading text show karega
                setLoadingStatus("RAG Pipeline me index ho raha hai...");

                // 2. Local RAG API Call (Ab ye request loading block ke andar hi wait karegi)
                const ragRes = await fetch(
                    "http://localhost:5000/ai",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pdfUrl: data?.secure_url,
                        }),
                    }
                );

                const ragData = await ragRes.json();
                console.log("RAG Response:", ragData);

                if (ragData.success) {
                    // Jab dono API hit ho jayengi, tabhi URL set hoga aur success UI dikhega
                    setPdfUrl(data.secure_url);
                } else {
                    alert("Cloudinary upload ho gaya, par RAG pipeline me indexing fail ho gayi: " + (ragData.message || "Error"));
                }
            } else {
                alert("Cloudinary Upload failed! Configuration check karein.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong during the pipeline integration!");
        } finally {
            // End loading only when everything finishes
            setLoading(false);
            setLoadingStatus("");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">

                {/* Glow Effect Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        RAG PDF Uploader
                    </h1>
                    <p className="text-zinc-500 text-xs mt-1">Upload files directly to Cloudinary & Index into RAG pipeline</p>
                </div>

                {/* Dynamic Drag/Drop & Status Box */}
                <div className="mb-6">
                    <div
                        onClick={() => !loading && fileInputRef.current?.click()}
                        className={`h-[240px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all duration-300
              ${loading
                                ? "border-zinc-700 bg-zinc-800/20 cursor-not-allowed"
                                : pdfUrl
                                    ? "border-emerald-500/50 bg-emerald-500/5 cursor-pointer"
                                    : "border-zinc-700 bg-zinc-800/40 hover:border-red-500/50 cursor-pointer group"
                            }`}
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
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-3" />
                                <span className="text-sm font-semibold text-zinc-200">{loadingStatus}</span>
                                <span className="text-xs text-zinc-500 mt-1 truncate max-w-[240px]">{fileName}</span>
                            </div>
                        ) : pdfUrl ? (
                            <div className="flex flex-col items-center animate-fade-in">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                                <span className="text-sm font-semibold text-emerald-400">Successfully Uploaded & Indexed!</span>
                                <span className="text-xs text-zinc-400 mt-1 truncate max-w-[240px] font-medium">{fileName}</span>
                                <span className="text-[10px] text-zinc-500 mt-0.5">{fileSize} MB</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-red-500 transition-colors duration-300 mb-3" />
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                                    Click to select PDF
                                </span>
                                <span className="text-xs text-zinc-500 mt-1">Standard PDF up to 50MB</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Response URL Section */}
                {pdfUrl && !loading && (
                    <div className="p-4 bg-zinc-800/40 border border-zinc-800 rounded-2xl animate-fade-in space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                            <FileText className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Cloudinary Resource Link</span>
                        </div>

                        <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 shadow-inner group">
                            <span className="text-xs text-zinc-400 font-mono truncate pr-4 select-all">
                                {pdfUrl}
                            </span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(pdfUrl);
                                    alert("Copied to clipboard!");
                                }}
                                className="text-zinc-400 hover:text-white p-1.5 hover:bg-zinc-800 rounded-lg transition shrink-0"
                                title="Copy Link"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="pt-1 flex items-center justify-center">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-2 px-4 rounded-xl transition-all shadow-sm w-full justify-center border border-zinc-700"
                            >
                                <span>View Document</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

