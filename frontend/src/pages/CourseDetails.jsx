import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, Clock, BookOpen, Loader } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // 🔥 Fetch course
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/courses/${id}`);
                setCourse(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // 🔥 ENROLL FUNCTION
    const enrollCourse = async () => {
        if (!user) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {
            setEnrolling(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${API_URL}/api/enrollments`,
                { courseId: course._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("🎉 Enrolled Successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Enrollment failed");
        } finally {
            setEnrolling(false);
        }
    };

    // 🔄 Loading UI
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-primary-500" size={32} />
            </div>
        );
    }

    // ❌ Error UI
    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                <p>Error: {error}</p>
                <button onClick={() => navigate(-1)} className="mt-2 underline">
                    Go Back
                </button>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card overflow-hidden"
            >
                {/* IMAGE */}
                <div className="h-64 w-full relative">
                    <img
                        src={course.coverImage || ''}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p>{course.description}</p>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 grid md:grid-cols-3 gap-8">
                    {/* LEFT */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Modules</h3>

                        {course.modules?.map((mod, i) => (
                            <div key={i} className="p-3 border rounded mb-2 flex gap-3">
                                <PlayCircle size={20} />
                                <div>
                                    <p>{mod.title}</p>
                                    <small>{mod.duration}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT */}
                    <div>
                        <div className="card p-5">
                            <h4 className="font-bold mb-4">Course Info</h4>

                            <p className="mb-2">
                                <Clock size={14} /> Duration: 12h
                            </p>
                            <p className="mb-2">
                                <BookOpen size={14} /> Modules: {course.modules?.length}
                            </p>

                            {/* 🔥 ENROLL BUTTON */}
                            <button
                                onClick={enrollCourse}
                                disabled={enrolling}
                                className="btn-primary w-full mt-4"
                            >
                                {enrolling
                                    ? "Enrolling..."
                                    : `Enroll - ${course.price === 0 ? "Free" : `$${course.price}`}`}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseDetails;