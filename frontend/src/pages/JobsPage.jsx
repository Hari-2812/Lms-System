import { useEffect, useState } from 'react';
import axios from 'axios';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await axios.get(`${API_URL}/api/jobs`);
      setJobs(data || []);
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Job / Internship Updates</h2>
      {jobs.length === 0 ? <p>No updates available.</p> : jobs.map((job) => (
        <a className="block p-4 border rounded hover:bg-gray-50" href={job.link} key={job._id} target="_blank" rel="noreferrer">
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm text-gray-600">{job.company}</p>
        </a>
      ))}
    </div>
  );
};

export default JobsPage;
