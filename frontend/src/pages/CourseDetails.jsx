import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, Clock, BookOpen, Loader } from 'lucide-react';
import api from '../lib/api';

const CourseVideoPlayer = React.lazy(() => import('../components/CourseVideoPlayer'));

const toEmbedUrl = (url = '') => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  return url;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseRes, enrollmentRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/enrollments/my'),
        ]);
        setCourse(courseRes.data);
        const enrolledCourseIds = new Set((enrollmentRes.data || []).map((item) => item.course?._id));
        setIsEnrolled(enrolledCourseIds.has(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const enrollCourse = async () => {
    try {
      setEnrolling(true);
      await api.post('/enrollments', { courseId: course._id });
      setMessage('🎉 Enrolled successfully!');
      setIsEnrolled(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>Error: {error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 underline">Go Back</button>
      </div>
    );
  }

  if (!course) return null;
  const playableUrl = toEmbedUrl(course.videoUrl || course.modules?.[0]?.videoUrl || '');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card overflow-hidden">
        <div className="h-64 w-full relative">
          <img src={course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900'} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-sm text-gray-100 mt-1">{course.description}</p>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Course Video</h3>
            {playableUrl ? (
              <div className="rounded-xl overflow-hidden border bg-black">
                {showVideoPlayer ? (
                  <React.Suspense fallback={<div className="text-white text-center py-10">Loading video player...</div>}>
                    <CourseVideoPlayer title={course.title} videoUrl={playableUrl} />
                  </React.Suspense>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVideoPlayer(true)}
                    className="w-full aspect-video flex items-center justify-center text-white bg-black/80 hover:bg-black transition"
                  >
                    ▶ Load Video Player
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No video is available for this course yet.</p>
            )}
            {!isEnrolled && playableUrl && (
              <p className="text-sm text-amber-600 mt-2">Enroll in this course for full access and progress tracking.</p>
            )}

            <h3 className="text-xl font-bold mt-6 mb-4">Modules</h3>
            {course.modules?.length ? course.modules.map((mod, i) => (
              <div key={i} className="p-3 border rounded mb-2 flex gap-3">
                <PlayCircle size={20} className="text-primary-500" />
                <div>
                  <p className="font-medium">{mod.title}</p>
                  <small className="text-gray-500">{mod.duration || 'Self-paced'}</small>
                </div>
              </div>
            )) : <p className="text-gray-500">Modules will be added soon.</p>}
          </div>

          <div>
            <div className="card p-5">
              <h4 className="font-bold mb-4">Course Info</h4>
              <p className="mb-2 inline-flex items-center gap-2 text-sm"><Clock size={14} /> Duration: Self-paced</p>
              <p className="mb-2 inline-flex items-center gap-2 text-sm"><BookOpen size={14} /> Modules: {course.modules?.length || 0}</p>
              <p className="mb-2 text-sm">Instructor: {course.instructor?.name || 'TBA'}</p>
              <button onClick={enrollCourse} disabled={enrolling || isEnrolled} className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {isEnrolled ? 'Already Enrolled' : enrolling ? 'Enrolling...' : `Enroll - ${course.price === 0 ? 'Free' : `$${course.price}`}`}
              </button>
              {message && <p className="text-sm mt-3 text-primary-600">{message}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetails;
