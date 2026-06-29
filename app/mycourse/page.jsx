"use client";

import React, { useEffect, useState } from 'react';
import api from '../../src/lib/api';
import Link from 'next/link';
import useCourseStore from '../../src/lib/store/course';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../src/lib/store/authStore';

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
            <div className="flex flex-col justify-center items-center h-screen bg-slate-950">
                <div className="relative flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800 border-t-indigo-500"></div>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">Your courses are loading...</p>
            </div>
        );
    }

    // Matching Dark Error State
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4">
                <div className="max-w-md w-full text-center bg-slate-900 p-8 rounded-2xl shadow-xl border border-rose-500/10">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Kuch galat hua</h3>
                    <p className="text-slate-400 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-300">
            <div className="max-w-6xl mx-auto">

                {/* Modern Dark Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
                            My Enrolled Courses
                        </h1>
                        <p className="mt-2 text-base text-slate-400">
                            Aapke saare purchased courses yahan dikhenge. Keep learning!
                        </p>
                    </div>
                    <div className="bg-indigo-600/10 px-4 py-2.5 rounded-2xl border border-indigo-500/20 flex items-center gap-2 self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span className="text-sm font-semibold text-indigo-400">{enrollments.length} Courses Active</span>
                    </div>
                </div>

                {/* Premium Dark Empty State */}
                {enrollments.length === 0 ? (
                    <div className="text-center bg-slate-900 rounded-3xl border border-slate-800/60 shadow-xl p-16 max-w-xl mx-auto mt-12">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Koi course nahi mila</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">
                            Aapne abhi tak koi course nahi kharida hai. Explore karein hamare top courses ko!
                        </p>
                        <Link href="/courses" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/10">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    /* Premium Dark Courses Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrollments.map((enrollment) => {
                            // Agar course nested object hai ya direct parent data hi course hai, dono handles karega
                            const course = enrollment.course || enrollment;
                            const progress = enrollment.progress !== undefined ? enrollment.progress : 0;
                            const instructor = course?.instructorname || "Expert Instructor";
                            const categoryName = course?.category ? course.category.trim() : "General";

                            return (
                                <div
                                    key={course._id || enrollment._id}
                                    className="group bg-slate-900 rounded-2xl border border-slate-800/60 hover:border-slate-700/80 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Card Body */}
                                    <div className="p-6 flex-1">
                                        {/* Tags & Level */}
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 text-slate-400 uppercase tracking-wider border border-slate-800">
                                                {categoryName}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="capitalize">{course?.level || "All Levels"}</span>
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h2 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                            {course?.title || "Untitled Course"}
                                        </h2>

                                        {/* Instructor Name (NEW) */}
                                        <p className="text-xs text-indigo-400/80 font-medium mt-1">
                                            by {instructor}
                                        </p>

                                        {/* Course Description */}
                                        <p className="mt-3 text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                            {course?.description || "No description provided for this course."}
                                        </p>

                                        {/* Dark Progress Bar */}
                                        <div className="mt-6 pt-4 border-t border-slate-800/40">
                                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                                                <span>Course Progress</span>
                                                <span className="text-indigo-400">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/30">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-600 to-violet-500 h-2 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer / Action Button */}
                                    <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            Paid
                                        </div>

                                        {/* Premium Action Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                router.push(`/mycourse/${course._id}`);
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
                                        >
                                            <span>Start Learning</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyCoursesPage;