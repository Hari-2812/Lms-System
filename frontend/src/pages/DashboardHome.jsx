import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, CalendarClock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="card p-6 flex items-center gap-4"
  >
    <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ courses: 0, tasks: 0, appointments: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError('');
        const [enrollRes, taskRes, appointmentRes] = await Promise.allSettled([
          api.get('/enrollments/my'),
          api.get('/tasks/my-tasks'),
          api.get('/appointments/my'),
        ]);

        const enrollments = enrollRes.status === 'fulfilled' ? enrollRes.value.data || [] : [];
        const tasks = taskRes.status === 'fulfilled' ? taskRes.value.data || [] : [];
        const appointments = appointmentRes.status === 'fulfilled' ? appointmentRes.value.data || [] : [];

        if ([enrollRes, taskRes, appointmentRes].some((item) => item.status === 'rejected')) {
          setError('Some dashboard sections could not be loaded. Please refresh.');
        }

        setStats({
          courses: enrollments.length,
          tasks: tasks.length,
          appointments: appointments.length,
        });

        const recent = [
          ...enrollments.slice(0, 2).map((item) => ({
            type: 'Enrollment',
            title: item.course?.title || 'Course',
            time: item.createdAt,
          })),
          ...tasks.slice(0, 2).map((item) => ({
            type: 'Task',
            title: item.title,
            time: item.createdAt,
          })),
          ...appointments.slice(0, 2).map((item) => ({
            type: 'Appointment',
            title: `${item.date} ${item.time}`,
            time: item.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setActivities(recent);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="card p-7 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">Hi {user?.name}, ready to learn today?</h2>
        <p className="text-primary-100 mt-1">Track your courses, submit tasks, and manage mentor sessions in one place.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/courses" className="px-4 py-2 bg-white text-primary-700 rounded-lg font-medium">Browse Courses</Link>
          <Link to="/tasks" className="px-4 py-2 border border-white/40 rounded-lg font-medium">View Tasks</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard title="Courses" value={stats.courses} icon={BookOpen} delay={0.1} />
        <StatCard title="Tasks" value={stats.tasks} icon={CheckCircle2} delay={0.2} />
        <StatCard title="Appointments" value={stats.appointments} icon={CalendarClock} delay={0.3} />
      </section>

      {error && <p className="text-sm text-amber-600">{error}</p>}

      <section className="card p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Activity size={18} /> Recent Activities</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500 mt-4">No recent activity yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activities.map((activity, idx) => (
              <li key={`${activity.type}-${idx}`} className="p-3 rounded-lg bg-gray-50 border text-sm flex justify-between">
                <span><strong>{activity.type}:</strong> {activity.title}</span>
                <span className="text-gray-500">{new Date(activity.time).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardHome;
