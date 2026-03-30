import { useEffect, useState, useContext } from 'react';
import { CalendarDays, Clock3, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';

const AppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ mentor: '', date: '', time: '' });
  const [mentors, setMentors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    try {
      setFetching(true);
      setMessage('');
      const [mentorRes, myAppointments] = await Promise.all([
        api.get('/users/mentors'),
        api.get('/appointments/my'),
      ]);

      const mentorsData = Array.isArray(mentorRes.data) ? mentorRes.data : [];
      setMentors(mentorsData);
      setAppointments(myAppointments.data || []);
      if (!form.mentor && mentorsData[0]?._id) {
        setForm((prev) => ({ ...prev, mentor: mentorsData[0]._id }));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.mentor || !form.date || !form.time) return setMessage('Please fill all fields');

    try {
      setLoading(true);
      await api.post('/appointments', form);
      setMessage('Appointment booked successfully');
      setForm((prev) => ({ ...prev, date: '', time: '' }));
      await fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/approve`, { status });
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update appointment');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold">Appointment Booking</h2>
        <p className="text-gray-500">Schedule 1:1 sessions with mentors and track approvals.</p>
      </div>

      {user?.role === 'student' && (
        <form onSubmit={submitHandler} className="card p-6 grid md:grid-cols-4 gap-4">
          <select className="input-field" value={form.mentor} onChange={(e) => setForm({ ...form, mentor: e.target.value })} required>
            <option value="">Select mentor</option>
            {mentors.map((mentor) => <option key={mentor._id} value={mentor._id}>{mentor.name}</option>)}
          </select>
          <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} className="input-field" onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <input type="time" value={form.time} className="input-field" onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Booking...' : 'Book Appointment'}</button>
        </form>
      )}
      {user?.role === 'student' && mentors.length === 0 && <p className="text-sm text-amber-600">No mentors available yet. Please ask admin to create mentor accounts.</p>}

      {message && <p className="text-sm text-primary-600">{message}</p>}

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-3">{user?.role === 'student' ? 'My Appointments' : 'Incoming Appointments'}</h3>
        {fetching ? <p className="text-gray-500">Loading appointments...</p> : appointments.length === 0 ? <p className="text-gray-500">No appointments yet.</p> : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt._id} className="border rounded-lg p-4 flex flex-wrap gap-4 justify-between items-center bg-gray-50">
                <div className="space-y-1">
                  <p className="font-medium inline-flex items-center gap-2"><CalendarDays size={16} /> {appt.date}</p>
                  <p className="text-sm text-gray-600 inline-flex items-center gap-2"><Clock3 size={16} /> {appt.time}</p>
                  <p className="text-sm text-gray-600">Mentor: {appt.mentor?.name} | Student: {appt.student?.name}</p>
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border"><CheckCircle size={14} /> {appt.status}</span>
                  {(user?.role === 'mentor' || user?.role === 'admin') && appt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border rounded" onClick={() => updateStatus(appt._id, 'approved')}>Approve</button>
                      <button className="px-3 py-1 border rounded" onClick={() => updateStatus(appt._id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
