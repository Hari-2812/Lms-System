import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';
import api from '../lib/api';

const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, enrollRes] = await Promise.all([api.get('/courses'), api.get('/enrollments/my')]);
      setCourses(courseRes.data || []);
      setEnrolledIds(new Set((enrollRes.data || []).map((e) => e.course?._id)));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/enrollments', { courseId });
      setMessage('Enrolled successfully');
      await fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return <div className="text-center py-12">Loading courses...</div>;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold">Explore Courses</h2>
          <p className="text-gray-500">Browse and enroll in courses to start learning.</p>
        </div>
        <Link to="/my-courses" className="btn-primary">My Enrolled Courses</Link>
      </div>

      {message && <p className="text-sm text-primary-600">{message}</p>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledIds.has(course._id);
          return (
            <article key={course._id} className="card">
              <img src={course.coverImage || fallbackImage} alt={course.title} className="w-full h-44 object-cover" />
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description || 'No description added yet.'}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1"><BookOpen size={16} /> {course.modules?.length || 0} modules</span>
                  <span className="inline-flex items-center gap-1"><Users size={16} /> {course.instructor?.name || 'Instructor'}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`/courses/${course._id}`} className="px-3 py-2 border rounded-lg text-sm">View</Link>
                  <button disabled={isEnrolled} onClick={() => handleEnroll(course._id)} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isEnrolled ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CoursesPage;
