"use client";
import { useState } from "react";
import {
    BookOpen,
    Layers,
    DollarSign,
    Globe,
    Image as ImageIcon,
    FileText,
    Clock,
    PlusCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function CourseUploadPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        category: "",
        level: "beginner",
        price: "",
        language: "",
        totalLessons: "",
        totalDuration: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch("http://localhost:5000/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    totalLessons: Number(formData.totalLessons) || 0,
                    totalDuration: Number(formData.totalDuration) || 0,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Awesome! Your course has been published successfully. 🎉" });
                setFormData({
                    title: "", description: "", thumbnail: "", category: "",
                    level: "beginner", price: "", language: "", totalLessons: "", totalDuration: ""
                });
            } else {
                setMessage({ type: "error", text: data.message || "Something went wrong" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to connect to backend server. Make sure it is running!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                    <div className="flex items-center gap-3">
                        <PlusCircle className="w-8 h-8 text-blue-200" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
                            <p className="text-blue-100 text-sm mt-1">Fill in the details below to upload and publish your curriculum.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Dynamic Status Notification */}
                    {message.text && (
                        <div className={`p-4 mb-6 rounded-xl border flex items-start gap-3 transition-all duration-300 ${message.type === "success"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-rose-50 border-rose-200 text-rose-800"
                            }`}>
                            {message.type === "success" ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Course Title */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <BookOpen className="w-4 h-4 text-slate-400" /> Course Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text" name="title" required value={formData.title} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                placeholder="e.g. Full-Stack Web Development Bootcamp"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <FileText className="w-4 h-4 text-slate-400" /> Course Description <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                name="description" required rows="4" value={formData.description} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                                placeholder="Describe what milestones and skills students will achieve in this course..."
                            />
                        </div>

                        {/* Two-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Layers className="w-4 h-4 text-slate-400" /> Category <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text" name="category" required value={formData.category} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    placeholder="e.g. Programming, Design"
                                />
                            </div>

                            {/* Level */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Layers className="w-4 h-4 text-slate-400" /> Difficulty Level
                                </label>
                                <select
                                    name="level" value={formData.level} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="beginner">🟢 Beginner</option>
                                    <option value="intermediate">🟡 Intermediate</option>
                                    <option value="advanced">🔴 Advanced</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" /> Price (INR) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                                    <input
                                        type="number" name="price" required value={formData.price} onChange={handleChange}
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                        placeholder="499"
                                    />
                                </div>
                            </div>

                            {/* Language */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Globe className="w-4 h-4 text-slate-400" /> Teaching Language
                                </label>
                                <input
                                    type="text" name="language" value={formData.language} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    placeholder="e.g. Hindi, English"
                                />
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <ImageIcon className="w-4 h-4 text-slate-400" /> Thumbnail Image URL
                            </label>
                            <input
                                type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                placeholder="https://images.unsplash.com/your-custom-image-link"
                            />
                        </div>

                        {/* Lessons & Duration Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <BookOpen className="w-4 h-4 text-slate-400" /> Total Lessons
                                </label>
                                <input
                                    type="number" name="totalLessons" value={formData.totalLessons} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    placeholder="e.g. 32"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> Total Duration (Mins)
                                </label>
                                <input
                                    type="number" name="totalDuration" value={formData.totalDuration} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    placeholder="e.g. 720"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Course Assets...
                                    </span>
                                ) : (
                                    "Publish Course Live"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}