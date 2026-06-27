"use client";

import React, { useEffect, useState, useRef } from 'react';
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

    // useInView hook check karega jab user page ke bottom par pahunchega
    const { ref, inView } = useInView({
        threshold: 0.5, // Jab element 50% dikhe tab trigger ho
    });

    // Pehla page load karne ke liye aur page change hone par naya data lane ke liye
    useEffect(() => {
        const fetchCourses = async () => {
            if (page === 1) setLoading(true);
            else setFetchingMore(true);

            try {
                // Backend controller ko current page bhej rahe hain query param me
                const response = await api.get(`/courses/get?page=${page}`);


                console.log('resdstata', response)

                if (response.data && response.data.success) {
                    const newCourses = response.data.courses || [];

                    // Naye courses ko purane courses ke sath append (jod) kar rahe hain
                    setCoursesData((prevCourses) =>
                        page === 1 ? newCourses : [...prevCourses, ...newCourses]
                    );

                    // Backend se aayi 'hasMore' value set kar rahe hain
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

    console.log('courdtata', coursesData)



    // Jab bottom element screen par aaye (inView true ho) aur data bacha ho, tab page increment karein
    useEffect(() => {
        if (inView && hasMore && !fetchingMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, hasMore, fetchingMore, loading]);

    // Initial Loading State (Sirf pehli baar ke liye)
    if (loading && page === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-slate-600 font-medium">Loading courses...</span>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm text-center max-w-sm">
                    <p className="text-red-500 font-semibold mb-2">⚠️ Error Occurred</p>
                    <p className="text-sm text-slate-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Courses</h1>
                <p className="mt-2 text-sm text-slate-500">Upgrade your skills today with our live tracks.</p>
            </div>

            {/* Grid Layout */}
            {coursesData.length === 0 ? (
                <div className="text-center py-20 text-slate-500">No courses available at the moment.</div>
            ) : (
                <>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col justify-between"
                                >
                                    {/* Image & Badge */}
                                    <div className="relative h-48 w-full bg-slate-200">
                                        <img
                                            src={displayImage}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                            {course.level}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase block mb-2">
                                                {course.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-2 min-h-[56px]">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-4">
                                                <span>🌐 {course.language}</span>
                                                <span>⭐ {course.rating > 0 ? course.rating : "New"}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="w-full h-[1px] bg-slate-100 my-4" />
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-2xl font-black text-slate-900">
                                                    ₹{course.price ? course.price.toLocaleString('en-IN') : 0}
                                                </span>
                                                <Link href={`/getcourse/${course._id}`} className="w-full text-center block bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-200">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Infinite Scroll Trigger & Bottom Loader */}
                    <div ref={ref} className="w-full flex justify-center py-8 mt-4">
                        {fetchingMore && (
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
                                <span className="text-sm text-slate-600 font-medium">Loading more courses...</span>
                            </div>
                        )}
                        {!hasMore && coursesData.length > 0 && (
                            <span className="text-sm text-slate-400 font-medium bg-slate-100 px-4 py-1.5 rounded-full">
                                🎉 You've reached the end of the list!
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}