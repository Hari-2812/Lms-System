import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Video } from 'lucide-react';
import api from '../lib/api';
import { getCachedValue, setCachedValue } from '../lib/cache';

const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const cachedCourses = getCachedValue('courses', 120_000);
      const cachedEnrollments = getCachedValue('my_enrollments', 20_000);

      const [courseRes, enrollRes] = await Promise.all([
        cachedCourses ? Promise.resolve({ data: cachedCourses }) : api.get('/courses'),
        cachedEnrollments ? Promise.resolve({ data: cachedEnrollments }) : api.get('/enrollments/my'),
      ]);

      const coursesData = Array.isArray(courseRes.data) ? courseRes.data : [];
      const enrollmentsData = enrollRes.data || [];

      setCourses(coursesData);
      setEnrolledIds(new Set(enrollmentsData.map((e) => e.course?._id)));
      setCachedValue('courses', coursesData);
      setCachedValue('my_enrollments', enrollmentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = useCallback(async (courseId) => {
    try {
      await api.post('/enrollments', { courseId });
      setMessage('Enrolled successfully');
      await fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
    }
  }, [fetchData]);

  const courseCards = useMemo(() => courses.map((course) => {
    const isEnrolled = enrolledIds.has(course._id);
    return (
      <article key={course._id} className="card">
        <img loading="lazy" decoding="async" src={course.coverImage || fallbackImage} alt={course.title} className="w-full h-44 object-cover" />
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{course.description || 'No description added yet.'}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="inline-flex items-center gap-1"><BookOpen size={16} /> {course.modules?.length || 0} modules</span>
            <span className="inline-flex items-center gap-1"><Users size={16} /> {course.instructor?.name || 'Instructor'}</span>
          </div>
          <p className="text-xs text-primary-600 inline-flex items-center gap-1"><Video size={14} /> {course.videoUrl ? 'Video lesson included' : 'Module-level videos available'}</p>
          <div className="flex gap-2 pt-2">
            <Link to={`/courses/${course._id}`} className="px-3 py-2 border rounded-lg text-sm">View Course</Link>
            <button disabled={isEnrolled} onClick={() => handleEnroll(course._id)} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {isEnrolled ? 'Enrolled' : 'Enroll'}
            </button>
          </div>
        </div>
      </article>
    );
  }), [courses, enrolledIds, handleEnroll]);

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
      {error && <p className="text-sm text-red-600">{error}</p>}

      {courses.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No courses available right now. Seed data or create new courses from admin panel.</div>
      ) : (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courseCards}
      </div>
      )}
    </section>
  );
};

export default CoursesPage;
