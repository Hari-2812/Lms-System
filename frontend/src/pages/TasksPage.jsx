import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(Array.isArray(data) ? data : []);
    } catch (_err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (taskId) => {
    const fileUrl = window.prompt('Paste your submission link (Drive/GitHub)');
    if (!fileUrl) return;

    try {
      setSubmittingId(taskId);
      await axios.post(
        `${API_URL}/api/tasks/${taskId}/submit`,
        { fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'pending') return !task.mySubmission || task.mySubmission.status !== 'evaluated';
    return task.mySubmission?.status === 'evaluated';
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b pb-4"><h2 className="text-3xl font-bold">Tasks & Assignments</h2><p className="text-gray-500">Submit and track your work.</p></div>
      <div className="flex gap-6 border-b pb-2">
        <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}>Pending</button>
        <button onClick={() => setActiveTab('completed')} className={activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}>Completed</button>
      </div>

      {loading ? <p className="text-center">Loading...</p> : filteredTasks.length === 0 ? <p className="text-center text-gray-500">No tasks available</p> : (
        <div className="space-y-4">
          {filteredTasks.map((task, i) => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 bg-white border rounded-xl shadow flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${task.mySubmission?.status === 'evaluated' ? 'bg-green-100 text-green-600' : task.mySubmission?.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-orange-100 text-orange-600'}`}>
                  {task.mySubmission?.status === 'evaluated' ? <CheckCircle /> : <Clock />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toDateString()}</p>
                </div>
              </div>

              <div className="text-right space-y-2">
                {user?.role === 'student' && (
                  !task.mySubmission || task.mySubmission?.status === 'pending' ? (
                    <button disabled={submittingId === task._id} onClick={() => handleSubmit(task._id)} className="px-4 py-2 border rounded flex items-center gap-2">
                      <Upload size={16} /> {submittingId === task._id ? 'Uploading...' : task.mySubmission ? 'Re-upload' : 'Submit'}
                    </button>
                  ) : null
                )}
                {task.mySubmission?.status === 'pending' && <p className="text-yellow-600 text-sm">Under Review</p>}
                {task.mySubmission?.status === 'evaluated' && <p className="text-green-600 font-bold">Score: {task.mySubmission.score}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
