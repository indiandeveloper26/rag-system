'use client'

import React, { useState } from 'react';
import useCourseStore from '../../../../src/lib/store/course';
import { useRouter } from 'next/navigation';
import {
    Play,
    BookOpen,
    Info,
    FileText,
    ArrowLeft,
    Clock,
    User,
    Star,
    Shield,
    CheckCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    MonitorPlay,
    GraduationCap,
    Maximize2,
    Menu
} from 'lucide-react';

const CoursePlayer = ({ enrollmentData }) => {
    const selectedCourseFromStore = useCourseStore((state) => state.selectedCourse);
    const data = enrollmentData || selectedCourseFromStore;
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto" />
                    <p className="text-slate-400 text-sm">Loading course details...</p>
                </div>
            </div>
        );
    }

    const course = data.course || data;
    const progress = data.progress !== undefined ? data.progress : 0;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* Desktop Layout - PC */}
            <div className="hidden lg:flex flex-row min-h-screen">

                {/* Left Side - Video & Content */}
                <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400 flex items-center space-x-2">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={16} />
                                <span>Back</span>
                            </button>
                            <span className="text-slate-600">/</span>
                            <span className="text-indigo-400 font-medium truncate max-w-[300px]">
                                {course?.title}
                            </span>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                        <div className="relative aspect-video w-full">
                            {course?.liveVideoUrl ? (
                                <video
                                    src={course?.liveVideoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster={course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"}
                                    controlsList="nodownload"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                                    <div className="text-center p-4">
                                        <MonitorPlay size={64} className="text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-400 text-base">No video available</p>
                                        <p className="text-slate-500 text-sm mt-1">Check back later for content</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Video Info */}
                    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md uppercase">
                                        {course?.level || 'Beginner'}
                                    </span>
                                    <span className="text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md uppercase">
                                        {course?.language || 'English'}
                                    </span>
                                    {course?.category && (
                                        <span className="text-xs font-semibold tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md uppercase">
                                            {course.category}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-white">
                                    {course?.title}
                                </h1>
                                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                    <User size={14} />
                                    by {course?.instructorname || 'Expert Instructor'}
                                </p>
                            </div>

                            {/* Progress Circle */}
                            <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg border border-slate-700 flex-shrink-0">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Progress</p>
                                    <p className="text-lg font-bold text-emerald-400">{progress}%</p>
                                </div>
                                <div className="relative w-14 h-14">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="#1e293b"
                                            strokeWidth="5"
                                        />
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="5"
                                            strokeDasharray={`${progress * 2.83} 283`}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl flex-1 flex flex-col">
                        <div className="flex border-b border-slate-800 bg-slate-900/50">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'overview'
                                        ? 'border-indigo-500 text-white bg-indigo-500/5'
                                        : 'border-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <Info size={18} />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('resources')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'resources'
                                        ? 'border-indigo-500 text-white bg-indigo-500/5'
                                        : 'border-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <FileText size={18} />
                                Resources
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 text-slate-300 max-h-[400px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">About this Course</h3>
                                        <p className="text-base leading-relaxed text-slate-400">
                                            {course?.description || "No description available for this course."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-slate-800/40 p-3 rounded-lg text-center">
                                            <BookOpen size={20} className="mx-auto text-indigo-400 mb-1" />
                                            <p className="text-xs text-slate-500">Category</p>
                                            <p className="text-sm font-semibold text-slate-300 mt-1 truncate">
                                                {course?.category || 'General'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-3 rounded-lg text-center">
                                            <Clock size={20} className="mx-auto text-indigo-400 mb-1" />
                                            <p className="text-xs text-slate-500">Duration</p>
                                            <p className="text-sm font-semibold text-slate-300 mt-1">
                                                {course?.totalDuration ? `${course.totalDuration}h` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-3 rounded-lg text-center">
                                            <GraduationCap size={20} className="mx-auto text-indigo-400 mb-1" />
                                            <p className="text-xs text-slate-500">Lessons</p>
                                            <p className="text-sm font-semibold text-slate-300 mt-1">
                                                {course?.totalLessons || '0'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-3 rounded-lg text-center">
                                            <Star size={20} className="mx-auto text-yellow-400 mb-1" />
                                            <p className="text-xs text-slate-500">Rating</p>
                                            <p className="text-sm font-semibold text-yellow-400 mt-1">
                                                ⭐ {course?.rating || 'New'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/20 rounded-lg p-4 border border-slate-800/50">
                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <CheckCircle size={18} className="text-emerald-400" />
                                            What You'll Learn
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                "Complete course curriculum",
                                                "Hands-on projects",
                                                "Expert instructor support",
                                                "Lifetime access",
                                                "Certificate on completion",
                                                "Community access"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'resources' && (
                                <div className="text-center py-12 text-slate-500">
                                    <FileText size={48} className="mx-auto text-slate-700 mb-3" />
                                    <p className="text-base">No external resources provided</p>
                                    <p className="text-sm mt-1 text-slate-600">Contact instructor if files are missing.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - PC */}
                <div className="w-96 bg-slate-900/60 border-l border-slate-800 backdrop-blur-md flex flex-col h-screen sticky top-0">
                    <div className="p-4 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-lg text-white flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-400" />
                                Course Content
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {course?.totalLessons || '0'} Lectures
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(`/refund-ai/${data._id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                            <Shield size={14} />
                            Refund
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        <div className="w-full text-left p-3 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-start space-x-3">
                            <div className="mt-0.5 bg-indigo-500/20 text-indigo-400 p-1.5 rounded-md">
                                <Play size={16} className="fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Now Playing</span>
                                <h4 className="text-sm font-medium text-white truncate mt-0.5">{course?.title}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                    <Clock size={12} />
                                    Live Session
                                </p>
                            </div>
                            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-1" />
                        </div>

                        {(!course?.totalLessons || course?.totalLessons === 0) && (
                            <div className="p-4 text-center text-slate-600 text-xs italic">
                                No extra modules attached
                            </div>
                        )}

                        {course?.totalLessons > 1 && (
                            <div className="space-y-1">
                                {Array.from({ length: Math.min(5, course.totalLessons - 1) }).map((_, idx) => (
                                    <div key={idx} className="w-full text-left p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700 flex items-start space-x-3 opacity-60">
                                        <div className="mt-0.5 bg-slate-800 text-slate-500 p-1.5 rounded-md">
                                            <Play size={14} className="fill-current" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-400 truncate">
                                                Module {idx + 2}: Coming Soon
                                            </h4>
                                            <p className="text-xs text-slate-600 mt-0.5">🔒 Locked</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Phone */}
            <div className="lg:hidden flex flex-col min-h-screen">

                {/* Mobile Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-20 backdrop-blur-md">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm">Back</span>
                    </button>
                    <h2 className="text-sm font-semibold text-white truncate max-w-[150px]">
                        {course?.title}
                    </h2>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                    >
                        <Menu size={16} />
                        <span>{isSidebarOpen ? 'Close' : 'Menu'}</span>
                    </button>
                </div>

                {/* Mobile Video - Full Width */}
                <div className="relative w-full bg-black">
                    <div className="relative aspect-video w-full">
                        {course?.liveVideoUrl ? (
                            <video
                                src={course?.liveVideoUrl}
                                controls
                                className="w-full h-full object-contain"
                                poster={course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"}
                                controlsList="nodownload"
                                playsInline
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                                <div className="text-center p-4">
                                    <MonitorPlay size={48} className="text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">No video available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Mobile Content */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-20">

                    {/* Video Info */}
                    <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="text-[8px] font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase">
                                {course?.level || 'Beginner'}
                            </span>
                            <span className="text-[8px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">
                                {course?.language || 'English'}
                            </span>
                            {course?.category && (
                                <span className="text-[8px] font-semibold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">
                                    {course.category}
                                </span>
                            )}
                        </div>
                        <h1 className="text-base font-bold text-white">
                            {course?.title}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <User size={12} />
                            by {course?.instructorname || 'Expert Instructor'}
                        </p>

                        {/* Mobile Progress */}
                        <div className="mt-3 flex items-center justify-between bg-slate-800/50 p-2 rounded-lg">
                            <span className="text-xs text-slate-400">Progress</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-400">{progress}%</span>
                                <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl">
                        <div className="flex border-b border-slate-800 bg-slate-900/50">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'overview'
                                        ? 'border-indigo-500 text-white bg-indigo-500/5'
                                        : 'border-transparent text-slate-400'
                                    }`}
                            >
                                <Info size={14} />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('resources')}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'resources'
                                        ? 'border-indigo-500 text-white bg-indigo-500/5'
                                        : 'border-transparent text-slate-400'
                                    }`}
                            >
                                <FileText size={14} />
                                Resources
                            </button>
                        </div>

                        <div className="p-3 text-slate-300 max-h-[300px] overflow-y-auto">
                            {activeTab === 'overview' && (
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1.5">About this Course</h3>
                                        <p className="text-xs leading-relaxed text-slate-400">
                                            {course?.description || "No description available."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-800/40 p-2 rounded-lg text-center">
                                            <BookOpen size={14} className="mx-auto text-indigo-400 mb-0.5" />
                                            <p className="text-[8px] text-slate-500">Category</p>
                                            <p className="text-[10px] font-semibold text-slate-300 truncate">
                                                {course?.category || 'General'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-2 rounded-lg text-center">
                                            <Clock size={14} className="mx-auto text-indigo-400 mb-0.5" />
                                            <p className="text-[8px] text-slate-500">Duration</p>
                                            <p className="text-[10px] font-semibold text-slate-300">
                                                {course?.totalDuration ? `${course.totalDuration}h` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-2 rounded-lg text-center">
                                            <GraduationCap size={14} className="mx-auto text-indigo-400 mb-0.5" />
                                            <p className="text-[8px] text-slate-500">Lessons</p>
                                            <p className="text-[10px] font-semibold text-slate-300">
                                                {course?.totalLessons || '0'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/40 p-2 rounded-lg text-center">
                                            <Star size={14} className="mx-auto text-yellow-400 mb-0.5" />
                                            <p className="text-[8px] text-slate-500">Rating</p>
                                            <p className="text-[10px] font-semibold text-yellow-400">
                                                ⭐ {course?.rating || 'New'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-800/50">
                                        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                                            <CheckCircle size={14} className="text-emerald-400" />
                                            What You'll Learn
                                        </h4>
                                        <div className="space-y-1.5">
                                            {[
                                                "Complete curriculum",
                                                "Hands-on projects",
                                                "Expert support",
                                                "Lifetime access",
                                                "Certificate",
                                                "Community"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                                                    <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'resources' && (
                                <div className="text-center py-8 text-slate-500">
                                    <FileText size={32} className="mx-auto text-slate-700 mb-2" />
                                    <p className="text-sm">No resources provided</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Bar - Refund Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-3 z-30">
                    <button
                        onClick={() => router.push(`/refund-ai/${data._id}`)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                        <Shield size={18} />
                        Request Refund
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/70 z-40"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-2xl z-50 max-h-[60vh] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                                <div>
                                    <h2 className="font-bold text-white flex items-center gap-2">
                                        <BookOpen size={18} className="text-indigo-400" />
                                        Course Content
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        {course?.totalLessons || '0'} Lectures
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-slate-400 hover:text-white p-1"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                <div className="w-full text-left p-3 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-start space-x-3">
                                    <div className="mt-0.5 bg-indigo-500/20 text-indigo-400 p-1.5 rounded-md">
                                        <Play size={14} className="fill-current" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[8px] text-indigo-400 uppercase tracking-wider font-bold">Now Playing</span>
                                        <h4 className="text-sm font-medium text-white truncate">{course?.title}</h4>
                                    </div>
                                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-1" />
                                </div>
                                {(!course?.totalLessons || course?.totalLessons === 0) && (
                                    <div className="p-4 text-center text-slate-600 text-xs">
                                        No extra modules
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default CoursePlayer;