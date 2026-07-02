"use client";

import React, { useState } from "react";
import { useUserStore } from "../../src/lib/store/authStore"; // Aapka Zustand store
import api from "../../src/lib/api"; // Aapka Axios instance
import { useRouter } from "next/navigation";
import { PlusCircle, FileText, IndianRupee, Video, Layers, Loader2, CheckCircle2 } from "lucide-react";

export default function page() {
    const router = useRouter();
    const { user, isLogin } = useUserStore();


    // console.log('userdatata', user.name
    // )

    // 1. Form Inputs State (Matching your Mongoose Schema)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        price: "",
        language: "English"
    });

    // 2. Video File & Upload States
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false); // Cloudinary status
    const [isSaving, setIsSaving] = useState(false); // Backend API status
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    // Inputs Handler
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Video Input Handler
    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setStatusMessage({ type: "", text: "" }); // clear previous error
        }
    };

    // ☁️ CORE LOGIC: Cloudinary Upload Function (with Live Progress)
    const uploadToCloudinary = (file) => {
        return new Promise((resolve, reject) => {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                reject("Cloudinary Environment Variables missing inside .env.local");
                return;
            }

            const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
            const xhr = new XMLHttpRequest();
            const fd = new FormData();


            fd.append("file", file);
            fd.append("upload_preset", uploadPreset);

            xhr.open("POST", url, true);

            // Live progress tracker percentage calculation
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url); // 👈 Yeh ha live Cloudinary Video URL
                } else {
                    reject("Cloudinary upload status failed. Check preset config.");
                }
            };

            xhr.onerror = () => reject("Network error while uploading to Cloudinary.");
            xhr.send(fd);
        });


    };

    // 🚀 Submit Form handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: "", text: "" });

        if (!isLogin) {
            setStatusMessage({ type: "error", text: "Please sign in to upload a course." });
            return;
        }

        if (!videoFile) {
            setStatusMessage({ type: "error", text: "Please select a course video file first." });
            return;
        }

        let liveVideoUrl = "";

        try {
            // STEP 1: Upload Video to Cloudinary First
            setIsUploading(true);
            setStatusMessage({ type: "info", text: "Uploading video to Cloudinary CDN..." });

            liveVideoUrl = await uploadToCloudinary(videoFile);


            console.log('datatat', liveVideoUrl)




            setIsUploading(false);

            // STEP 2: Save everything (Form data + Cloudinary URL + Instructor ID) to DB
            setIsSaving(true);
            setStatusMessage({ type: "info", text: "Video uploaded! Saving course metadata to database..." });

            const coursePayload = {
                title: formData.title,
                instructorname: user?.name,
                description: formData.description,
                category: formData.category,
                level: formData.level,
                language: formData.language,
                price: Number(formData.price) || 0,
                liveVideoUrl: liveVideoUrl, // 🔑 Cloudinary Video URL schema ke thumbnail section me save ho rha h
                instructor: user?.id || user?._id || user?.$id // 🔑 Auto user state inject
            };

            // Hit your express/next backend API
            const res = await api.post("/courses/create", coursePayload, {
                withCredentials: true
            });

            if (res?.data) {
                setStatusMessage({ type: "success", text: "🎉 Course published successfully! Redirecting..." });
                // Reset States
                setVideoFile(null);
                setUploadProgress(0);
                setFormData({ title: "", description: "", category: "", level: "beginner", price: "", language: "English" });

                // setTimeout(() => router.push("/dashboard"), 2500);
            }

        } catch (error) {
            console.error("Upload process failed:", error);
            setStatusMessage({
                type: "error",
                text: error.response?.data?.message || error || "Something went wrong."
            });
            setIsUploading(false);
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">

                {/* Heading */}
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                    <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                        <PlusCircle size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Upload New Course Material</h2>
                        <p className="text-xs text-slate-400">Direct CDN deployment for lag-free video streaming.</p>
                    </div>
                </div>

                {/* Status Messages */}
                {statusMessage.text && (
                    <div className={`p-4 rounded-xl text-xs font-medium border mb-6 ${statusMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        statusMessage.type === "info" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}>
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Course Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g., Python for Data Science" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} placeholder="What will students learn?" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                    </div>

                    {/* 🎥 Video Input Block */}
                    <div className="p-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/20 space-y-3">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Video Lecture</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl cursor-pointer border border-slate-700 transition-all">
                                <Video size={14} className="text-indigo-400" />
                                Browse File
                                <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                            </label>
                            <span className="text-xs text-slate-400 truncate max-w-xs">
                                {videoFile ? videoFile.name : "No local video selected yet"}
                            </span>
                        </div>

                        {/* Progress Monitoring Layout */}
                        {isUploading && (
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                                    <span>Uploading to Cloudinary CDN...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {!isUploading && uploadProgress === 100 && (
                            <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Video link verified & buffered.</p>
                        )}
                    </div>

                    {/* Meta Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase block mb-1.5">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required placeholder="e.g., Tech" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase block mb-1.5">Level</label>
                            <select name="level" value={formData.level} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase block mb-1.5">Price (INR)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    {/* Master CTA Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUploading || isSaving}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40 disabled:text-slate-500 text-white font-medium text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {isUploading || isSaving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Publish Course Material"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}