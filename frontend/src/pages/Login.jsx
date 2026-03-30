import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label>Email</label>
            <div className="flex items-center border rounded px-2">
              <Mail size={16} />
              <input type="email" className="w-full p-2 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="flex items-center border rounded px-2">
              <Lock size={16} />
              <input type="password" className="w-full p-2 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2">
            <LogIn size={16} /> Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
