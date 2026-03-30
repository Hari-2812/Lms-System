import { useEffect, useState } from 'react';
import api from '../lib/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setError('');
        const { data } = await api.get('/jobs');
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Job / Internship Updates</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? <p>Loading jobs...</p> : jobs.length === 0 ? <p>No updates available.</p> : jobs.map((job) => (
        <article className="p-4 border rounded hover:bg-gray-50 space-y-2" key={job._id}>
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm text-gray-600">{job.company}</p>
          <p className="text-sm text-gray-700">{job.description}</p>
          <a className="inline-block px-3 py-1 rounded bg-blue-600 text-white text-sm" href={job.applyLink || job.link || '#'} target="_blank" rel="noreferrer">Apply Now</a>
        </article>
      ))}
    </div>
  );
};

export default JobsPage;
