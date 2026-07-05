"use client";

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../../../src/lib/api';
import Link from 'next/link';
import { Loader2, Star, Globe, User, Tag, ArrowRight, Sparkles } from 'lucide-react';

// UI Helper: Premium Blue/Dark Theme Skeleton Card Component
const CourseSkeleton = () => (
    <div className="bg-slate-900/60 rounded-2xl border border-blue-900/40 p-3 sm:p-4 animate-pulse flex flex-col justify-between h-[380px] sm:h-[400px] lg:h-[420px] shadow-lg">
        <div>
            <div className="bg-blue-950/80 h-36 sm:h-40 lg:h-44 w-full rounded-xl mb-3 sm:mb-4 border border-blue-900/20" />
            <div className="h-3 sm:h-4 bg-blue-950/80 rounded w-1/4 mb-2 sm:mb-3" />
            <div className="h-5 sm:h-6 bg-blue-950/80 rounded w-3/4 mb-2" />
            <div className="h-3 sm:h-4 bg-blue-950/80 rounded w-full mb-1.5" />
            <div className="h-3 sm:h-4 bg-blue-950/80 rounded w-2/3" />
        </div>
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-900/30 flex justify-between items-center">
            <div className="space-y-1.5 sm:space-y-2 w-1/3">
                <div className="h-1.5 sm:h-2 bg-blue-950/80 rounded w-1/2" />
                <div className="h-4 sm:h-5 bg-blue-950/80 rounded" />
            </div>
            <div className="h-8 sm:h-10 bg-blue-950/80 rounded-xl w-1/3" />
        </div>
    </div>
);

export default function Page() {
    const [coursesData, setCoursesData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchCourses = async () => {
            if (page === 1) setLoading(true);
            else setFetchingMore(true);

            try {
                const response = await api.get(`/courses/get?page=${page}`);

                if (isMounted && response.data && response.data.success) {
                    const newCourses = response.data.courses || [];
                    setCoursesData((prevCourses) =>
                        page === 1 ? newCourses : [...prevCourses, ...newCourses]
                    );
                    setHasMore(response.data.hasMore);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || err.message || "Failed to fetch courses");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setFetchingMore(false);
                }
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, [page]);

    useEffect(() => {
        if (inView && hasMore && !fetchingMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, hasMore, fetchingMore, loading]);

    // Error UI in Dark Blue Theme
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-3 sm:p-4">
                <div className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-rose-500/20 shadow-2xl text-center max-w-md w-full backdrop-blur-md">
                    <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-rose-950/50 text-rose-400 mb-3 sm:mb-4 text-lg sm:text-xl border border-rose-500/30">
                        ⚠️
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1">Execution Error</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 py-8 sm:py-12 lg:py-14 px-3 sm:px-6 lg:px-8 font-sans antialiased text-slate-100">

            {/* Header Section - Fully Responsive */}
            <div className="max-w-7xl mx-auto mb-8 sm:mb-10 lg:mb-12 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 tracking-wider uppercase border border-blue-500/20 backdrop-blur-sm">
                    <Sparkles size={12} className="sm:size-14" />
                    Live Tracks
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                    Explore Our Best Courses
                </h1>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto md:mx-0">
                    Upgrade your professional skillset today with high-fidelity modules and real-time interaction.
                </p>
                <div className="w-full h-[1px] bg-gradient-to-r from-blue-500/30 via-transparent to-transparent mt-6 sm:mt-8" />
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto">
                {/* INITIAL LOADING: Grid Skeleton View */}
                {loading && page === 1 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {[...Array(6)].map((_, idx) => (
                            <CourseSkeleton key={idx} />
                        ))}
                    </div>
                ) : coursesData.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="text-center py-16 sm:py-20 lg:py-24 bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-blue-900/20 backdrop-blur-md px-4">
                        <p className="text-sm sm:text-base text-slate-400 font-medium">No courses available at the moment.</p>
                    </div>
                ) : (
                    /* COURSE GRID WITH FULL PREMIUM BLUE TECH THEME */
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
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
                                        className="group bg-slate-900/40 backdrop-blur-md rounded-xl sm:rounded-2xl border border-blue-900/30 shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
                                    >
                                        <div>
                                            {/* Image & Level Badge */}
                                            <div className="relative h-40 sm:h-44 lg:h-48 w-full bg-slate-950 overflow-hidden">
                                                <img
                                                    src={displayImage}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    loading={page === 1 ? "eager" : "lazy"}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                                                <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-slate-900/90 backdrop-blur-md text-blue-400 text-[8px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg uppercase tracking-widest shadow-lg border border-blue-900/50 z-10">
                                                    {course.level || 'All Levels'}
                                                </span>
                                            </div>

                                            {/* Content Metadata */}
                                            <div className="p-4 sm:p-5 lg:p-6 pb-0">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                                                    <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold bg-blue-500/10 text-blue-400 rounded-md tracking-wider uppercase border border-blue-500/20">
                                                        {course.category}
                                                    </span>
                                                    <div className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[120px] sm:max-w-[160px] flex items-center gap-1">
                                                        <User size={12} className="sm:size-14" />
                                                        <span className="font-semibold text-slate-200 truncate">{course.instructorname || 'Expert'}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200 min-h-[44px] sm:min-h-[56px] leading-snug mb-1.5 sm:mb-2">
                                                    {course.title}
                                                </h3>

                                                <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                                                    {course.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold text-slate-400 mb-3 sm:mb-4 bg-slate-950/60 p-2 sm:p-2.5 rounded-xl border border-blue-950/40">
                                                    <span className="flex items-center gap-1">
                                                        <Globe size={12} className="sm:size-14" />
                                                        {course.language || 'English'}
                                                    </span>
                                                    <span className="w-[1px] h-3 bg-blue-900/40 hidden sm:block" />
                                                    <span className="flex items-center gap-1 text-amber-400">
                                                        <Star size={12} className="sm:size-14 fill-amber-400" />
                                                        {course.rating > 0 ? `${course.rating}.0` : "New"}
                                                    </span>
                                                    <span className="w-[1px] h-3 bg-blue-900/40 hidden sm:block" />
                                                    <span className="flex items-center gap-1 text-emerald-400">
                                                        <Tag size={12} className="sm:size-14" />
                                                        {course.students || 0} students
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fixed Bottom Action Section */}
                                        <div className="p-4 sm:p-5 lg:p-6 pt-0">
                                            <div className="pt-3 sm:pt-4 border-t border-blue-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex flex-col w-full sm:w-auto">
                                                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Investment</span>
                                                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                                        ₹{course.price ? course.price.toLocaleString('en-IN') : 0}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/getcourse/${course._id}`}
                                                    className="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] sm:text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 border border-blue-400/20"
                                                >
                                                    View Details
                                                    <ArrowRight size={14} className="ml-1.5 sm:ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Infinite Scroll Trigger Points */}
                        <div ref={ref} className="w-full flex justify-center py-8 sm:py-10 lg:py-12 mt-4 sm:mt-6">
                            {fetchingMore && (
                                <div className="flex items-center space-x-2 sm:space-x-2.5 bg-slate-900/80 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-blue-900/40 shadow-xl backdrop-blur-md">
                                    <Loader2 size={16} className="animate-spin text-blue-400" />
                                    <span className="text-[10px] sm:text-xs text-slate-300 font-semibold tracking-wide">
                                        Loading more...
                                    </span>
                                </div>
                            )}
                            {!hasMore && coursesData.length > 0 && (
                                <span className="text-[10px] sm:text-xs font-bold text-blue-400 tracking-wider uppercase bg-blue-950/60 border border-blue-900/40 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg backdrop-blur-sm text-center">
                                    ✨ You've explored all courses!
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}