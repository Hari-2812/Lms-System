import { useEffect, useState } from 'react';
import axios from 'axios';

const TicketsPage = () => {
  const [question, setQuestion] = useState('');
  const [tickets, setTickets] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
    const { data } = await axios.get(`${API_URL}/api/tickets/my-tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTickets(data || []);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    await axios.post(`${API_URL}/api/tickets`, { question }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestion('');
    fetchTickets();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Doubt Clarification Tickets</h2>
      <form onSubmit={createTicket} className="space-y-2">
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full border rounded p-3" placeholder="Write your doubt..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Raise Ticket</button>
      </form>

      <div className="space-y-2">
        {tickets.map((t) => (
          <div key={t._id} className="p-3 border rounded">
            <p className="font-medium">{t.question}</p>
            <p className="text-sm">Status: {t.status}</p>
            {t.reply && <p className="text-green-700 text-sm mt-1">Reply: {t.reply}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
