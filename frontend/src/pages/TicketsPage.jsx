import { useEffect, useState } from 'react';
import api from '../lib/api';

const TicketsPage = () => {
  const [question, setQuestion] = useState('');
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      setError('');
      const { data } = await api.get('/tickets/my-tickets');
      setTickets(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setError('');
      await api.post('/tickets', { question });
      setQuestion('');
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise ticket');
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Doubt Clarification Tickets</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
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
