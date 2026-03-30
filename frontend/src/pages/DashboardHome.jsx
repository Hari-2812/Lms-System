import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, TrendingUp, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 🔹 Stat Card Component
const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card p-6 flex items-center gap-4"
  >
    <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl">
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]); // enrollments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 🔥 FETCH ENROLLED COURSES
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${API_URL}/api/enrollments/my`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (user?.role !== "admin") {
      fetchMyCourses();
    }
  }, [user]);

  // 🔥 ADMIN DASHBOARD
  if (user?.role === 'admin') {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard title="Total Students" value="1248" icon={Users} delay={0.1} />
          <StatCard title="Courses" value="24" icon={BookOpen} delay={0.2} />
          <StatCard title="Tickets" value="12" icon={TrendingUp} delay={0.3} />
          <StatCard title="Engagement" value="84%" icon={Award} delay={0.4} />
        </div>
      </div>
    );
  }

  // 🔥 STUDENT DASHBOARD
  return (
    <div className="space-y-8">

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Courses Enrolled" value={courses.length} icon={BookOpen} delay={0.1} />
        <StatCard title="Pending Tasks" value="2" icon={TrendingUp} delay={0.2} />
        <StatCard title="Total XP" value="2450" icon={Award} delay={0.3} />
      </div>

      {/* 📚 COURSES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-xl font-bold mb-6">Continue Learning</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-primary-500" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 p-8 border border-dashed rounded">
            No enrolled courses yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((enroll, idx) => {
              const course = enroll.course;
              const progress = enroll.progress || 0;

              const fallbackImage =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";

              return (
                <Link
                  to={`/courses/${course._id}`}
                  key={course._id || idx}
                  className="group block"
                >
                  <div className="h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={course.coverImage || fallbackImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <h4 className="font-semibold">{course.title}</h4>

                  {/* 🔥 REAL PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-primary-500 h-full rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-right mt-1">
                    {progress.toFixed(0)}% Complete
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;