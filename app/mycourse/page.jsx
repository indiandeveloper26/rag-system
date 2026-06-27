'use client'

import React, { useEffect, useState } from 'react';
import api from '../../src/lib/api';
import Link from 'next/link';
import useCourseStore from '../../src/lib/store/course';
import { useRouter } from 'next/navigation';

const page = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




    const router = useRouter();

    const { setSelectedCourse } = useCourseStore();


    // Example user id (Aap ise auth context ya params se le sakte hain)
    const userId = "6a364fa35870076360d1449d";

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);

                const { data } = await api.get(`/courses/get/${userId}`);

                console.log("Response:", data);

                if (data.success) {
                    setEnrollments(data.courses);
                } else {
                    setError(data.message);
                }

            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message || "Server connect karne mein dikkat aa rahi hai."
                );
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMyCourses();
        }
    }, [userId]);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-500 font-semibold bg-gray-50 h-screen">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Enrolled Courses</h1>
                    <p className="mt-2 text-sm text-gray-600">Aapke saare purchased courses yahan dikhenge.</p>
                </div>

                {enrollments.length === 0 ? (
                    <div className="text-center bg-white rounded-lg shadow p-12">
                        <p className="text-gray-500 text-lg">Aapne abhi tak koi course nahi kharida hai.</p>
                    </div>
                ) : (
                    /* Courses Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => {
                            // Extracting populated course data
                            const course = enrollment.course;

                            return (
                                <div key={enrollment._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col justify-between">

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Category Tag */}
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                                            {course.category || "General"}
                                        </span>

                                        {/* Course Title */}
                                        <h2 className="mt-3 text-xl font-bold text-gray-900 line-clamp-1">
                                            {course.title}
                                        </h2>

                                        {/* Course Description */}
                                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="mt-6">
                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span>{enrollment.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${enrollment.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer / Action Button */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium border border-green-200">
                                            ✓ Paid
                                        </span>

                                        {/* Course Link or Video Player Trigger */}
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);

                                                router.push(`/mycourse/${course._id}`);
                                            }}
                                            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            Start Learning
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

export default page