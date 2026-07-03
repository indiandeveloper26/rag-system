"use client";

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../../src/lib/api';
import Link from 'next/link';

export default function Page() {
    const [coursesData, setCoursesData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    const { ref, inView } = useInView({
        threshold: 0.1, // UX smooth karne ke liye threshold thoda kam kiya hai
    });

    useEffect(() => {
        const fetchCourses = async () => {
            if (page === 1) setLoading(true);
            else setFetchingMore(true);

            try {
                const response = await api.get(`/courses/get?page=${page}`);
                console.log('resdstata', response);

                if (response.data && response.data.success) {
                    const newCourses = response.data.courses || [];
                    setCoursesData((prevCourses) =>
                        page === 1 ? newCourses : [...prevCourses, ...newCourses]
                    );
                    setHasMore(response.data.hasMore);
                } else {
                    console.error("Backend response correct nahi mila:", response.data);
                }
            } catch (err) {
                console.error("Axios Fetch Error:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch courses");
            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        };

        fetchCourses();
    }, [page]);

    useEffect(() => {
        if (inView && hasMore && !fetchingMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, hasMore, fetchingMore, loading]);

    // Premium Loading State (Skeleton Screen Layout)
    if (loading && page === 1) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
                <div className="relative flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600"></div>
                </div>
                <span className="ml-3 mt-4 text-slate-600 font-medium tracking-wide text-sm animate-pulse">Loading premium courses...</span>
            </div>
        );
    }

    // Modern Alert Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
                <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xl shadow-rose-500/5 text-center max-w-md w-full backdrop-blur-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
                        ⚠️
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Execution Error</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 py-14 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 tracking-wider uppercase">
                    ✨ Live Tracks
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Explore Our Best Courses
                </h1>
                <p className="mt-2 text-base text-slate-500 max-w-2xl">
                    Upgrade your professional skillset today with high-fidelity modules and real-time interaction modules.
                </p>
                <div className="w-full h-[1px] bg-slate-200/80 mt-8" />
            </div>

            {/* Grid Layout Container */}
            {coursesData.length === 0 ? (
                <div className="text-center py-24 bg-white max-w-7xl mx-auto rounded-3xl border border-slate-200/60 shadow-sm">
                    <p className="text-base text-slate-400 font-medium">No courses available at the moment.</p>
                </div>
            ) : (
                <>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {coursesData.map((course) => {
                            const isVideo = course.thumbnail?.includes('/video/upload/') ||
                                course.thumbnail?.endsWith('.mkv') ||
                                course.liveVideoUrl;

                            const displayImage = isVideo
                                ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"
                                : (course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500");

                            return (
                                <div
                                    key={course._id}
                                    className="group bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-slate-300/40 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Image & Level Badge Container */}
                                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                        <img
                                            src={displayImage}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-sm border border-slate-200/20">
                                            {course.level || 'All Levels'}
                                        </span>
                                    </div>

                                    {/* Content & Metadata Wrapper */}
                                    <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                {/* Category Badge */}
                                                <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-indigo-50 text-indigo-600 rounded-md tracking-wider uppercase">
                                                    {course.category}
                                                </span>
                                                {/* Instructor Info */}
                                                <div className="text-xs text-slate-500 truncate max-w-[160px]">
                                                    by <span className="font-semibold text-slate-800">{course.instructorname || 'Expert'}</span>
                                                </div>
                                            </div>

                                            {/* Course Title */}
                                            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 min-h-[56px] leading-snug mb-2">
                                                {course.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                                {course.description}
                                            </p>

                                            {/* Bottom Specs tags */}
                                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl">
                                                <span className="flex items-center gap-1">🌐 {course.language || 'English'}</span>
                                                <span className="w-[1px] h-3 bg-slate-200" />
                                                <span className="flex items-center gap-1 text-amber-600">⭐ {course.rating > 0 ? `${course.rating}.0` : "New Block"}</span>
                                            </div>
                                        </div>

                                        {/* Pricing & CTA Button Footer */}
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Investment</span>
                                                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                                                        ₹{course.price ? course.price.toLocaleString('en-IN') : 0}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/getcourse/${course._id}`}
                                                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-indigo-600/10 active:scale-95"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Infinite Scroll Progress Indicators */}
                    <div ref={ref} className="w-full flex justify-center py-12 mt-6">
                        {fetchingMore && (
                            <div className="flex items-center space-x-2.5 bg-white px-5 py-2.5 rounded-full border border-slate-200/80 shadow-md shadow-slate-200/40">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                                <span className="text-xs text-slate-600 font-semibold tracking-wide">Loading more live modules...</span>
                            </div>
                        )}
                        {!hasMore && coursesData.length > 0 && (
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
                                🌟 You have fully explored all current paths!
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}