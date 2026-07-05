"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../src/lib/api';
import Link from 'next/link';
import useCourseStore from '../../../src/lib/store/course';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../../src/lib/store/authStore';
import {
    Loader2,
    BookOpen,
    User,
    GraduationCap,
    Clock,
    ArrowRight,
    Zap,
    Sparkles,
    CheckCircle,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';

const MyCoursesPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { user } = useUserStore();
    const { setSelectedCourse } = useCourseStore();

    const userId = user?._id;

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/courses/get/${userId}`);

                console.log('Backend Response Data:', data);

                if (data.success) {
                    setEnrollments(data.courses);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || "Server se connect karne mein dikkat aa rahi hai."
                );
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMyCourses();
        }
    }, [userId]);

    // Matching Dark Loading Spinner Layout
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 p-4">
                <div className="relative flex items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-indigo-500" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">Your courses are loading...</p>
            </div>
        );
    }

    // Matching Dark Error State
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-950 px-3 sm:px-4">
                <div className="max-w-md w-full text-center bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-rose-500/10">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <AlertCircle className="w-6 h-6 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Please Buy Now</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95 w-full sm:w-auto"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-8 text-slate-300">
            <div className="max-w-6xl mx-auto">

                {/* Modern Dark Header Section */}
                <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                            <GraduationCap size={28} className="text-indigo-400" />
                            My Enrolled Courses
                        </h1>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-400">
                            Aapke saare purchased courses yahan dikhenge. Keep learning!
                        </p>
                    </div>
                    <div className="bg-indigo-600/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-indigo-500/20 flex items-center gap-2 self-center sm:self-auto">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span className="text-[10px] sm:text-sm font-semibold text-indigo-400">{enrollments.length} Courses Active</span>
                    </div>
                </div>

                {/* Premium Dark Empty State */}
                {enrollments.length === 0 ? (
                    <div className="text-center bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800/60 shadow-xl p-8 sm:p-12 lg:p-16 max-w-xl mx-auto mt-8 sm:mt-12">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-slate-800">
                            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Koi course nahi mila</h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 sm:mb-8">
                            Aapne abhi tak koi course nahi kharida hai. Explore karein hamare top courses ko!
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/10 w-full sm:w-auto"
                        >
                            Browse Courses
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                ) : (
                    /* Premium Dark Courses Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {enrollments.map((enrollment) => {
                            const course = enrollment.course || enrollment;
                            const progress = enrollment.progress !== undefined ? enrollment.progress : 0;
                            const instructor = course?.instructorname || "Expert Instructor";
                            const categoryName = course?.category ? course.category.trim() : "General";

                            return (
                                <div
                                    key={course._id || enrollment._id}
                                    className="group bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800/60 hover:border-slate-700/80 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Course Image/Thumbnail */}
                                    <div className="relative h-36 sm:h-40 lg:h-44 w-full bg-slate-800 overflow-hidden">
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60"></div>

                                        {/* Progress Badge on Image */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-1">
                                                <Zap size={12} className="text-yellow-400" />
                                                {progress}% Complete
                                            </span>
                                            <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-emerald-500/30">
                                                {categoryName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 sm:p-5 lg:p-6 flex-1">
                                        {/* Instructor & Level */}
                                        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400">
                                                <User size={12} className="sm:size-14" />
                                                <span className="font-medium text-slate-300 truncate max-w-[100px] sm:max-w-[120px]">
                                                    {instructor}
                                                </span>
                                            </div>
                                            <span className="text-[8px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                                {course?.level || "All Levels"}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors min-h-[48px] sm:min-h-[56px]">
                                            {course?.title || "Untitled Course"}
                                        </h2>

                                        {/* Progress Bar */}
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-800/40">
                                            <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-400 mb-1">
                                                <span>Progress</span>
                                                <span className="text-indigo-400">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden border border-slate-800/30">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-600 to-violet-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer / Action Button */}
                                    <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[10px] font-bold border border-emerald-500/20 whitespace-nowrap">
                                            <CheckCircle size={12} className="sm:size-14" />
                                            Paid
                                        </div>

                                        {/* Premium Action Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                router.push(`/mycourse/${course._id}`);
                                            }}
                                            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] flex-1 sm:flex-none"
                                        >
                                            <span>Start Learning</span>
                                            <ArrowRight size={14} className="sm:size-16 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Stats */}
                {enrollments.length > 0 && (
                    <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                        <div className="bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800/40">
                            <p className="text-lg sm:text-xl font-bold text-white">{enrollments.length}</p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Total Courses</p>
                        </div>
                        <div className="bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800/40">
                            <p className="text-lg sm:text-xl font-bold text-indigo-400">
                                {Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)}%
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Avg Progress</p>
                        </div>
                        <div className="bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800/40">
                            <p className="text-lg sm:text-xl font-bold text-emerald-400">
                                {enrollments.filter(e => e.progress >= 100).length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Completed</p>
                        </div>
                        <div className="bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800/40">
                            <p className="text-lg sm:text-xl font-bold text-yellow-400">
                                {enrollments.filter(e => e.progress > 0 && e.progress < 100).length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500">In Progress</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyCoursesPage;