'use client'

import React, { useState } from 'react';
import useCourseStore from '../../../src/lib/store/course';
// Zustand store ko import kiya (apne folder structure ke mutabik path check kar lein)


const CoursePlayer = ({ enrollmentData }) => {
    // Zustand store se selectedCourse data fetch kiya
    const selectedCourseFromStore = useCourseStore((state) => state.selectedCourse);

    // Dummy data ko poori tarah hata diya hai. Ab data ya toh props se aayega ya Zustand store se.
    const data = enrollmentData || selectedCourseFromStore;

    const [activeTab, setActiveTab] = useState('overview');

    // Agar dono jagah data `null` ya `undefined` hai, toh loading state dikhayenge
    if (!data) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 text-sm">Loading course details...</p>
                </div>
            </div>
        );
    }

    // Agar `data` direct hi course object hai ya fir uske andar `course` nested hai, dono handle kiya hai:
    const course = data.course || data;
    const progress = data.progress !== undefined ? data.progress : 0;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col lg:flex-row">

            {/* LEFT SIDE: Video Player & Tabs (Main Content) */}
            <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-4">

                {/* Breadcrumb / Navigation Back */}
                <div className="text-sm text-gray-400 flex items-center space-x-2">
                    <span className="hover:underline cursor-pointer">My Courses</span>
                    <span>/</span>
                    <span className="text-indigo-400 font-medium">{course?.title}</span>
                </div>

                {/* Cinematic Video Container */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black border border-gray-800">
                    <video
                        src={course?.liveVideoUrl}
                        controls
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                        controlsList="nodownload"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Title & Quick Actions */}
                <div className="bg-gray-800/50 border border-gray-800 p-5 rounded-xl backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            {(course?.level || course?.language) && (
                                <span className="text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md uppercase">
                                    {course?.level || 'Beginner'} • {course?.language || 'English'}
                                </span>
                            )}
                            <h1 className="text-2xl font-bold mt-2 text-white">{course?.title}</h1>
                        </div>

                        {/* Progress Circle/Bar inside Player */}
                        <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Your Progress</p>
                                <p className="text-sm font-bold text-emerald-400">{progress}% Completed</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                                <span className="text-[10px] font-bold">{progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Tabs: Overview / Discussion */}
                <div className="bg-gray-800/30 border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
                    <div className="flex border-b border-gray-800 bg-gray-800/50">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'resources' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                        >
                            Resources & Info
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="p-6 overflow-y-auto flex-1 text-gray-300">
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white">About this Course</h3>
                                <p className="leading-relaxed text-gray-400">{course?.description || "No description available for this course."}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                    <div className="bg-gray-800/40 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Category</p>
                                        <p className="text-sm font-semibold text-gray-300 mt-1">{course?.category || 'General'}</p>
                                    </div>
                                    <div className="bg-gray-800/40 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="text-sm font-semibold text-gray-300 mt-1">{course?.totalDuration ? `${course.totalDuration} Hours` : 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-800/40 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Total Lessons</p>
                                        <p className="text-sm font-semibold text-gray-300 mt-1">{course?.totalLessons || '0'}</p>
                                    </div>
                                    <div className="bg-gray-800/40 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Rating</p>
                                        <p className="text-sm font-semibold text-yellow-400 mt-1">⭐ {course?.rating || 'New'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No external resources provided for this batch lecture.</p>
                                <p className="text-xs mt-1 text-gray-600">Contact instructor if files are missing.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* RIGHT SIDE: Sidebar (Lecture Playlist / Course Content) */}
            <div className="w-full lg:w-96 bg-gray-850 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col bg-gray-900/60 backdrop-blur-md">
                <div className="p-4 border-b border-gray-800 bg-gray-800/20">
                    <h2 className="font-bold text-lg text-white">Course Content</h2>
                    <p className="text-xs text-gray-400 mt-0.5">1 Section • {course?.totalLessons || '0'} Lectures</p>
                </div>

                {/* Playlist Items */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {/* Main Active Live Lecture */}
                    <div className="w-full text-left p-3 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-start space-x-3 transition-all">
                        <div className="mt-1 bg-indigo-500/20 text-indigo-400 p-1.5 rounded-md">
                            {/* Play Icon */}
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Now Playing</span>
                            <h4 className="text-sm font-medium text-white truncate mt-0.5">{course?.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">Live/Recorded Session</p>
                        </div>
                    </div>

                    {/* Locked/Upcoming Lecture Placeholders */}
                    {(!course?.totalLessons || course?.totalLessons === 0) && (
                        <div className="p-4 text-center text-gray-600 text-xs italic">
                            No extra modules attached.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CoursePlayer;