import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Clock, ClipboardCheck, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ fileUrl: '', submissionText: '' });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '' });

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/my-tasks');
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
    if (!submissionForm.fileUrl && !submissionForm.submissionText) return;

    try {
      setSubmittingId(taskId);
      await api.post(`/tasks/${taskId}/submit`, submissionForm);
      setSubmissionForm({ fileUrl: '', submissionText: '' });
      setSelectedTaskId(null);
      fetchTasks();
    } finally {
      setSubmittingId(null);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', taskForm);
    setTaskForm({ title: '', description: '', dueDate: '' });
    fetchTasks();
  };

  const evaluate = async (taskId, submissionId) => {
    const score = Number(window.prompt('Enter score out of 100'));
    const feedback = window.prompt('Feedback for student') || '';
    if (Number.isNaN(score)) return;

    await api.put(`/tasks/${taskId}/evaluate/${submissionId}`, { score, feedback });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (user?.role !== 'student') return true;
    if (activeTab === 'pending') return !task.mySubmission || task.mySubmission.status !== 'evaluated';
    return task.mySubmission?.status === 'evaluated';
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold">Tasks & Assignments</h2>
        <p className="text-gray-500">Submit, review, and evaluate coursework.</p>
      </div>

      {user?.role === 'student' && (
        <div className="flex gap-6 border-b pb-2">
          <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}>Pending</button>
          <button onClick={() => setActiveTab('completed')} className={activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}>Completed</button>
        </div>
      )}

      {(user?.role === 'mentor' || user?.role === 'admin') && (
        <form onSubmit={createTask} className="card p-5 grid md:grid-cols-4 gap-3">
          <input className="input-field" placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
          <input className="input-field" placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required />
          <input className="input-field" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} required />
          <button className="btn-primary inline-flex items-center justify-center gap-2" type="submit"><Plus size={16} /> Create Task</button>
        </form>
      )}

      {loading ? <p className="text-center">Loading...</p> : filteredTasks.length === 0 ? <p className="text-center text-gray-500">No tasks available</p> : (
        <div className="space-y-4">
          {filteredTasks.map((task, i) => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 bg-white border rounded-xl shadow space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${task.mySubmission?.status === 'evaluated' ? 'bg-green-100 text-green-600' : task.mySubmission?.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-orange-100 text-orange-600'}`}>
                    {task.mySubmission?.status === 'evaluated' ? <CheckCircle /> : <Clock />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toDateString()}</p>
                  </div>
                </div>

                {user?.role === 'student' && (
                  <button onClick={() => setSelectedTaskId(selectedTaskId === task._id ? null : task._id)} className="px-4 py-2 border rounded flex items-center gap-2">
                    <Upload size={16} /> Submit
                  </button>
                )}
              </div>

              {user?.role === 'student' && selectedTaskId === task._id && (
                <div className="grid md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border">
                  <input className="input-field" placeholder="GitHub/Drive link (optional)" value={submissionForm.fileUrl} onChange={(e) => setSubmissionForm({ ...submissionForm, fileUrl: e.target.value })} />
                  <input className="input-field" placeholder="Text answer (optional)" value={submissionForm.submissionText} onChange={(e) => setSubmissionForm({ ...submissionForm, submissionText: e.target.value })} />
                  <button disabled={submittingId === task._id} onClick={() => handleSubmit(task._id)} className="btn-primary md:col-span-2">
                    {submittingId === task._id ? 'Submitting...' : 'Submit Task'}
                  </button>
                </div>
              )}

              {user?.role === 'student' && task.mySubmission?.status === 'evaluated' && (
                <p className="text-green-700 inline-flex items-center gap-2"><ClipboardCheck size={16} /> Score: {task.mySubmission.score} | {task.mySubmission.feedback || 'No feedback'}</p>
              )}

              {(user?.role === 'mentor' || user?.role === 'admin') && (
                <div className="space-y-2">
                  <h4 className="font-medium">Submissions</h4>
                  {task.submissions?.length ? task.submissions.map((submission) => (
                    <div key={submission._id} className="border rounded p-3 flex justify-between items-center">
                      <div className="text-sm">
                        <p>{submission.student?.name} ({submission.student?.email})</p>
                        <p className="text-gray-500">{submission.fileUrl || submission.submissionText || 'No content'}</p>
                      </div>
                      <button className="px-3 py-1 border rounded" onClick={() => evaluate(task._id, submission._id)}>Evaluate</button>
                    </div>
                  )) : <p className="text-sm text-gray-500">No submissions yet</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
