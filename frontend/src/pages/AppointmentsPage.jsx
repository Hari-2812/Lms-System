import { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsPage = () => {
  const [form, setForm] = useState({ mentor: '', date: '', time: '' });
  const [mentors, setMentors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    const [mentorRes, myAppointments] = await Promise.all([
      axios.get(`${API_URL}/api/users/mentors`),
      axios.get(`${API_URL}/api/appointments/my`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    setMentors(mentorRes.data || []);
    setAppointments(myAppointments.data || []);
    if (!form.mentor && mentorRes.data?.[0]?._id) {
      setForm((prev) => ({ ...prev, mentor: mentorRes.data[0]._id }));
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
      await axios.post(`${API_URL}/api/appointments`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Appointment booked successfully');
      setForm((prev) => ({ ...prev, date: '', time: '' }));
      await fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white space-y-6">
      <h2 className="text-2xl font-bold">Book Appointment</h2>
      <form onSubmit={submitHandler} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <div>
          <label className="block mb-1">Select Mentor</label>
          <select className="w-full p-2 bg-gray-700 rounded" value={form.mentor} onChange={(e) => setForm({ ...form, mentor: e.target.value })}>
            {mentors.map((mentor) => <option key={mentor._id} value={mentor._id}>{mentor.name}</option>)}
          </select>
        </div>
        <div><label className="block mb-1">Date</label><input type="date" value={form.date} className="w-full p-2 bg-gray-700 rounded" onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div><label className="block mb-1">Time</label><input type="time" value={form.time} className="w-full p-2 bg-gray-700 rounded" onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
        <button type="submit" disabled={loading} className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600">{loading ? 'Booking...' : 'Book Appointment'}</button>
        {message && <p className="text-center mt-2 text-green-400">{message}</p>}
      </form>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">My Appointments</h3>
        {appointments.length === 0 ? <p className="text-gray-400">No appointments yet.</p> : (
          appointments.map((appt) => (
            <div key={appt._id} className="border-b border-gray-700 py-2">
              <p>{appt.date} {appt.time} with {appt.mentor?.name}</p>
              <p className="text-sm text-gray-400">Status: {appt.status} {appt.meetLink ? `| Meet: ${appt.meetLink}` : ''}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
