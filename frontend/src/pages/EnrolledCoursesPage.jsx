import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const EnrolledCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/my');
        setEnrollments(data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <div className="text-center py-10">Loading enrolled courses...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">My Courses</h2>
          <p className="text-gray-500">Track your progress in enrolled courses.</p>
        </div>
        <Link to="/courses" className="px-4 py-2 border rounded-lg">Browse more</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">You have not enrolled in any course yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map(({ _id, course, progress }) => (
            <div key={_id} className="card p-5 space-y-3">
              <h3 className="font-semibold text-lg">{course?.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{course?.description || 'No description available.'}</p>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-primary-500" style={{ width: `${progress || 0}%` }} />
              </div>
              <p className="text-sm text-gray-600">Progress: {(progress || 0).toFixed(0)}%</p>
              <Link to={`/courses/${course?._id}`} className="btn-primary inline-block text-center">Continue</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
